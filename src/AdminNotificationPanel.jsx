import React, { useState, useEffect } from 'react';
import './styles/AdminNotificationPanel.css';

const AdminNotificationPanel = () => {
  // variablen fuer den state
  const [notificationMessage, setNotificationMessage] = useState('');
  const [sender, setSender] = useState('Sekretariat');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const API_URL = 'http://localhost:3001/api';

  // beim laden holen
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/notifications`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setError(null);
      } else {
        console.error('fehler beim laden der benachrichtigungen', response.status);
        setError('fehler beim laden der benachrichtigungen vom server.');
        
        // demo daten laden
        setDemoNotifications();
      }
    } catch (err) {
      console.error('fehler beim laden der benachrichtigungen:', err);
      setError('fehler beim laden der benachrichtigungen. server nicht erreichbar.');
      
      // verwende dummy-daten fuer die entwicklung
      setDemoNotifications();
    } finally {
      setIsLoading(false);
    }
  };

  // test benachrichtigungen setzen wenn der server nicht erreichbar is
  const setDemoNotifications = () => {
    const demoNotifications = [
      {
        notification_id: "1",
        title: "Sekretariat",
        message: "Neuer Stundenplan fuer naechste Woche verfuegbar",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // vor 2 stunden
        formattedTime: "vor 2 Stunden",
        read: false,
        avatar: "S",
        sender: "Sekretariat"
      },
      {
        notification_id: "2",
        title: "Klassenlehrer",
        message: "Elternabend am 15. Maerz um 19:00 Uhr",
        time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // vor 5 stunden
        formattedTime: "vor 5 Stunden",
        read: false,
        avatar: "K",
        sender: "Klassenlehrer"
      },
      {
        notification_id: "3",
        title: "Schuldirektor",
        message: "Schulausflug zum Technikmuseum am 20. Maerz",
        time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // vor 1 tag
        formattedTime: "vor 1 Tag",
        read: false,
        avatar: "D",
        sender: "Schuldirektor"
      }
    ];
    
    console.log("demo-benachrichtigungen gesetzt:", demoNotifications);
    setNotifications(demoNotifications);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    
    if (notificationMessage.trim() === '') {
      setError('bitte gib eine nachricht ein.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    const newNotification = {
      title: sender,
      message: notificationMessage,
      sender: sender
    };
    
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNotification),
      });
      
      if (response.ok) {
        const result = await response.json();
        setSuccess(`nachricht wurde erfolgreich gesendet!`);
        setNotificationMessage('');
        
        // liste aktualisieren
        fetchNotifications();
      } else {
        console.error('fehler beim senden der benachrichtigung:', response.status);
        setError('fehler beim senden der benachrichtigung. bitte versuche es spaeter erneut.');
        
        // simuliere erfolg fuer die entwicklung
        setSuccess(`nachricht "${sender}: ${notificationMessage}" wurde gesendet! (simuliert)`);
        setNotificationMessage('');
        
        // lokale liste mit neuer benachrichtigung aktualisieren
        const mockNotification = {
          notification_id: Date.now().toString(),
          title: sender,
          message: notificationMessage,
          sender: sender,
          time: new Date().toISOString(),
          formattedTime: 'gerade eben',
          read: false,
          avatar: sender.charAt(0)
        };
        
        setNotifications([mockNotification, ...notifications]);
      }
    } catch (error) {
      console.error('fehler beim senden der benachrichtigung:', error);
      setError('fehler beim senden der benachrichtigung. server nicht erreichbar.');
      
      // simuliere erfolg fuer die entwicklung
      setSuccess(`nachricht "${sender}: ${notificationMessage}" wurde gesendet! (simuliert)`);
      setNotificationMessage('');
      
      // lokale liste mit neuer benachrichtigung aktualisieren
      const mockNotification = {
        notification_id: Date.now().toString(),
        title: sender,
        message: notificationMessage,
        sender: sender,
        time: new Date().toISOString(),
        formattedTime: 'gerade eben',
        read: false,
        avatar: sender.charAt(0)
      };
      
      setNotifications([mockNotification, ...notifications]);
    } finally {
      setIsLoading(false);
    }
  };

  // loescht eine benachrichtigung
  const handleDeleteNotification = async (id) => {
    if (window.confirm('moechtest du diese benachrichtigung wirklich loeschen?')) {
      setIsLoading(true);
      
      try {
        const response = await fetch(`${API_URL}/notifications/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // entferne die benachrichtigung aus der lokalen liste
          setNotifications(notifications.filter(notification => notification.notification_id !== id));
          setSuccess('benachrichtigung wurde erfolgreich geloescht.');
        } else {
          console.error('fehler beim loeschen der benachrichtigung:', response.status);
          setError('fehler beim loeschen der benachrichtigung. bitte versuche es spaeter erneut.');
          
          // simuliere erfolg fuer die entwicklung
          setNotifications(notifications.filter(notification => notification.notification_id !== id));
        }
      } catch (error) {
        console.error('fehler beim loeschen der benachrichtigung:', error);
        setError('fehler beim loeschen der benachrichtigung. server nicht erreichbar.');
        
        // simuliere erfolg fuer die entwicklung
        setNotifications(notifications.filter(notification => notification.notification_id !== id));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="notification-panel-container">
      <div className="notification-form-container">
        <h2>Benachrichtigung senden</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSendNotification} className="notification-form">
          <div className="form-group">
            <label htmlFor="notification-sender">Absender</label>
            <select 
              id="notification-sender"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="form-select"
              disabled={isLoading}
            >
              <option value="Sekretariat">Sekretariat</option>
              <option value="IT">Ausbildungsleitung ITA</option>
              <option value="Schuldirektor">Schuldirektor</option>
              <option value="IT-Abteilung">IT-Abteilung</option>
              <option value="Schulverwaltung">Schulverwaltung</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="notification-message">Nachricht</label>
            <textarea 
              id="notification-message"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Nachrichtentext hier eingeben..."
              rows="5"
              required
              disabled={isLoading}
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="send-button"
            disabled={isLoading}
          >
            {isLoading ? 'Wird gesendet...' : 'Nachricht senden'}
          </button>
        </form>
      </div>
      
      <div className="notification-list-container">
        <h2>Aktuelle Benachrichtigungen</h2>
        
        {isLoading && <div className="loading">Laden...</div>}
        
        {notifications.length > 0 ? (
          <div className="admin-notification-list">
            {notifications.map(notification => (
              <div key={notification.notification_id} className="admin-notification-item">
                <div className="notification-header">
                  <div className="notification-sender">
                    <div className="notification-avatar">
                      <span className="notification-avatar-letter">{notification.avatar || notification.sender?.charAt(0) || 'N'}</span>
                    </div>
                    <h3>{notification.sender || notification.title}</h3>
                  </div>
                  <div className="notification-time">{notification.formattedTime}</div>
                </div>
                
                <div className="notification-message">{notification.message}</div>
                
                <button 
                  className="delete-notification-button"
                  onClick={() => handleDeleteNotification(notification.notification_id)}
                  disabled={isLoading}
                >
                  Loeschen
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-notifications">
            <p>Keine Benachrichtigungen vorhanden</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationPanel;