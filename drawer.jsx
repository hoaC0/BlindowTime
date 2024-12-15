import React from "react";
import './drawer.css';

const Drawer = ({ isOpen, toggleDrawer }) => {
  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-content">
        <button className="close-button" onClick={toggleDrawer} aria-label="Close menu">
          &times;
        </button>
        <h3>BlindowTime</h3>
        <ul>
          <li>Home</li>
          <li>Stundenplan</li>
          <li>ToDo</li>
          <li>Kalender</li>
        </ul>
      </div>
    </div>
  );
};

export default Drawer;




