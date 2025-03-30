import React, { useState, useEffect } from 'react';
import './styles/RoomManagement.css';

const RoomManagement = () => {
    // API URL
    const API_URL = 'http://localhost:3001/api';

    // Zustand guer raeume
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Zustand guer das Formular
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [roomFormData, setRoomFormData] = useState({
        nummer: '',
        name: ''
    });

    // raeume laden
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
            setError('fehler beim laden der raeume: ' + err.message);
            console.error('fehler beim laden der raeume:', err);
            
            // dummy daten
            setRooms([
                { raum_id: 1, nummer: '101', name: 'Klassenraum' },
                { raum_id: 2, nummer: '102', name: 'Klassenraum' },
                { raum_id: 3, nummer: '201', name: 'Labor' },
                { raum_id: 4, nummer: '202', name: 'Seminarraum' },
                { raum_id: 5, nummer: '301', name: 'Hoersaal' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // formular für räume
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
                // aktualisieren
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
                
                // lokale liste aktualisieren
                const updatedRooms = rooms.map(r => 
                    r.raum_id === currentRoom.raum_id ? { ...r, ...roomFormData } : r
                );
                setRooms(updatedRooms);
                setSuccessMessage('raum erfolgreich aktualisiert');
                
            } else {
                // neu
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
                
                // zur liste hinzufügen
                const newRoom = {
                    raum_id: result.raum_id,
                    ...roomFormData
                };
                setRooms([...rooms, newRoom]);
                setSuccessMessage('raum erfolgreich hinzugefuegt');
            }
            
            setShowRoomForm(false);
            
            // nachricht ausblenden nach 3 sek
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            
        } catch (error) {
            console.error('fehler beim speichern des raums:', error);
            setError(`fehler beim speichern: ${error.message}`);
            
            // erfolg simulieren für entwicklung
            if (currentRoom) {
                // liste aktualisieren
                const updatedRooms = rooms.map(r => 
                    r.raum_id === currentRoom.raum_id ? { ...r, ...roomFormData } : r
                );
                setRooms(updatedRooms);
                setSuccessMessage('raum erfolgreich aktualisiert (simuliert)');
            } else {
                // neuen raum hinzufuegen
                const newRoom = {
                    raum_id: Date.now(),
                    ...roomFormData
                };
                setRooms([...rooms, newRoom]);
                setSuccessMessage('raum erfolgreich hinzugefügt (simuliert)');
            }
            
            setShowRoomForm(false);
            
            // nachricht ausblenden
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        }
    };

    const handleDeleteRoom = async (id) => {
        if (window.confirm('Moechtest du diesen Raum wirklich loeschen?')) {
            try {
                const response = await fetch(`${API_URL}/raeume/${id}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // liste aktualisieren
                setRooms(rooms.filter(r => r.raum_id !== id));
                setSuccessMessage('raum erfolgreich geloescht');
                
                // nachricht ausblenden
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 3000);
                
            } catch (error) {
                console.error('fehler beim loeschen des raums:', error);
                setError(`fehler beim loeschen: ${error.message}`);
                
                // erfolg simulieren
                setRooms(rooms.filter(r => r.raum_id !== id));
                setSuccessMessage('raum erfolgreich geloescht (simuliert)');
                
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
                                            Loeschen
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