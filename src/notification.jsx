import React, { useState, useEffect, useRef } from 'react';
import './styles/notification.css';

const Notification = ({ bellIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const API_URL = 'http://localhost:3001/api';

  // initialisierung
  useEffect(() => {
    fetchNotifications();
  }, []);

  // daten vom server
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/notifications`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("geladene benachrichtigungen:", data);
        setNotifications(data);
        
        // check ob ungelesene
        const readStatus = getReadStatusFromCookies();
        checkForUnreadNotifications(data, readStatus);
      } else {
        // fallback
        console.error('fehler beim laden der benachrichtigungen:', response.status);
        setDemoNotifications();
      }
    } catch (error) {
      console.error('fehler beim laden der benachrichtigungen:', error);
      setDemoNotifications();
    } finally {
      setLoading(false);
    }
  };



useEffect(() => {
  // regelmassig updaten
  fetchNotifications();
  
  // alle 10sek updaten
  const updateInterval = setInterval(() => {
    fetchNotifications();
  }, 10000);
  
  // cleanup
  return () => {
    clearInterval(updateInterval);
  };
}, []);

  // demo daten
  const setDemoNotifications = () => {
    const demoNotifications = [
      {
        notification_id: "1",
        title: "Sekretariat",
        message: "Neuer Stundenplan fuer naechste Woche verfuegbar",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        formattedTime: "vor 2 Stunden",
        read: false,
        avatar: "S"
      },
      {
        notification_id: "2",
        title: "Klassenlehrer",
        message: "Elternabend am 15. Maerz um 19:00 Uhr",
        time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        formattedTime: "vor 5 Stunden",
        read: false,
        avatar: "K"
      },
      {
        notification_id: "3",
        title: "Schuldirektor",
        message: "Schulausflug zum Technikmuseum am 20. Maerz",
        time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        formattedTime: "vor 1 Tag",
        read: false,
        avatar: "D"
      }
    ];
    
    console.log("demo-benachrichtigungen gesetzt:", demoNotifications);
    setNotifications(demoNotifications);
    
    // check auf ungelesene
    const readStatus = getReadStatusFromCookies();
    checkForUnreadNotifications(demoNotifications, readStatus);
  };

  // lese-status aus cookies
  const getReadStatusFromCookies = () => {
    const cookieValue = getCookie('readNotifications');
    if (cookieValue) {
      try {
        return JSON.parse(cookieValue);
      } catch (error) {
        console.error('fehler beim parsen der lese-status aus cookie:', error);
        return {};
      }
    }
    return {};
  };

  // pruefe auf ungelesene
  const checkForUnreadNotifications = (notificationList = [], readStatus = {}) => {
    // array check
    if (!Array.isArray(notificationList)) {
      console.error('notificationList ist kein array:', notificationList);
      notificationList = [];
    }
    
    const hasUnreadMessages = notificationList.some(notification => 
      !notification.read && !readStatus[notification.notification_id]
    );
    setHasUnread(hasUnreadMessages);
  };

  // markiere als gelesen
  useEffect(() => {
    if (isOpen && hasUnread) {
      // alle als gelesen markieren
      const readStatus = getReadStatusFromCookies();
      
      let updated = false;
      notifications.forEach(notification => {
        if (!notification.read && !readStatus[notification.notification_id]) {
          readStatus[notification.notification_id] = true;
          updated = true;
        }
      });
      
      if (updated) {
        setCookie('readNotifications', JSON.stringify(readStatus), 30);
        setHasUnread(false);
        
        // update in liste
        setNotifications(notifications.map(notification => ({
          ...notification,
          read: true
        })));
      }
    }
  }, [isOpen, hasUnread, notifications]);

  // panel anzeigen/verstecken
  const togglePanel = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // klick ausserhalb schliesst
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

  // escape key
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

  // cookie helpers
  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  };

  // ist gelesen?
  const isNotificationRead = (id) => {
    const readStatus = getReadStatusFromCookies();
    return readStatus[id] === true;
  };

  return (
    <>
      {/* glocke mit rotem punkt */}
      <div 
        className="notification-trigger" 
        onClick={togglePanel}
        ref={triggerRef}
      >
        <img src={bellIcon} alt="Benachrichtigungen" className="icon" />
        {hasUnread && <span className="notification-dot"></span>}
      </div>

      {/* benachrichtigungspanel */}
      <div 
        ref={panelRef}
        className={`notification-panel ${isOpen ? 'open' : ''}`}
      >
        <div className="notification-header">
          <h2>Benachrichtigungen</h2>
        </div>
        
        <div className="notification-content">
          {loading ? (
            <div className="notification-loading">Benachrichtigungen werden geladen...</div>
          ) : error ? (
            <div className="notification-error">Fehler beim Laden der Benachrichtigungen</div>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.notification_id} 
                className={`notification-item ${notification.read || isNotificationRead(notification.notification_id) ? 'read' : ''}`}
              >
                <div className="notification-avatar">
                  <span className="notification-avatar-letter">
                    {notification.avatar || (notification.sender ? notification.sender.charAt(0) : (notification.title ? notification.title.charAt(0) : 'N'))}
                  </span>
                </div>
                <div className="notification-content-wrapper">
                  <div className="notification-title">{notification.title || notification.sender || 'Benachrichtigung'}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{notification.formattedTime}</div>
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