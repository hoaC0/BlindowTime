// src/adminDashboard.jsx
import React, { useState, useEffect } from 'react';
import './adminDashboard.css';
import AdminNotificationPanel from './components/AdminNotificationPanel.jsx';

const AdminDashboard = () => {
    // Sample class data - in a real app this would come from a database
    const [classes, setClasses] = useState([
        { id: 1, name: "BTA25", teacher: "Fr. Müller" },
        { id: 2, name: "BTA26", teacher: "Hr. Schmidt" },
        { id: 3, name: "GD25", teacher: "Hr. Fischer" },
        { id: 4, name: "GD26", teacher: "Fr. Wagner" },
        { id: 5, name: "GD27", teacher: "Hr. Weber" },
        { id: 6, name: "ITA25", teacher: "Fr. Knaber" },
        { id: 7, name: "ITA26", teacher: "Hr. Schneider" },
        { id: 8, name: "PTA25", teacher: "Fr. Schuster" },
        { id: 9, name: "PTA26", teacher: "Hr. Schuster" },
    ]);

    // State für API-URLs
    const API_URL = 'http://localhost:3001/api';

    // Zustand für Schüler
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [klassen, setKlassen] = useState([]);

    // Form states for adding/editing students
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [studentFormData, setStudentFormData] = useState({
        vorname: '',
        nachname: '',
        geburtsdatum: '',
        klassen_id: '',
        adresse: '',
        tel: '',
        email: ''
    });

    // State for tabs
    const [selectedTab, setSelectedTab] = useState('classes');

    // Klassen vom Backend laden
    useEffect(() => {
        if (selectedTab === 'students') {
            fetchKlassen();
        }
    }, [selectedTab, API_URL]);

    const fetchKlassen = async () => {
        try {
            const response = await fetch(`${API_URL}/klassen`);
            if (response.ok) {
                const data = await response.json();
                setKlassen(data);
            } else {
                console.error('Fehler beim Laden der Klassen');
                // Fallback zu lokalen Daten
                setKlassen(classes.map(c => ({
                    klassen_id: c.id,
                    name: c.name
                })));
            }
        } catch (err) {
            console.error('Fehler beim Laden der Klassen:', err);
            // Fallback zu lokalen Daten
            setKlassen(classes.map(c => ({
                klassen_id: c.id,
                name: c.name
            })));
        }
    };

    // Schüler vom Backend laden
    useEffect(() => {
        if (selectedTab === 'students') {
            fetchStudents();
        }
    }, [selectedTab, API_URL]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/schueler`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setStudents(data);
            setError(null);
        } catch (err) {
            setError('Fehler beim Laden der Schüler: ' + err.message);
            console.error('Fehler beim Laden der Schüler:', err);
            
            // Temporäre Dummy-Daten für die Entwicklung
            setStudents([
                { schueler_id: 1, vorname: 'Max', nachname: 'Mustermann', klassen_id: 1, email: 'max@example.com', tel: '0123456789' },
                { schueler_id: 2, vorname: 'Anna', nachname: 'Schmidt', klassen_id: 1, email: 'anna@example.com', tel: '0123456790' },
                { schueler_id: 3, vorname: 'Tom', nachname: 'Meyer', klassen_id: 4, email: 'tom@example.com', tel: '0123456791' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Formular-Handler für Schüler
    const handleStudentFormChange = (e) => {
        const { name, value } = e.target;
        setStudentFormData({
            ...studentFormData,
            [name]: value
        });
    };

    const handleAddStudent = () => {
        setCurrentStudent(null);
        setStudentFormData({
            vorname: '',
            nachname: '',
            geburtsdatum: '',
            klassen_id: '',
            adresse: '',
            tel: '',
            email: ''
        });
        setShowStudentForm(true);
    };

    const handleEditStudent = (student) => {
        setCurrentStudent(student);
        
        // Formatiere das Geburtsdatum für das Datumfeld (yyyy-MM-dd)
        let formattedBirthDate = '';
        if (student.geburtsdatum) {
            const date = new Date(student.geburtsdatum);
            formattedBirthDate = date.toISOString().split('T')[0];
        }
        
        setStudentFormData({
            vorname: student.vorname || '',
            nachname: student.nachname || '',
            geburtsdatum: formattedBirthDate,
            klassen_id: student.klasse_id || '',
            adresse: student.adresse || '',
            tel: student.tel || '',
            email: student.email || ''
        });
        setShowStudentForm(true);
    };

    const handleStudentFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (currentStudent) {
                // Aktualisieren eines bestehenden Schülers
                const response = await fetch(`${API_URL}/schueler/${currentStudent.schueler_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentFormData),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Aktualisiere die lokale Liste
                const updatedStudents = students.map(s => 
                    s.schueler_id === currentStudent.schueler_id ? { ...s, ...studentFormData } : s
                );
                setStudents(updatedStudents);
                
            } else {
                // Neuen Schüler hinzufügen
                const response = await fetch(`${API_URL}/schueler`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentFormData),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                // Füge den neuen Schüler zur lokalen Liste hinzu
                const newStudent = {
                    schueler_id: result.schueler_id,
                    ...studentFormData
                };
                setStudents([...students, newStudent]);
            }
            
            setShowStudentForm(false);
            
        } catch (error) {
            console.error('Fehler beim Speichern des Schülers:', error);
            alert(`Fehler beim Speichern: ${error.message}`);
            
            // Simuliere Erfolg für die Entwicklung
            if (currentStudent) {
                // Aktualisiere die lokale Liste
                const updatedStudents = students.map(s => 
                    s.schueler_id === currentStudent.schueler_id ? { ...s, ...studentFormData } : s
                );
                setStudents(updatedStudents);
            } else {
                // Füge den neuen Schüler zur lokalen Liste hinzu
                const newStudent = {
                    schueler_id: Date.now(),
                    ...studentFormData
                };
                setStudents([...students, newStudent]);
            }
            
            setShowStudentForm(false);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Möchtest du diesen Schüler wirklich löschen?')) {
            try {
                const response = await fetch(`${API_URL}/schueler/${id}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Aktualisiere die lokale Liste
                setStudents(students.filter(s => s.schueler_id !== id));
                
            } catch (error) {
                console.error('Fehler beim Löschen des Schülers:', error);
                alert(`Fehler beim Löschen: ${error.message}`);
                
                // Simuliere Erfolg für die Entwicklung
                setStudents(students.filter(s => s.schueler_id !== id));
            }
        }
    };

    const getKlassenName = (klassenId) => {
        const klasse = klassen.find(k => k.klassen_id === klassenId);
        return klasse ? klasse.name : `Klasse ${klassenId}`;
    };

    return (
        <div className="admin-container">
            <div className="admin-tabs">
                <button 
                    className={`tab-button ${selectedTab === 'classes' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('classes')}
                >
                    Stundenplan verwalten
                </button>
                <button 
                    className={`tab-button ${selectedTab === 'students' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('students')}
                >
                    Schülerverwaltung
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
                    <h2>Klassen</h2>
                    <div className="class-grid">
                        {classes.map((cls) => (
                            <div key={cls.id} className="class-card" onClick={() => window.location.href = `/adminClass.html?id=${cls.id}`}>
                                <h3>{cls.name}</h3>
                                <p>Klassenlehrer: {cls.teacher}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedTab === 'students' && (
                <div className="student-management">
                    <div className="student-header">
                        <h2>Schülerverwaltung</h2>
                        <button className="add-button" onClick={handleAddStudent}>
                            + Neuer Schüler
                        </button>
                    </div>
                    
                    {loading && <div className="loading">Laden...</div>}
                    {error && <div className="error-message">{error}</div>}
                    
                    {!loading && (
                        <div className="student-list">
                            <table className="student-table">
                                <thead>
                                    <tr>
                                        <th>Nachname</th>
                                        <th>Vorname</th>
                                        <th>Klasse</th>
                                        <th>E-Mail</th>
                                        <th>Telefon</th>
                                        <th>Aktionen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.schueler_id}>
                                            <td>{student.nachname}</td>
                                            <td>{student.vorname}</td>
                                            <td>{getKlassenName(student.klassen_id)}</td>
                                            <td>{student.email}</td>
                                            <td>{student.tel}</td>
                                            <td className="action-buttons">
                                                <button 
                                                    className="edit-button"
                                                    onClick={() => handleEditStudent(student)}
                                                >
                                                    Bearbeiten
                                                </button>
                                                <button 
                                                    className="delete-button"
                                                    onClick={() => handleDeleteStudent(student.schueler_id)}
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
                    
                    {showStudentForm && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>{currentStudent ? 'Schüler bearbeiten' : 'Neuer Schüler'}</h3>
                                <form onSubmit={handleStudentFormSubmit}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="vorname">Vorname</label>
                                            <input
                                                type="text"
                                                id="vorname"
                                                name="vorname"
                                                value={studentFormData.vorname}
                                                onChange={handleStudentFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="nachname">Nachname</label>
                                            <input
                                                type="text"
                                                id="nachname"
                                                name="nachname"
                                                value={studentFormData.nachname}
                                                onChange={handleStudentFormChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="geburtsdatum">Geburtsdatum</label>
                                        <input
                                            type="date"
                                            id="geburtsdatum"
                                            name="geburtsdatum"
                                            value={studentFormData.geburtsdatum}
                                            onChange={handleStudentFormChange}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="klassen_id">Klasse</label>
                                        <select
                                            id="klassen_id"
                                            name="klassen_id"
                                            value={studentFormData.klassen_id}
                                            onChange={handleStudentFormChange}
                                            required
                                        >
                                            <option value="">Bitte wählen</option>
                                            {klassen.map(klasse => (
                                                <option key={klasse.klassen_id} value={klasse.klassen_id}>
                                                    {klasse.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="adresse">Adresse</label>
                                        <input
                                            type="text"
                                            id="adresse"
                                            name="adresse"
                                            value={studentFormData.adresse}
                                            onChange={handleStudentFormChange}
                                        />
                                    </div>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="tel">Telefon</label>
                                            <input
                                                type="tel"
                                                id="tel"
                                                name="tel"
                                                value={studentFormData.tel}
                                                onChange={handleStudentFormChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">E-Mail</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={studentFormData.email}
                                                onChange={handleStudentFormChange}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="modal-buttons">
                                        <button 
                                            type="button" 
                                            className="cancel-button"
                                            onClick={() => setShowStudentForm(false)}
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
            )}

            {selectedTab === 'notifications' && (
                <AdminNotificationPanel />
            )}
        </div>
    );
};

export default AdminDashboard;