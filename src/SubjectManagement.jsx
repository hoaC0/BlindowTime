
import React, { useState, useEffect } from 'react';
import './styles/SubjectManagement.css';

const SubjectManagement = () => {
   
    const API_URL = 'http://localhost:3001/api';

   
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

 
    const [showSubjectForm, setShowSubjectForm] = useState(false);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [subjectFormData, setSubjectFormData] = useState({
        name: '',
        kurzname: '',
        farbe: '#0f3c63'
    });

 
    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/faecher`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSubjects(data);
            setError(null);
        } catch (err) {
            setError('Fehler beim Laden der Fächer: ' + err.message);
            console.error('Fehler beim Laden der Fächer:', err);
            
 // temp
            setSubjects([
                { fach_id: 1, name: 'Mathematik', kurzname: 'MAT', farbe: '#428FF4' },
                { fach_id: 2, name: 'Deutsch', kurzname: 'DEU', farbe: '#EA4335' },
                { fach_id: 3, name: 'Englisch', kurzname: 'ENG', farbe: '#FBBC05' },
                { fach_id: 4, name: 'Physik', kurzname: 'PHY', farbe: '#7B1FA2' },
                { fach_id: 5, name: 'Chemie', kurzname: 'CHE', farbe: '#EA4335' },
                { fach_id: 6, name: 'Biologie', kurzname: 'BIO', farbe: '#34A853' },
                { fach_id: 7, name: 'Geschichte', kurzname: 'GES', farbe: '#FF9800' },
                { fach_id: 8, name: 'Informatik', kurzname: 'INF', farbe: '#09A7F0' },
                { fach_id: 9, name: 'Wirtschaft', kurzname: 'WIR', farbe: '#795548' },
                { fach_id: 10, name: 'Sport', kurzname: 'SPO', farbe: '#607D8B' },
                { fach_id: 11, name: 'Kunst', kurzname: 'KUN', farbe: '#9C27B0' },
                { fach_id: 12, name: 'Musik', kurzname: 'MUS', farbe: '#FF9800' },
                { fach_id: 13, name: 'Ethik', kurzname: 'ETH', farbe: '#F51B5' },
                { fach_id: 14, name: 'Projektarbeit', kurzname: 'PRO', farbe: '#09A7F7' },
                { fach_id: 15, name: 'Gesundheit', kurzname: 'GES', farbe: '#E91E63' },
                { fach_id: 16, name: 'Pharmazie', kurzname: 'PHA', farbe: '#781FA2' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Formular-Handler für Fächer
    const handleSubjectFormChange = (e) => {
        const { name, value } = e.target;
        setSubjectFormData({
            ...subjectFormData,
            [name]: value
        });
    };

    const handleAddSubject = () => {
        setCurrentSubject(null);
        setSubjectFormData({
            name: '',
            kurzname: '',
            farbe: '#0f3c63'
        });
        setShowSubjectForm(true);
    };

    const handleEditSubject = (subject) => {
        setCurrentSubject(subject);
        setSubjectFormData({
            name: subject.name || '',
            kurzname: subject.kurzname || '',
            farbe: subject.farbe || '#0f3c63'
        });
        setShowSubjectForm(true);
    };

    const handleSubjectFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (currentSubject) {
                // Aktualisieren eines bestehenden Fachs
                const response = await fetch(`${API_URL}/faecher/${currentSubject.fach_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(subjectFormData),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Aktualisiere die lokale Liste
                const updatedSubjects = subjects.map(s => 
                    s.fach_id === currentSubject.fach_id ? { ...s, ...subjectFormData } : s
                );
                setSubjects(updatedSubjects);
                setSuccessMessage('Fach erfolgreich aktualisiert');
                
            } else {
                // Neues Fach hinzufügen
                const response = await fetch(`${API_URL}/faecher`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(subjectFormData),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                // Füge das neue Fach zur lokalen Liste hinzu
                const newSubject = {
                    fach_id: result.fach_id,
                    ...subjectFormData
                };
                setSubjects([...subjects, newSubject]);
                setSuccessMessage('Fach erfolgreich hinzugefügt');
            }
            
            setShowSubjectForm(false);
            
            // Erfolgs-Nachricht nach 3 Sekunden ausblenden
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            
        } catch (error) {
            console.error('Fehler beim Speichern des Fachs:', error);
            setError(`Fehler beim Speichern: ${error.message}`);
            
            // Simuliere Erfolg für die Entwicklung
            if (currentSubject) {
                // Aktualisiere die lokale Liste
                const updatedSubjects = subjects.map(s => 
                    s.fach_id === currentSubject.fach_id ? { ...s, ...subjectFormData } : s
                );
                setSubjects(updatedSubjects);
                setSuccessMessage('Fach erfolgreich aktualisiert (simuliert)');
            } else {
                // Füge das neue Fach zur lokalen Liste hinzu
                const newSubject = {
                    fach_id: Date.now(),
                    ...subjectFormData
                };
                setSubjects([...subjects, newSubject]);
                setSuccessMessage('Fach erfolgreich hinzugefügt (simuliert)');
            }
            
            setShowSubjectForm(false);
            
            // Erfolgs-Nachricht nach 3 Sekunden ausblenden
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        }
    };

    const handleDeleteSubject = async (id) => {
        if (window.confirm('Möchtest du dieses Fach wirklich löschen?')) {
            try {
                const response = await fetch(`${API_URL}/faecher/${id}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Aktualisiere die lokale Liste
                setSubjects(subjects.filter(s => s.fach_id !== id));
                setSuccessMessage('Fach erfolgreich gelöscht');
                
                // Erfolgs-Nachricht nach 3 Sekunden ausblenden
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 3000);
                
            } catch (error) {
                console.error('Fehler beim Löschen des Fachs:', error);
                setError(`Fehler beim Löschen: ${error.message}`);
                
                // Simuliere Erfolg für die Entwicklung
                setSubjects(subjects.filter(s => s.fach_id !== id));
                setSuccessMessage('Fach erfolgreich gelöscht (simuliert)');
                
                // Erfolgs-Nachricht nach 3 Sekunden ausblenden
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 3000);
            }
        }
    };

    return (
        <div className="subject-management">
            <div className="subject-header">
                <h2>Fächerverwaltung</h2>
                <button className="add-button" onClick={handleAddSubject}>
                    + Neues Fach
                </button>
            </div>
            
            {loading && <div className="loading">Laden...</div>}
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            {!loading && (
                <div className="subject-list">
                    <table className="subject-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Kürzel</th>
                                <th>Farbe</th>
                                <th>Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.fach_id}>
                                    <td>{subject.name}</td>
                                    <td className="subject-code">{subject.kurzname}</td>
                                    <td>
                                        <div className="color-preview" style={{ backgroundColor: subject.farbe }}>
                                            <span className="color-hex">{subject.farbe}</span>
                                        </div>
                                    </td>
                                    <td className="action-buttons">
                                        <button 
                                            className="edit-button"
                                            onClick={() => handleEditSubject(subject)}
                                        >
                                            Bearbeiten
                                        </button>
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleDeleteSubject(subject.fach_id)}
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
            
            {showSubjectForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{currentSubject ? 'Fach bearbeiten' : 'Neues Fach'}</h3>
                        <form onSubmit={handleSubjectFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={subjectFormData.name}
                                    onChange={handleSubjectFormChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="kurzname">Kürzel</label>
                                <input
                                    type="text"
                                    id="kurzname"
                                    name="kurzname"
                                    value={subjectFormData.kurzname}
                                    onChange={handleSubjectFormChange}
                                    maxLength="5"
                                    required
                                />
                                <small>Max. 5 Zeichen</small>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="farbe">Farbe</label>
                                <div className="color-input-container">
                                    <input
                                        type="color"
                                        id="farbe"
                                        name="farbe"
                                        value={subjectFormData.farbe}
                                        onChange={handleSubjectFormChange}
                                        className="color-picker"
                                    />
                                    <input
                                        type="text"
                                        name="farbe"
                                        value={subjectFormData.farbe}
                                        onChange={handleSubjectFormChange}
                                        className="color-text"
                                        pattern="^#[0-9A-Fa-f]{6}$"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="modal-buttons">
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => setShowSubjectForm(false)}
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

export default SubjectManagement;
