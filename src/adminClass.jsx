import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from "./Header.jsx";
import ClassEditor from "./classEditor.jsx";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header/>
    <ClassEditor/>
  </React.StrictMode>
);
