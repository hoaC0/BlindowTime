import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from "./Header.jsx";
import TempSchedule from "./tempSchedule.jsx";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header />
    <TempSchedule />
  </React.StrictMode>
);
