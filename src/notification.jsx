import React, { useState, useEffect, useRef } from 'react';
import './notification.css';

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const panelRef = useRef(null);

  // Beispiel-Benachrichtigungen (in einer echten App würden diese vom Backend kommen)
  useEffect(() => {
    // Simuliere das Laden von Benachrichtigungen
    const demoNotifications = [
      {
        id: 1,
        message: "Willkommen zum neuen Semester! Bitte denken Sie daran, alle wichtigen Dokumente bis zum Ende des Monats einzureichen.",
        time: "Vor 5 min"
      },
      {
        id: 2,
        message: "Willkommen zum neuen Semester! Bitte denken Sie daran, alle wichtigen Dokumente bis zum Ende des Monats einzureichen.",
        time: "Vor 15 min"
      },
      {
        id: 3,
        message: "Willkommen zum neuen Semester! Bitte denken Sie daran, alle wichtigen Dokumente bis zum Ende des Monats einzureichen.",
        time: "Gestern"
      }
    ];
    
    setNotifications(demoNotifications);
    setHasUnread(true);
  }, []);

  // Öffnen/Schließen des Benachrichtigungspanels
  const togglePanel = () => {
    setIsOpen(!isOpen);
    
    // Benachrichtigungen als gelesen markieren, wenn Panel geöffnet wird
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  // Klick außerhalb des Panels schließt es
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && 
          !event.target.classList.contains('notification-bell') &&
          !event.target.closest('.notification-trigger')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Glocken-Symbol zum Öffnen des Panels */}
      <button className="notification-trigger" onClick={togglePanel}>
        <span className="notification-bell">🔔</span>
        {hasUnread && <span className="notification-dot"></span>}
      </button>

      {/* Benachrichtigungspanel */}
      <div 
        ref={panelRef}
        className={`notification-panel ${isOpen ? 'open' : ''}`}
      >
        <div className="notification-header">
          <h2>Sekretariat Nachrichten</h2>
          <button className="notification-close" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>
        
        <div className="notification-content">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-time">
                  {notification.time}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-notifications">
              <p>Keine Benachrichtigungen vorhanden</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notification;