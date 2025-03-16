import React, { useState } from 'react';
import './Header.css';
import menuIcon from './assets/menu.svg';
import bellIcon from './assets/bell.svg';
import Drawer from './drawer';
import Notification from './notification';

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
          <a href="/../index.html" className="header-link"><h1 className="header-title">BlindowTime</h1></a>
        </div>
        <Notification bellIcon={bellIcon} />
      </div>
      <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </div>
  );
};

export default Header;

