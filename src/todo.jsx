import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from "./Header.jsx";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header/>
    <p>Todo</p>
  </React.StrictMode>
);