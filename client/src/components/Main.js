// Main.js

import React from 'react';
import { Outlet } from "react-router-dom"
import Header from "./Header.js";
import { Link } from 'react-router-dom';

function Main() {
  return (
    <main >
    <Header />
    <Outlet />
    </main>
  );
}

export default Main;
