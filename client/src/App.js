import React from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Header from './components/Header'
import { UserContextProvider } from "./UserContext";
import Signin from './components/Signin'
import LoginPage from "./components/Login";
import Main from "./components/Main";
import Homepage from "./components/Homepage";
import { ChatsProvider } from "./ChatContext";


// import './index.css'
const App = () => {
  return (
    <ChatsProvider>
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Main />} >
              <Route index element={<Homepage />} />

            </Route>
            <Route path={'/register'} element={<Signin />} />
            <Route path={'/Login'} element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </ChatsProvider>


  );
};

export default App;
