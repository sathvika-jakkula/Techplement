import React, { useState, useEffect, useContext, useRef } from 'react';
import './Homepage.css';
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import { Link, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import {format} from 'date-fns';
import { useMessages } from '../ChatContext';
import { UserContext } from '../UserContext';
import socket from '../socket';


const Homepage = () => {
  const [message, setMessage] = useState("");
  const { messages, updateMessages } = useMessages();
  const [initialChatFetched, setInitialChatFetched] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const [redirect, setRedirect] = useState(false); 
  const { userinfo } = useContext(UserContext);
  const chatWindowRef = useRef(null);

  const username = userinfo?.firstname;
  const sendchat = (e) => {
    if (username) {
      e.preventDefault();
      socket.emit("sendMessage", { message, username });
      setMessage("");
    } else {
      if (window.confirm("Please log in to send messages. Click OK to log in.")) {
        setRedirect(true); 
      }
    }
  }


  



  useEffect(() => {
    socket.on('receiveMessage', (payload) => {
      updateMessages([...messages, payload]);
      setInitialChatFetched(false);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [initialChatFetched, messages]);

  useEffect(() => {
    if (!initialChatFetched) {
      socket.emit('getPrevChat');
      setInitialChatFetched(true);
    }
    socket.on('prevMessages', intialChat => {
      console.log("initial chat", intialChat);
      updateMessages(intialChat);
    });
    return () => {
      socket.off("prevMessages");
    };
  }, [messages]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  if (redirect) {
    return <Navigate to='/login' />;
  }

  return (
    <div>

      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((payload, index) => {
          const isCurrentUser = payload.author === userinfo?.firstname;
          return (
       
            <>
            {
              payload.joinedInfo && <p style={{margin:'auto',paddingBottom:'10px'}}>{payload.joinedInfo}</p>
            }
            {((!payload.joinedInfo) && isCurrentUser) &&  
              <div className="message right">
              
                <div className='head'>
                  <h1>{isCurrentUser ? ' ' : `${payload.author}       `}</h1>
                  <p className='date'>{format(new Date(payload.createdAt), "dd/MMM/yyyy hh:mm a")}</p>
                </div>
                <p
                  key={index}
                >
                  {payload.message}
                </p>
              </div>
        }
            
            {((!payload.joinedInfo) && (!isCurrentUser)) &&  
            < div className='chat'>
                <Avatar sx={{ backgroundColor: '#E0E0E0', marginTop: '10px', marginLeft:'10px',color:"#000000" }}>{payload.author && payload.author.charAt(0).toUpperCase()}</Avatar>
    <div className="message left">

                <div className='head'>
                  <h1>{isCurrentUser ? ' ' : `${payload.author}       `}</h1>
                  <p className='date'>{format(new Date(payload.createdAt), "dd/MMM/yyyy hh:mm a")}</p>
          
                </div>
                <p
                  key={index}
                >
                  {payload.message}
                </p>
              </div>
              </div>
        }
            </>
        )})}
      </div>
      <form onSubmit={sendchat} className="formm">
  <input type="text" placeholder='message' className='input' value={message} onChange={e => setMessage(e.target.value)} />
  <SendIcon className='button' type="submit" onClick={sendchat} />
</form>
    </div>
  );
};

export default Homepage;
