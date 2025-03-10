import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from "./Header.jsx";
import AdminDashboard from "./admin-dashboard.jsx";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header/>
    <AdminDashboard/>
  </React.StrictMode>
);