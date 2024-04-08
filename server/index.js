const express = require("express");
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors:{
        origin: "http://localhost:3000",
        methods:["GET","POST"],
        credentials: true
    },
    transports:["websocket","polling"]
});

io.on("connection", async (socket) => {
    socket.on('getPrevChat', async ()=>{
        try{
            const chatHistory = await Message.find();
            socket.emit('prevMessages',chatHistory);
        }
        catch(err){
            console.log('Error fetching initial chat history:',err);
        }
    });

    socket.on('sendMessage', async (payload)=>{
        console.log("author",payload.username)
        const messageData = await Message.create({message: payload.message, author:payload.username});
        console.log(messageData)
        io.emit('receiveMessage',messageData);
    })

      socket.on('user-entered', async (username) => {
        try {
            const newMessage = await Message.create({
              author: username,
              joinedInfo: `${username} has joined the chat`
            });
        
            io.emit('user-joined-message', newMessage);
          } catch (error) {
            console.error('Error creating and broadcasting user-joined message:', error);
          }
      });
    
})




app.use(express.json());
app.use(cookieparser());
app.use(cors({credentials:true,origin:'http://localhost:3000'}));

const salt = bcrypt.genSaltSync(10);
const secret = 'tfgxsnsui56b3dbc839udjndb389odjmcn';

mongoose.connect('mongodb://127.0.0.1:27017/chatapplication');

app.post('/register', async (req, res) => {
    const { firstname, password } = req.body;
    console.log(req.body);
    try {
        const hashedPassword = bcrypt.hashSync(password, salt);
        console.log(hashedPassword);   
        const user = await User.create({ firstname, password: hashedPassword });
        console.log("User registered:", user);
        res.json(user);
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
});






app.post('/login', async (req,res)  => {
    const {firstname,password} = req.body;
    console.log(password);
    try{
        const userdoc = await User.findOne({firstname:firstname});
        
        console.log(userdoc);
        console.log("hii");
        if(!userdoc){
            return res.status(400).json("User Not Found");
        }
        const ok = bcrypt.compareSync(password,userdoc.password);
        console.log(ok);
        if(ok){
            jwt.sign({firstname, id : userdoc._id} , secret , {} , (err, token) => {
                    if(err) throw err;
                    res.cookie('token', token).json({
                        id:userdoc.id,
                        firstname:userdoc.firstname,
                    });
                });
         }else{
         res.status(400).json("wrong credentials");
        }
    }catch(e){
        console.log(e.message);
        res.status(500).json(e.message);
    }
})


app.get('/profile', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json("Token not provided");
        }
        const info = await jwt.verify(token, secret);

        res.send(info);
    } catch (err) {
        res.status(401).json("Invalid token");
    }
});

app.post('/logout' , (req,res) => {
    res.cookie('token','').json('ok');
   })

server.listen(4000);