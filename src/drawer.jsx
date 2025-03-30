import React, { useRef, useEffect } from "react";
import './styles/drawer.css';

const Drawer = ({ isOpen, toggleDrawer }) => {
  const drawerRef = useRef(null);

  // check ob ausserhalb geklickt wurde
  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      toggleDrawer(); // drawer schliessen
    }
  };

  useEffect(() => {
    if (isOpen) {
      // wenn offen
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // stoppen wenn zu
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // aufraeum
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
          <li onClick={() => window.location.href = 'kalender.html'}>Kalender</li>
          <li onClick={() => window.location.href = 'todo.html'}>Aufgabenliste</li>
          <li onClick={() => window.location.href = 'mensa.html'}>Mensa</li>
          
        </ul>
      </div>
    </div>
  );
};

export default Drawer;