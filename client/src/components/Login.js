// LoginPage.js
import React , {useState,useEffect,useContext} from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Container, Typography, TextField, Button } from '@mui/material';
import {UserContext} from '../UserContext';
import { useMessages } from '../ChatContext';
import socket from '../socket';

const LoginPage = () => {
  
  const [firstname,setFirstname] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const {userinfo,setUserinfo} = useContext(UserContext);
  const { messages, updateMessages } = useMessages();

  useEffect(() => {
    
    // Listen for the broadcast message event from the server
    socket.on('user-joined-message', (message) => {
      // Update the chat with the broadcast message
      updateMessages([...messages, { message }]);
    });
  
    return () => {
      // Remove the event listener when the component unmounts
      socket.off('user-joined-message');
    };
  }, [userinfo]);

  // async function login(e){
  //     e.preventDefault();
  //     const response = await fetch('http://127.0.0.1:4000/login' , {
  //       method:'POST',
  //       body: JSON.stringify({email,password}),
  //       headers:{'Content-Type' : 'application/json'},
  //       credentials:'include',
  //     })
  //     console.log(response);
  //     if(response.ok){
  //       alert("login success");
  //       setRedirect(true);
  //     }else{
  //       alert("wrong credentials");
  //     }
  // }

  async function login(e){
    e.preventDefault();
    
   const response = await fetch('http://127.0.0.1:4000/login', {
        method: 'POST',
        body: JSON.stringify({firstname,password}),
        headers:{'Content-Type':'application/json'},
        credentials: 'include',
    })
    if(response.ok){
      response.json().then(userinfo => {
        setUserinfo(userinfo);
        socket.emit('user-entered',userinfo.firstname);
        setRedirect(true);
    })
       

    }else{
        alert('wrong credentials')
    }
}



 
  if(redirect){
    return <Navigate to={'/'} />
  }


  return (
    <Container maxWidth="sm" sx={{ paddingTop: 12 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {/* <form onSubmit={login}>
        <TextField label="Email" type="email" fullWidth margin="normal"  value = {email} onChange={e => setEmail(e.target.value)}/>
        <TextField label="Password" type="password" fullWidth margin="normal" value = {password} onChange={e => setPassword(e.target.value)}/>
        <Button variant="contained" color="primary"  >
          Login
        </Button>
      </form> */}
       <form onSubmit={login}>
        
        {/* <TextField label="Username" fullWidth margin="normal" value={firstname} onChange={e => setFirstname(e.target.value)}/> */}
        <TextField label="Firstname" type="text" fullWidth margin="normal" value={firstname} onChange={e => setFirstname(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
      
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'logging in...' : 'login'}
        </Button>
      </form>
      <Typography variant="body1" marginTop="20px">
        Don't have an account? <Link to="/register">Register</Link>
      </Typography>
    </Container>
  );
};

export default LoginPage;
