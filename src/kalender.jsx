import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from "./Header.jsx";
import Kalender from './kalenderElement.jsx';



createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header/>
    <Kalender/>
  </React.StrictMode>
);