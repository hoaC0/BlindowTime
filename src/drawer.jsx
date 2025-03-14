import React, { useRef, useEffect } from "react";
import './drawer.css';

const Drawer = ({ isOpen, toggleDrawer }) => {
  const drawerRef = useRef(null);

  // check if outside
  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      toggleDrawer(); // close drawer
    }
  };

  useEffect(() => {
    if (isOpen) {
      // when open ( drawer )
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // stop when closed ( drawer )
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`} ref={drawerRef}>
      <div className="drawer-content">
        <button className="close-button" onClick={toggleDrawer}>
          &times;
        </button>
        <h3>BlindowTime</h3>
        <ul>
          <li onClick={() => window.location.href = 'index.html'}>Home</li>
          <li onClick={() => window.location.href = 'stundenplan.html'}>Stundenplan</li>
          <li onClick={() => window.location.href = 'todo.html'}>Aufgabenliste</li>
          <li onClick={() => window.location.href = 'kalender.html'}>Kalender</li>
        </ul>
      </div>
    </div>
  );
};

export default Drawer;





