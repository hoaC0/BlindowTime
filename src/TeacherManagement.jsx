// src/TeacherManagement.jsx
import React, { useState, useEffect } from 'react';
import './TeacherManagement.css';

const TeacherManagement = () => {
    // API-URL für Backend-Anfragen
    const API_URL = 'http://localhost:3001/api';

    // Zustand für Lehrer
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Form states for adding/editing teachers
    const [showTeacherForm, setShowTeacherForm] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [teacherFormData, setTeacherFormData] = useState({
        vorname: '',
        nachname: '',
        email: '',
        krzl: '',
        tel: ''
    });

    // Lehrer vom Backend laden
    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/lehrer`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTeachers(data);
            setError(null);
        } catch (err) {
            setError('Fehler beim Laden der Lehrer: ' + err.message);
            console.error('Fehler beim Laden der Lehrer:', err);
            
            // Temporäre Dummy-Daten für die Entwicklung
            setTeachers([
                { lehrer_id: 1, vorname: 'Uwe', nachname: 'Maulhardt', email: 'ita.fachleitung.fn@blindow.de', krzl: 'MAU', tel: '01735443980' },
                { lehrer_id: 2, vorname: 'Lehrer', nachname: 'Nummer 2', email: 'lehrer2@blindow.de', krzl: 'L2', tel: '' },
                { lehrer_id: 3, vorname: 'Lehrer', nachname: 'Nummer 3', email: 'lehrer3@blindow.de', krzl: 'L3', tel: '' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Formular-Handler für Lehrer
    const handleTeacherFormChange = (e) => {
        const { name, value } = e.target;
        setTeacherFormData({
            ...teacherFormData,
            [name]: value
        });
    };

    const handleAddTeacher = () => {
        setCurrentTeacher(null);
        setTeacherFormData({
            vorname: '',
            nachname: '',
            email: '',
            krzl: '',
            tel: ''
        });
        setShowTeacherForm(true);
    };

    const handleEditTeacher = (teacher) => {
        setCurrentTeacher(teacher);
        setTeacherFormData({
            vorname: teacher.vorname || '',
            nachname: teacher.nachname || '',
            email: teacher.email || '',
            krzl: teacher.krzl || '',
            tel: teacher.tel || ''
        });
        setShowTeacherForm(true);
    };

    const handleTeacherFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (currentTeacher) {
                // Aktualisieren eines bestehenden Lehrers
                const response = await fetch(`${API_URL}/lehrer/${currentTeacher.lehrer_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(teacherFormData),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Aktualisiere die lokale Liste
                const updatedTeachers = teachers.map(t => 
                    t.lehrer_id === currentTeacher.lehrer_id ? { ...t, ...teacherFormData } : t
                );
                setTeachers(updatedTeachers);
                setSuccessMessage('Lehrer erfolgreich aktualisiert');
                
            } else {
                // Neuen Lehrer hinzufügen
                const response = await fetch(`${API_URL}/lehrer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(teacherFormData),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                // Füge den neuen Lehrer zur lokalen Liste hinzu
                const newTeacher = {
                    lehrer_id: result.lehrer_id,
                    ...teacherFormData
                };
                setTeachers([...teachers, newTeacher]);
                setSuccessMessage('Lehrer erfolgreich hinzugefügt');
            }
            
            setShowTeacherForm(false);
            
            // Erfolgs-Nachricht nach 3 Sekunden ausblenden
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            
        } catch (error) {
            console.error('Fehler beim Speichern des Lehrers:', error);
            setError(`Fehler beim Speichern: ${error.message}`);
            
            // Simuliere Erfolg für die Entwicklung
            if (currentTeacher) {
                // Aktualisiere die lokale Liste
                const updatedTeachers = teachers.map(t => 
                    t.lehrer_id === currentTeacher.lehrer_id ? { ...t, ...teacherFormData } : t
                );
                setTeachers(updatedTeachers);
                setSuccessMessage('Lehrer erfolgreich aktualisiert (simuliert)');
            } else {
                // Füge den neuen Lehrer zur lokalen Liste hinzu
                const newTeacher = {
                    lehrer_id: Date.now(),
                    ...teacherFormData
                };
                setTeachers([...teachers, newTeacher]);
                setSuccessMessage('Lehrer erfolgreich hinzugefügt (simuliert)');
            }
            
            setShowTeacherForm(false);
            
            // Erfolgs-Nachricht nach 3 Sekunden ausblenden
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        }
    };

    const handleDeleteTeacher = async (id) => {
        if (window.confirm('Möchtest du diesen Lehrer wirklich löschen?')) {
            try {
                const response = await fetch(`${API_URL}/lehrer/${id}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Aktualisiere die lokale Liste
                setTeachers(teachers.filter(t => t.lehrer_id !== id));
                setSuccessMessage('Lehrer erfolgreich gelöscht');
                
                // Erfolgs-Nachricht nach 3 Sekunden ausblenden
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 3000);
                
            } catch (error) {
                console.error('Fehler beim Löschen des Lehrers:', error);
                setError(`Fehler beim Löschen: ${error.message}`);
                
                // Simuliere Erfolg für die Entwicklung
                setTeachers(teachers.filter(t => t.lehrer_id !== id));
                setSuccessMessage('Lehrer erfolgreich gelöscht (simuliert)');
                
                // Erfolgs-Nachricht nach 3 Sekunden ausblenden
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 3000);
            }
        }
    };

    return (
        <div className="teacher-management">
            <div className="teacher-header">
                <h2>Lehrerverwaltung</h2>
                <button className="add-button" onClick={handleAddTeacher}>
                    + Neuer Lehrer
                </button>
            </div>
            
            {loading && <div className="loading">Laden...</div>}
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            {!loading && (
                <div className="teacher-list">
                    <table className="teacher-table">
                        <thead>
                            <tr>
                                <th>Nachname</th>
                                <th>Vorname</th>
                                <th>Kürzel</th>
                                <th>E-Mail</th>
                                <th>Telefon</th>
                                <th>Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map((teacher) => (
                                <tr key={teacher.lehrer_id}>
                                    <td>{teacher.nachname}</td>
                                    <td>{teacher.vorname}</td>
                                    <td className="teacher-code">{teacher.krzl}</td>
                                    <td>{teacher.email}</td>
                                    <td>{teacher.tel}</td>
                                    <td className="action-buttons">
                                        <button 
                                            className="edit-button"
                                            onClick={() => handleEditTeacher(teacher)}
                                        >
                                            Bearbeiten
                                        </button>
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleDeleteTeacher(teacher.lehrer_id)}
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
            
            {showTeacherForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{currentTeacher ? 'Lehrer bearbeiten' : 'Neuer Lehrer'}</h3>
                        <form onSubmit={handleTeacherFormSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="vorname">Vorname</label>
                                    <input
                                        type="text"
                                        id="vorname"
                                        name="vorname"
                                        value={teacherFormData.vorname}
                                        onChange={handleTeacherFormChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nachname">Nachname</label>
                                    <input
                                        type="text"
                                        id="nachname"
                                        name="nachname"
                                        value={teacherFormData.nachname}
                                        onChange={handleTeacherFormChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="krzl">Kürzel</label>
                                <input
                                    type="text"
                                    id="krzl"
                                    name="krzl"
                                    value={teacherFormData.krzl}
                                    onChange={handleTeacherFormChange}
                                    maxLength="10"
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="tel">Telefon</label>
                                    <input
                                        type="tel"
                                        id="tel"
                                        name="tel"
                                        value={teacherFormData.tel}
                                        onChange={handleTeacherFormChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">E-Mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={teacherFormData.email}
                                        onChange={handleTeacherFormChange}
                                    />
                                </div>
                            </div>
                            
                            <div className="modal-buttons">
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => setShowTeacherForm(false)}
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

export default TeacherManagement;