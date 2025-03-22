// src/RoomManagement.jsx
import React, { useState, useEffect } from 'react';
import './RoomManagement.css';

const RoomManagement = () => {
    // API-URL für Backend-Anfragen
    const API_URL = 'http://localhost:3001/api';

    // Zustand für Räume
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Form states for adding/editing rooms
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [roomFormData, setRoomFormData] = useState({
        nummer: '',
        name: ''
    });

    // Räume vom Backend laden
    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/raeume`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRooms(data);
            setError(null);
        } catch (err) {
            setError('Fehler beim Laden der Räume: ' + err.message);
            console.error('Fehler beim Laden der Räume:', err);
            
            // Temporäre Dummy-Daten für die Entwicklung
            setRooms([
                { raum_id: 1, nummer: '101', name: 'Klassenraum' },
                { raum_id: 2, nummer: '102', name: 'Klassenraum' },
                { raum_id: 3, nummer: '201', name: 'Labor' },
                { raum_id: 4, nummer: '202', name: 'Seminarraum' },
                { raum_id: 5, nummer: '301', name: 'Hörsaal' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Formular-Handler für Räume
    const handleRoomFormChange = (e) => {
        const { name, value } = e.target;
        setRoomFormData({
            ...roomFormData,
            [name]: value
        });
    };

    const handleAddRoom = () => {
        setCurrentRoom(null);
        setRoomFormData({
            nummer: '',
            name: ''
        });
        setShowRoomForm(true);
    };

    const handleEditRoom = (room) => {
        setCurrentRoom(room);
        setRoomFormData({
            nummer: room.nummer || '',
            name: room.name || ''
        });
        setShowRoomForm(true);
    };

    const handleRoomFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (currentRoom) {
                // Aktualisieren eines bestehenden Raums
                const response = await fetch(`${API_URL}/raeume/${currentRoom.raum_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(roomFormData),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Aktualisiere die lokale Liste
                const updatedRooms = rooms.map(r => 
                    r.raum_id === currentRoom.raum_id ? { ...r, ...roomFormData } : r
                );
                setRooms(updatedRooms);
                setSuccessMessage('Raum erfolgreich aktualisiert');
                
            } else {
                // Neuen Raum hinzufügen
                const response = await fetch(`${API_URL}/raeume`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(roomFormData),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                // Füge den neuen Raum zur lokalen Liste hinzu
                const newRoom = {
                    raum_id: result.raum_id,
                    ...roomFormData
                };
                setRooms([...rooms, newRoom]);
                setSuccessMessage('Raum erfolgreich hinzugefügt');
            }
            
            setShowRoomForm(false);
            
            // Erfolgs-Nachricht nach 3 Sekunden ausblenden
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            
        } catch (error) {
            console.error('Fehler beim Speichern des Raums:', error);
            setError(`Fehler beim Speichern: ${error.message}`);
            
            // Simuliere Erfolg für die Entwicklung
            if (currentRoom) {
                // Aktualisiere die lokale Liste
                const updatedRooms = rooms.map(r => 
                    r.raum_id === currentRoom.raum_id ? { ...r, ...roomFormData } : r
                );
                setRooms(updatedRooms);
                setSuccessMessage('Raum erfolgreich aktualisiert (simuliert)');
            } else {
                // Füge den neuen Raum zur lokalen Liste hinzu
                const newRoom = {
                    raum_id: Date.now(),
                    ...roomFormData
                };
                setRooms([...rooms, newRoom]);
                setSuccessMessage('Raum erfolgreich hinzugefügt (simuliert)');
            }
            
            setShowRoomForm(false);
            
            // Erfolgs-Nachricht nach 3 Sekunden ausblenden
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        }
    };

    const handleDeleteRoom = async (id) => {
        if (window.confirm('Möchtest du diesen Raum wirklich löschen?')) {
            try {
                const response = await fetch(`${API_URL}/raeume/${id}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Aktualisiere die lokale Liste
                setRooms(rooms.filter(r => r.raum_id !== id));
                setSuccessMessage('Raum erfolgreich gelöscht');
                
                // Erfolgs-Nachricht nach 3 Sekunden ausblenden
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 3000);
                
            } catch (error) {
                console.error('Fehler beim Löschen des Raums:', error);
                setError(`Fehler beim Löschen: ${error.message}`);
                
                // Simuliere Erfolg für die Entwicklung
                setRooms(rooms.filter(r => r.raum_id !== id));
                setSuccessMessage('Raum erfolgreich gelöscht (simuliert)');
                
                // Erfolgs-Nachricht nach 3 Sekunden ausblenden
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 3000);
            }
        }
    };

    return (
        <div className="room-management">
            <div className="room-header">
                <h2>Raumverwaltung</h2>
                <button className="add-button" onClick={handleAddRoom}>
                    + Neuer Raum
                </button>
            </div>
            
            {loading && <div className="loading">Laden...</div>}
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            {!loading && (
                <div className="room-list">
                    <table className="room-table">
                        <thead>
                            <tr>
                                <th>Nummer</th>
                                <th>Name</th>
                                <th className='aktionen' style={{ textAlign: 'left' }}>Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room.raum_id}>
                                    <td className="room-number">{room.nummer}</td>
                                    <td>{room.name}</td>
                                    <td className="action-buttons" style={{ textAlign: 'left' }}>
                                        <button 
                                            className="edit-button"
                                            onClick={() => handleEditRoom(room)}
                                        >
                                            Bearbeiten
                                        </button>
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleDeleteRoom(room.raum_id)}
                                        >
                                            Löschen
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {showRoomForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{currentRoom ? 'Raum bearbeiten' : 'Neuer Raum'}</h3>
                        <form onSubmit={handleRoomFormSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="nummer">Raumnummer*</label>
                                    <input
                                        type="text"
                                        id="nummer"
                                        name="nummer"
                                        value={roomFormData.nummer}
                                        onChange={handleRoomFormChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Raumname</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={roomFormData.name}
                                        onChange={handleRoomFormChange}
                                    />
                                </div>
                            </div>
                            
                            <div className="modal-buttons">
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => setShowRoomForm(false)}
                                >
                                    Abbrechen
                                </button>
                                <button type="submit" className="save-button">
                                    Speichern
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomManagement;