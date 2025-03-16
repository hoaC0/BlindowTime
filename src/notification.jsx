// src/notification.jsx - verbesserte Version

import React, { useState, useEffect, useRef } from 'react';
import './notification.css';

const Notification = ({ bellIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  // API_URL definieren
  const API_URL = 'http://localhost:3001/api';

  // Lade Benachrichtigungen beim Laden der Komponente
  useEffect(() => {
    // Setze direkt Demo-Benachrichtigungen ohne API-Aufruf
    setDemoNotifications();
  }, []);

  // Lade Demo-Benachrichtigungen, da der Server-Aufruf fehlschlägt
  const setDemoNotifications = () => {
    const demoNotifications = [
      {
        notification_id: "1",
        title: "Sekretariat",
        message: "Neuer Stundenplan für nächste Woche verfügbar",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // vor 2 Stunden
        formattedTime: "vor 2 Stunden",
        read: false,
        avatar: "S"
      },
      {
        notification_id: "2",
        title: "Klassenlehrer",
        message: "Elternabend am 15. März um 19:00 Uhr",
        time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // vor 5 Stunden
        formattedTime: "vor 5 Stunden",
        read: false,
        avatar: "K"
      },
      {
        notification_id: "3",
        title: "Schuldirektor",
        message: "Schulausflug zum Technikmuseum am 20. März",
        time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // vor 1 Tag
        formattedTime: "vor 1 Tag",
        read: false,
        avatar: "D"
      }
    ];
    
    setNotifications(demoNotifications);
    
    // Prüfe auf ungelesene Nachrichten
    const readStatus = getReadStatusFromCookies();
    checkForUnreadNotifications(demoNotifications, readStatus);
  };

  // Hole Lese-Status aus Cookies
  const getReadStatusFromCookies = () => {
    const cookieValue = getCookie('readNotifications');
    if (cookieValue) {
      try {
        return JSON.parse(cookieValue);
      } catch (error) {
        console.error('Error parsing read notifications from cookie:', error);
        return {};
      }
    }
    return {};
  };

  // Prüfe auf ungelesene Nachrichten - GEFIXT
  const checkForUnreadNotifications = (notificationList = [], readStatus = {}) => {
    // Sicherstellen, dass notificationList ein Array ist
    if (!Array.isArray(notificationList)) {
      console.error('notificationList ist kein Array:', notificationList);
      notificationList = [];
    }
    
    const hasUnreadMessages = notificationList.some(notification => 
      !notification.read && !readStatus[notification.notification_id]
    );
    setHasUnread(hasUnreadMessages);
  };

  // Markiere eine Benachrichtigung als gelesen
  const markAsRead = (id) => {
    // Lokale Aktualisierung ohne API-Aufruf
    const readStatus = getReadStatusFromCookies();
    readStatus[id] = true;
    setCookie('readNotifications', JSON.stringify(readStatus), 30);
    
    // Aktualisiere die lokale Liste
    setNotifications(notifications.map(notification => 
      notification.notification_id === id 
        ? { ...notification, read: true } 
        : notification
    ));
    
    // Prüfe auf verbleibende ungelesene Nachrichten
    checkForUnreadNotifications(notifications, readStatus);
  };

  // Toggle notification panel
  const togglePanel = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Schließe das Panel, wenn außerhalb geklickt wird
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

  // Schließe das Panel, wenn ESC gedrückt wird
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

  // Markiere alle Benachrichtigungen als gelesen, wenn das Panel geöffnet wird
  useEffect(() => {
    if (isOpen && hasUnread) {
      // Markiere alle ungelesenen Benachrichtigungen als gelesen
      notifications.forEach(notification => {
        if (!notification.read) {
          markAsRead(notification.notification_id);
        }
      });
    }
  }, [isOpen, hasUnread]);

  // Cookie-Hilfsfunktionen
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

  // Überprüfe, ob eine Benachrichtigung als gelesen markiert wurde
  const isNotificationRead = (id) => {
    const readStatus = getReadStatusFromCookies();
    return readStatus[id] === true;
  };

  return (
    <>
      {/* Bell icon */}
      <div 
        className="notification-trigger" 
        onClick={togglePanel}
        ref={triggerRef}
      >
        <img src={bellIcon} alt="Benachrichtigungen" className="icon" />
        {hasUnread && <span className="notification-dot"></span>}
      </div>

      {/* Notification panel */}
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
              <div 
                key={notification.notification_id} 
                className={`notification-item ${notification.read || isNotificationRead(notification.notification_id) ? 'read' : ''}`} 
                onClick={() => markAsRead(notification.notification_id)}
              >
                <div className="notification-avatar">
                  <span className="notification-avatar-letter">{notification.avatar}</span>
                </div>
                <div className="notification-content-wrapper">
                  <div className="notification-title">{notification.title}</div>
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