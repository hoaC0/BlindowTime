import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from "./Header.jsx";
import MensaWochenplan from "./mensaWochenplan.jsx";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header/>
    <MensaWochenplan/>
  </React.StrictMode>
);