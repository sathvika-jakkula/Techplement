// RegisterPage.js
import React , {useState,useEffect,useContext} from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Container, Typography, TextField, Button } from '@mui/material';
import socket from '../socket';
import {UserContext} from '../UserContext';
import { useMessages } from '../ChatContext';


  

const RegisterPage = () => {
  const [firstname, setFirstname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');

  

  async function register(e) {
    e.preventDefault();
    setLoading(true);
    console.log(firstname);
    try {
      const response = await fetch('http://127.0.0.1:4000/register', {
        method: 'POST',
        body: JSON.stringify({ firstname, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        alert('Registration successful');  
             
        setRedirect(true);
      } else {
        const errorMessage = await response.text();
        setError(errorMessage.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if(redirect){
    return <Navigate to={'/login'} />
  }

  return (
    <Container maxWidth="sm" sx={{ paddingTop: 12 }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={register}>
        {/* ... (other form fields) */}
        <TextField label="Firstname" fullWidth margin="normal" value={firstname} onChange={e => setFirstname(e.target.value)}/>
       <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <Typography variant="body2" color="error">{error}</Typography>}
      
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
      <Typography variant="body1" marginTop="20px">
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </Container>
  );
};

export default RegisterPage;

