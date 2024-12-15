import React, { useState } from 'react';
import './header.css';
import menuIcon from './assets/menu.svg';
import bellIcon from './assets/bell.svg';
import Drawer from './drawer';

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      <div className="header">
        <div className="header-left">
          <button
            className="icon-button"
            onClick={toggleDrawer}
            aria-label="Toggle menu"
          >
            <img src={menuIcon} alt="Menu" className="icon" />
          </button>
          <h1 className="header-title">BlindowTime</h1>
        </div>
        <img src={bellIcon} alt="Notifications" className="icon" />
      </div>
      <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </div>
  );
};

export default Header;

