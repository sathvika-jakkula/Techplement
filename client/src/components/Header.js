import React, { useState,useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png"
import {UserContext} from "../UserContext";

function Header(){
   const {setUserinfo,userinfo} = useContext(UserContext);
    
        useEffect(() => {
            fetch('http://127.0.0.1:4000/profile', {
                credentials: 'include'
            }).then(res => {
                res.json().then(userinfo => {
                    setUserinfo(userinfo);
                });
            });
        }, []);
        
        function logout() {
            fetch('http://127.0.0.1:4000/logout', {
                credentials: 'include',
                method: 'POST'
            })
                setUserinfo(null);
        }
        
    const firstname = userinfo?.firstname;


    return(
        <header>
          <nav>
            <img src={logo} className="logo"/>
            {firstname && (
                <div className="headerelements">
                    <p className="userName">{`Hii, ${firstname}`}</p>
                    <a className="login" onClick={logout}>Logout</a>
                </div>
            )}
            {!firstname && (
                <div className="headerelements">
                     <Link to='/login'  className="login">Login</Link>
                    <Link to='/register' className="register">Register</Link>
                </div>
            )}
             
          </nav>
        </header>
    )
}

export default Header;