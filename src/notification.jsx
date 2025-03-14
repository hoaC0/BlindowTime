import React, { useState, useEffect, useRef } from 'react';
import './notification.css';

const Notification = ({ bellIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  // demo notifications (in a real app these would come from the backend)
  useEffect(() => {
    // simulate loading notifications
    const demoNotifications = [
      {
        id: 1,
        title: "Sekretariat",
        message: "Neuer Stundenplan für nächste Woche verfügbar",
        time: "vor 2 Stunden",
        avatar: "S"
      },
      {
        id: 2,
        title: "Klassenlehrer",
        message: "Elternabend am 15. März um 19:00 Uhr",
        time: "vor 5 Stunden",
        avatar: "K"
      },
      {
        id: 3,
        title: "Schuldirektor",
        message: "Schulausflug zum Technikmuseum am 20. März",
        time: "vor 1 Tag",
        avatar: "D"
      },
      {
        id: 4,
        title: "Sekretariat",
        message: "Bitte Anmeldeformulare für die Projektwoche bis Freitag abgeben",
        time: "vor 2 Tagen",
        avatar: "S"
      },
      {
        id: 5,
        title: "IT-Abteilung",
        message: "Wartungsarbeiten am Schulnetzwerk am Wochenende",
        time: "vor 3 Tagen",
        avatar: "I"
      }
    ];
    
    setNotifications(demoNotifications);
    setHasUnread(true);
  }, []);

  // toggle notification panel
  const togglePanel = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    
    // mark notifications as read when panel is opened
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  // close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen && 
        panelRef.current && 
        !panelRef.current.contains(event.target) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // close panel on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  return (
    <>
      {/* bell icon */}
      <div 
        className="notification-trigger" 
        onClick={togglePanel}
        ref={triggerRef}
      >
        <img src={bellIcon} alt="Benachrichtigungen" className="icon" />
        {hasUnread && <span className="notification-dot"></span>}
      </div>

      {/* notification panel */}
      <div 
        ref={panelRef}
        className={`notification-panel ${isOpen ? 'open' : ''}`}
      >
        <div className="notification-header">
          <h2>Benachrichtigungen</h2>
        </div>
        
        <div className="notification-content">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-avatar">
                  <span className="notification-avatar-letter">{notification.avatar}</span>
                </div>
                <div className="notification-content-wrapper">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{notification.time}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-notifications">
              <p>Keine Benachrichtigungen vorhanden</p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="more-notifications">
            Alle Benachrichtigungen ansehen
          </div>
        )}
      </div>
    </>
  );
};

export default Notification;