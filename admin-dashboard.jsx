import React, { useState } from 'react';
import './admin-dashboard-css.css';

const AdminDashboard = () => {
    // Sample class data - in a real app this would come from a database
    const [classes, setClasses] = useState([
        { id: 1, name: "Klasse 10A", teacher: "Fr. Müller" },
        { id: 2, name: "Klasse 11B", teacher: "Hr. Schmidt" },
        { id: 3, name: "Klasse 12C", teacher: "Fr. Weber" },
        { id: 4, name: "Klasse 9D", teacher: "Hr. Fischer" },
    ]);

    // State for notification form
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [selectedTab, setSelectedTab] = useState('classes');

    const handleSendNotification = (e) => {
        e.preventDefault();
        if (notificationTitle.trim() === '' || notificationMessage.trim() === '') {
            alert('Bitte Titel und Nachricht eingeben.');
            return;
        }
        
        // Here you would save the notification to your database/state
        alert(`Nachricht "${notificationTitle}" wurde gesendet!`);
        setNotificationTitle('');
        setNotificationMessage('');
    };

    return (
        <div className="admin-container">
            <div className="admin-tabs">
                <button 
                    className={`tab-button ${selectedTab === 'classes' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('classes')}
                >
                    Klassen
                </button>
                <button 
                    className={`tab-button ${selectedTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('notifications')}
                >
                    Benachrichtigungen
                </button>
            </div>

            {selectedTab === 'classes' && (
                <div className="class-list">
                    <h2>Klassen verwalten</h2>
                    <div className="class-grid">
                        {classes.map((cls) => (
                            <div key={cls.id} className="class-card" onClick={() => window.location.href = `/admin/class.html?id=${cls.id}`}>
                                <h3>{cls.name}</h3>
                                <p>Klassenlehrer: {cls.teacher}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedTab === 'notifications' && (
                <div className="notification-panel">
                    <h2>Benachrichtigung senden</h2>
                    <form onSubmit={handleSendNotification} className="notification-form">
                        <div className="form-group">
                            <label htmlFor="notification-title">Titel</label>
                            <input 
                                type="text" 
                                id="notification-title"
                                value={notificationTitle}
                                onChange={(e) => setNotificationTitle(e.target.value)}
                                placeholder="Titel der Benachrichtigung"
                                required
                            />
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
                            ></textarea>
                        </div>
                        <button type="submit" className="send-button">Nachricht senden</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;