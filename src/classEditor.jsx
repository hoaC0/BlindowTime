import React, { useState, useEffect } from 'react';
import './classEditor.css';

const ClassEditor = () => {
  // State für Klassendaten
  const [className, setClassName] = useState('');
  const [days] = useState(["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]);
  const [times] = useState([
    "08:00 - 08:45",
    "08:45 - 09:30",
    "09:45 - 10:30",
    "10:30 - 11:15",
    "11:30 - 12:15",
    "12:15 - 13:00",
    "14:00 - 14:45",
    "14:45 - 15:30",
    "15:45 - 16:30",
    "16:30 - 17:15",
    "17:30 - 18:15",
    "18:15 - 19:00",
    "19:15 - 20:00",
  ]);

  // Dropdown-Optionen
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);
  const [klassenOptions, setKlassenOptions] = useState([]); 
  
  // API-URL für Backend-Anfragen
  const API_URL = 'http://localhost:3001/api';
  
  // State für Stundenplan
  const [schedule, setSchedule] = useState(Array(times.length).fill().map(() => Array(days.length).fill(null)));
  
  // State für das Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ timeIndex: -1, dayIndex: -1 });
  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    room: ''
  });
  
  // State für Status und Meldungen
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedKlasse, setSelectedKlasse] = useState(''); 

  // Beim ersten Laden Klassen und Optionen abrufen
  useEffect(() => {
    loadKlassen();
    loadDropdownOptions();
  }, []);

  // Wenn eine Klasse ausgewählt wird
  useEffect(() => {
    if (selectedKlasse) {
      loadClassData(selectedKlasse);
    }
  }, [selectedKlasse]);

  // Klassen vom Backend laden
  const loadKlassen = async () => {
    try {
      const response = await fetch(`${API_URL}/stundenplan-management/klassen`);
      if (response.ok) {
        const data = await response.json();
        setKlassenOptions(data);
      } else {
        console.error('Fehler beim Laden der Klassen:', response.status);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Klassen:', error);
    }
  };

  // Dropdown-Optionen vom Backend laden
  const loadDropdownOptions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fächer laden
      const subjectsResponse = await fetch(`${API_URL}/stundenplan-management/faecher`);
      if (subjectsResponse.ok) {
        const subjectsData = await subjectsResponse.json();
        setSubjectOptions(subjectsData.map(subject => ({
          value: subject.fach_id,
          label: `${subject.name} (${subject.kurzname})`
        })));
      } else {
        console.error('Fehler beim Laden der Fächer:', subjectsResponse.status);
      }
      
      // Lehrer laden
      const teachersResponse = await fetch(`${API_URL}/stundenplan-management/lehrer`);
      if (teachersResponse.ok) {
        const teachersData = await teachersResponse.json();
        setTeacherOptions(teachersData.map(teacher => ({
          value: teacher.lehrer_id,
          label: `${teacher.vorname || ''} ${teacher.nachname || ''} ${teacher.krzl ? `(${teacher.krzl})` : ''}`
        })));
      } else {
        console.error('Fehler beim Laden der Lehrer:', teachersResponse.status);
      }
      
      // Räume laden
      const roomsResponse = await fetch(`${API_URL}/stundenplan-management/raeume`);
      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        setRoomOptions(roomsData.map(room => ({
          value: room.raum_id,
          label: `${room.nummer} ${room.name ? `(${room.name})` : ''}`
        })));
      } else {
        console.error('Fehler beim Laden der Räume:', roomsResponse.status);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Dropdown-Optionen:', err);
      setError('Fehler beim Laden der Dropdown-Optionen.');
    } finally {
      setLoading(false);
    }
  };

  // Klassendaten vom Backend laden
  const loadClassData = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Wichtig: Wir vergleichen Strings, nicht Zahlen
      const selectedKlasseObj = klassenOptions.find(k => String(k.klassen_id) === String(id));
      
      if (selectedKlasseObj) {
        const klassenName = selectedKlasseObj.name;
        setClassName(`${klassenName} - ${getFullClassName(klassenName)}`);
        
        // Stundenplan vom Backend laden - hier ist der Klassenname wichtig, nicht die ID
        const scheduleResponse = await fetch(`${API_URL}/stundenplan-management/${klassenName}`);
        
        if (scheduleResponse.ok) {
          const scheduleData = await scheduleResponse.json();
          processScheduleData(scheduleData);
          setError(null);
        } else {
          console.error(`Fehler beim Laden des Stundenplans für ${klassenName}`);
          setError(`Fehler beim Laden des Stundenplans für ${klassenName}`);
          setSchedule(Array(times.length).fill().map(() => Array(days.length).fill(null)));
        }
      } else {
        setClassName('Klasse nicht gefunden');
        setError('Die ausgewählte Klasse wurde nicht gefunden.');
        setSchedule(Array(times.length).fill().map(() => Array(days.length).fill(null)));
      }
    } catch (error) {
      console.error('Fehler beim Laden der Klassendaten:', error);
      setError(`Fehler beim Laden der Klassendaten: ${error.message}`);
      setSchedule(Array(times.length).fill().map(() => Array(days.length).fill(null)));
    } finally {
      setLoading(false);
    }
  };

  // Hilfsfunktion: Formatieren des vollständigen Klassennamens
  const getFullClassName = (shortName) => {
    const classTypes = {
      "ITA": "Informatiktechnische Assistenten",
      "BTA": "Biologisch-technische Assistenten",
      "GD": "Gestaltungstechnische Assistenten",
      "PTA": "Pharmazeutisch-technische Assistenten"
    };
    
    // Extrahiere den Typ aus dem Kurznamen (z.B. "ITA" aus "ITA25")
    const match = shortName.match(/^([A-Z]+)\d+/);
    if (match && match[1] && classTypes[match[1]]) {
      return classTypes[match[1]];
    }
    return "Klasse";
  };

  // Stundenplan-Daten vom Backend verarbeiten
  const processScheduleData = (data) => {
    // Leeren Stundenplan erstellen
    const newSchedule = Array(times.length).fill().map(() => Array(days.length).fill(null));
    
    // Tage-Mapping
    const dayPrefixes = ['mo', 'di', 'mi', 'do', 'fr'];
    
    // Für jede Stunde im Stundenplan
    data.forEach(hourData => {
      const timeIndex = hourData.stunde - 1; // Stunde wird ab 1 gezählt
      
      if (timeIndex >= 0 && timeIndex < times.length) {
        // Jeder Tag verarbeiten
        dayPrefixes.forEach((prefix, dayIndex) => {
          const fachId = hourData[`fach_${prefix}`];
          
          if (fachId) {
            // Fach, Raum und Lehrer IDs auslesen
            const raumId = hourData[`raum_${prefix}`];
            const lehrerId = hourData[`lehrer_${prefix}`];
            
            // Fach-Details ermitteln
            const fach = subjectOptions.find(f => f.value === fachId);
            const raum = roomOptions.find(r => r.value === raumId);
            const lehrer = teacherOptions.find(l => l.value === lehrerId);
            
            // In den Stundenplan eintragen
            newSchedule[timeIndex][dayIndex] = {
              subject: fach ? fach.label.split(' (')[0] : 'Unbekannt',
              teacher: lehrer ? lehrer.label.split(' (')[0] : 'Unbekannt',
              room: raum ? raum.label.split(' (')[0] : 'Unbekannt',
              fachId,
              raumId,
              lehrerId
            };
          }
        });
      }
    });
    
    setSchedule(newSchedule);
  };

  // Modal zum Bearbeiten öffnen
  const openModal = (timeIndex, dayIndex) => {
    const cellData = schedule[timeIndex][dayIndex] || { subject: '', teacher: '', room: '' };
    setSelectedCell({ timeIndex, dayIndex });
    setFormData(cellData);
    setIsModalOpen(true);
  };

  // Modal schließen
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCell({ timeIndex: -1, dayIndex: -1 });
  };

  // Auswahl im Modal ändern
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Klassenauswahl ändern
  const handleClassChange = (e) => {
    setSelectedKlasse(e.target.value);
  };

  // Formular absenden (Stundenplan aktualisieren)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Klassenname ermitteln
      const selectedKlasseObj = klassenOptions.find(k => 
        String(k.klassen_id) === String(selectedKlasse)
      );
      
      if (!selectedKlasseObj) {
        throw new Error('Klassenname konnte nicht ermittelt werden');
      }
      
      const klassenName = selectedKlasseObj.name;
      
      // Tag für API-Aufruf bestimmen
      const dayMapping = {
        0: "montag",
        1: "dienstag",
        2: "mittwoch",
        3: "donnerstag",
        4: "freitag"
      };
      
      // IDs für Fach, Raum und Lehrer ermitteln
      const fachOption = subjectOptions.find(option => option.label.startsWith(formData.subject));
      const raumOption = roomOptions.find(option => option.label.startsWith(formData.room));
      const lehrerOption = teacherOptions.find(option => option.label.startsWith(formData.teacher));
      
      const fachId = fachOption ? fachOption.value : null;
      const raumId = raumOption ? raumOption.value : null;
      const lehrerId = lehrerOption ? lehrerOption.value : null;
      
      // API-Aufruf zum Aktualisieren
      const response = await fetch(`${API_URL}/stundenplan-management/unterricht`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          klassenName,
          stunde: selectedCell.timeIndex + 1, // Stunde ist 1-basiert
          tag: dayMapping[selectedCell.dayIndex],
          fachId,
          raumId,
          lehrerId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Fehler beim Speichern');
      }
      
      // Erfolg!
      setSuccessMessage('Stundenplan erfolgreich aktualisiert');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Lokalen Stundenplan aktualisieren
      const newSchedule = [...schedule];
      newSchedule[selectedCell.timeIndex][selectedCell.dayIndex] = { 
        ...formData,
        fachId,
        raumId,
        lehrerId
      };
      setSchedule(newSchedule);
      
      // Modal schließen
      closeModal();
      
      // Stundenplan neu laden
      loadClassData(selectedKlasse);
    } catch (err) {
      console.error('Fehler beim Speichern des Unterrichts:', err);
      setError(`Fehler beim Speichern: ${err.message}`);
      
      // Lokalen Stundenplan aktualisieren (Fallback)
      const newSchedule = [...schedule];
      newSchedule[selectedCell.timeIndex][selectedCell.dayIndex] = { ...formData };
      setSchedule(newSchedule);
      
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  // Unterricht löschen
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Klassenname ermitteln
      const selectedKlasseObj = klassenOptions.find(k => 
        String(k.klassen_id) === String(selectedKlasse)
      );
      
      if (!selectedKlasseObj) {
        throw new Error('Klassenname konnte nicht ermittelt werden');
      }
      
      const klassenName = selectedKlasseObj.name;
      
      // Tag für API-Aufruf bestimmen
      const dayMapping = {
        0: "montag",
        1: "dienstag",
        2: "mittwoch",
        3: "donnerstag",
        4: "freitag"
      };
      
      // API-Aufruf zum Löschen
      const response = await fetch(`${API_URL}/stundenplan-management/unterricht`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          klassenName,
          stunde: selectedCell.timeIndex + 1, // Stunde ist 1-basiert
          tag: dayMapping[selectedCell.dayIndex]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Fehler beim Löschen');
      }
      
      // Erfolg!
      setSuccessMessage('Unterricht erfolgreich gelöscht');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Lokalen Stundenplan aktualisieren
      const newSchedule = [...schedule];
      newSchedule[selectedCell.timeIndex][selectedCell.dayIndex] = null;
      setSchedule(newSchedule);
      
      // Modal schließen
      closeModal();
      
      // Stundenplan neu laden
      loadClassData(selectedKlasse);
    } catch (err) {
      console.error('Fehler beim Löschen des Unterrichts:', err);
      setError(`Fehler beim Löschen: ${err.message}`);
      
      // Lokalen Stundenplan aktualisieren (Fallback)
      const newSchedule = [...schedule];
      newSchedule[selectedCell.timeIndex][selectedCell.dayIndex] = null;
      setSchedule(newSchedule);
      
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  // Stundenplan speichern
  const saveSchedule = async () => {
    setSuccessMessage('Stundenplan gespeichert!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="class-editor-container">
      <div className="editor-header">
        <h2>Stundenplanverwaltung</h2>
        
        {/* Klassenauswahl-Dropdown hinzufügen */}
        <div className="class-selector">
          <select 
            value={selectedKlasse || ''} 
            onChange={handleClassChange}
            className="class-select"
            disabled={loading}
          >
            <option value="">Klasse auswählen...</option>
            {klassenOptions.map(klasse => (
              <option key={klasse.klassen_id} value={klasse.klassen_id}>
                {klasse.name} - {getFullClassName(klasse.name)}
              </option>
            ))}
          </select>
        </div>
        
        <button className="save-button" onClick={saveSchedule} disabled={!selectedKlasse}>Speichern</button>
      </div>

      {error && (
        <div className="error-message" style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '20px', borderRadius: '5px' }}>
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message" style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '20px', borderRadius: '5px' }}>
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="loading-indicator" style={{ textAlign: 'center', padding: '20px' }}>
          Daten werden geladen...
        </div>
      ) : selectedKlasse ? (
        <div>
          <h2>Stundenplan für {className}</h2>
          
          <div className="schedule-grid">
            {/* header */}
            <div className="schedule-cell header">Stunde</div>
            {days.map((day, index) => (
              <div key={index} className="schedule-cell header">
                {day}
              </div>
            ))}
    
            {times.map((time, timeIndex) => (
              <React.Fragment key={timeIndex}>
                <div className="schedule-cell time-cell" title={time}>
                  {timeIndex + 1}
                </div>
    
                {days.map((day, dayIndex) => {
                  const cellData = schedule[timeIndex][dayIndex];
                  return (
                    <div 
                      key={`cell-${timeIndex}-${dayIndex}`} 
                      className={`schedule-cell ${cellData ? 'has-class' : ''}`}
                      onClick={() => openModal(timeIndex, dayIndex)}
                    >
                      {cellData ? (
                        <div className="cell-content">
                          <div className="subject">{cellData.subject}</div>
                          <div className="details">{cellData.teacher} | {cellData.room}</div>
                        </div>
                      ) : (
                        <div className="cell-empty">
                          <span>+</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-class-selected" style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginTop: '20px' }}>
          <p>Bitte wählen Sie eine Klasse aus dem Dropdown-Menü, um deren Stundenplan zu bearbeiten.</p>
        </div>
      )}

      {/* Modal für die Bearbeitung */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Unterricht bearbeiten</h3>
              <button className="close-modal-button" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="subject">Fach</label>
                <select 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleSelectChange}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="">Bitte wählen...</option>
                  {subjectOptions.map(option => (
                    <option key={option.value} value={option.label.split(' (')[0]}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="teacher">Lehrer</label>
                <select 
                  id="teacher" 
                  name="teacher" 
                  value={formData.teacher} 
                  onChange={handleSelectChange}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="">Bitte wählen...</option>
                  {teacherOptions.map(option => (
                    <option key={option.value} value={option.label.split(' (')[0]}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="room">Raum</label>
                <select 
                  id="room" 
                  name="room" 
                  value={formData.room} 
                  onChange={handleSelectChange}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="">Bitte wählen...</option>
                  {roomOptions.map(option => (
                    <option key={option.value} value={option.label.split(' (')[0]}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="modal-buttons">
                <button 
                  type="button" 
                  className="delete-button" 
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <span className="button-icon">🗑️</span> Löschen
                </button>
                <div className="action-buttons">
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={closeModal}
                    disabled={loading}
                  >
                    Abbrechen
                  </button>
                  <button 
                    type="submit" 
                    className="save-button"
                    disabled={loading}
                  >
                    <span className="button-icon">✓</span> Speichern
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassEditor;