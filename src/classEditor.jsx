import React, { useState, useEffect } from 'react';
import './styles/classEditor.css';

const ClassEditor = () => {
  // state fuer klassendaten
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

  // dropdown optionen
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);
  const [klassenOptions, setKlassenOptions] = useState([]); 
  
  // api-url fuer backend-anfragen
  const API_URL = 'http://localhost:3001/api';
  
  // state fuer stundenplan
  const [schedule, setSchedule] = useState(Array(times.length).fill().map(() => Array(days.length).fill(null)));
  
  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ timeIndex: -1, dayIndex: -1 });
  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    room: ''
  });
  
  // status und meldungen
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedKlasse, setSelectedKlasse] = useState(''); 

  // beim ersten laden klassen und optionen abrufen
  useEffect(() => {
    loadKlassen();
    loadDropdownOptions();
  }, []);

  // wenn eine klasse ausgewaehlt wird
  useEffect(() => {
    if (selectedKlasse) {
      loadClassData(selectedKlasse);
    }
  }, [selectedKlasse]);

  // klassen vom backend laden
  const loadKlassen = async () => {
    try {
      const response = await fetch(`${API_URL}/stundenplan-management/klassen`);
      if (response.ok) {
        const data = await response.json();
        setKlassenOptions(data);
      } else {
        console.error('fehler beim laden der klassen:', response.status);
      }
    } catch (error) {
      console.error('fehler beim laden der klassen:', error);
    }
  };

  // dropdown optionen
  const loadDropdownOptions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // faecher laden
      const subjectsResponse = await fetch(`${API_URL}/stundenplan-management/faecher`);
      if (subjectsResponse.ok) {
        const subjectsData = await subjectsResponse.json();
        setSubjectOptions(subjectsData.map(subject => ({
          value: subject.fach_id,
          label: `${subject.name} (${subject.kurzname})`
        })));
      } else {
        console.error('fehler beim laden der faecher:', subjectsResponse.status);
      }
      
      // lehrer laden
      const teachersResponse = await fetch(`${API_URL}/stundenplan-management/lehrer`);
      if (teachersResponse.ok) {
        const teachersData = await teachersResponse.json();
        setTeacherOptions(teachersData.map(teacher => ({
          value: teacher.lehrer_id,
          label: `${teacher.vorname || ''} ${teacher.nachname || ''} ${teacher.krzl ? `(${teacher.krzl})` : ''}`
        })));
      } else {
        console.error('fehler beim laden der lehrer:', teachersResponse.status);
      }
      
      // raeume laden
      const roomsResponse = await fetch(`${API_URL}/stundenplan-management/raeume`);
      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        setRoomOptions(roomsData.map(room => ({
          value: room.raum_id,
          label: `${room.nummer} ${room.name ? `(${room.name})` : ''}`
        })));
      } else {
        console.error('fehler beim laden der raeume:', roomsResponse.status);
      }
    } catch (err) {
      console.error('fehler beim laden der dropdown-optionen:', err);
      setError('fehler beim laden der dropdown-optionen.');
    } finally {
      setLoading(false);
    }
  };

  // klassendaten vom backend laden
  const loadClassData = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // wichtig: wir vergleichen strings nicht zahlen
      const selectedKlasseObj = klassenOptions.find(k => String(k.klassen_id) === String(id));
      
      if (selectedKlasseObj) {
        const klassenName = selectedKlasseObj.name;
        setClassName(`${klassenName} - ${getFullClassName(klassenName)}`);
        
        // stundenplan vom backend laden
        const scheduleResponse = await fetch(`${API_URL}/stundenplan-management/${klassenName}`);
        
        if (scheduleResponse.ok) {
          const scheduleData = await scheduleResponse.json();
          processScheduleData(scheduleData);
          setError(null);
        } else {
          console.error(`fehler beim laden des stundenplans fuer ${klassenName}`);
          setError(`fehler beim laden des stundenplans fuer ${klassenName}`);
          setSchedule(Array(times.length).fill().map(() => Array(days.length).fill(null)));
        }
      } else {
        setClassName('klasse nicht gefunden');
        setError('die ausgewaehlte klasse wurde nicht gefunden.');
        setSchedule(Array(times.length).fill().map(() => Array(days.length).fill(null)));
      }
    } catch (error) {
      console.error('fehler beim laden der klassendaten:', error);
      setError(`fehler beim laden der klassendaten: ${error.message}`);
      setSchedule(Array(times.length).fill().map(() => Array(days.length).fill(null)));
    } finally {
      setLoading(false);
    }
  };

  // hilfsfunktion: formatieren des vollstaendigen klassennamens
  const getFullClassName = (shortName) => {
    const classTypes = {
      "ITA": "Informatiktechnische Assistenten",
      "BTA": "Biologisch-technische Assistenten",
      "GD": "Gestaltungstechnische Assistenten",
      "PTA": "Pharmazeutisch-technische Assistenten"
    };
    
    // extrahiere den typ aus dem kurznamen (z.B. "ITA" aus "ITA25")
    const match = shortName.match(/^([A-Z]+)\d+/);
    if (match && match[1] && classTypes[match[1]]) {
      return classTypes[match[1]];
    }
    return "Klasse";
  };

  // stundenplan-daten vom backend verarbeiten
  const processScheduleData = (data) => {
    // leeren stundenplan erstellen
    const newSchedule = Array(times.length).fill().map(() => Array(days.length).fill(null));
    
    // tage mapping
    const dayPrefixes = ['mo', 'di', 'mi', 'do', 'fr'];
    
    // fuer jede stunde im stundenplan
    data.forEach(hourData => {
      const timeIndex = hourData.stunde - 1; // stunde wird ab 1 gezaehlt
      
      if (timeIndex >= 0 && timeIndex < times.length) {
        // jeder tag verarbeiten
        dayPrefixes.forEach((prefix, dayIndex) => {
          const fachId = hourData[`fach_${prefix}`];
          
          if (fachId) {
            // fach, raum und lehrer IDs auslesen
            const raumId = hourData[`raum_${prefix}`];
            const lehrerId = hourData[`lehrer_${prefix}`];
            
            // fach-details ermitteln
            const fach = subjectOptions.find(f => f.value === fachId);
            const raum = roomOptions.find(r => r.value === raumId);
            const lehrer = teacherOptions.find(l => l.value === lehrerId);
            
            // in den stundenplan eintragen
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

  // modal zum bearbeiten oeffnen
  const openModal = (timeIndex, dayIndex) => {
    const cellData = schedule[timeIndex][dayIndex] || { subject: '', teacher: '', room: '' };
    setSelectedCell({ timeIndex, dayIndex });
    setFormData(cellData);
    setIsModalOpen(true);
  };

  // modal schliessen
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCell({ timeIndex: -1, dayIndex: -1 });
  };

  // auswahl im modal aendern
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // klassenauswahl
  const handleClassChange = (e) => {
    setSelectedKlasse(e.target.value);
  };

  // formular absenden (stundenplan aktualisieren)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // klassenname ermitteln
      const selectedKlasseObj = klassenOptions.find(k => 
        String(k.klassen_id) === String(selectedKlasse)
      );
      
      if (!selectedKlasseObj) {
        throw new Error('klassenname konnte nicht ermittelt werden');
      }
      
      const klassenName = selectedKlasseObj.name;
      
      // tag fuer api-aufruf bestimmen
      const dayMapping = {
        0: "montag",
        1: "dienstag",
        2: "mittwoch",
        3: "donnerstag",
        4: "freitag"
      };
      
      // ids ermitteln
      const fachOption = subjectOptions.find(option => option.label.startsWith(formData.subject));
      const raumOption = roomOptions.find(option => option.label.startsWith(formData.room));
      const lehrerOption = teacherOptions.find(option => option.label.startsWith(formData.teacher));
      
      const fachId = fachOption ? fachOption.value : null;
      const raumId = raumOption ? raumOption.value : null;
      const lehrerId = lehrerOption ? lehrerOption.value : null;
      
      // api-aufruf zum aktualisieren
      const response = await fetch(`${API_URL}/stundenplan-management/unterricht`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          klassenName,
          stunde: selectedCell.timeIndex + 1, // stunde ist 1-basiert
          tag: dayMapping[selectedCell.dayIndex],
          fachId,
          raumId,
          lehrerId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'fehler beim speichern');
      }
      
      // erfolg!
      setSuccessMessage('stundenplan erfolgreich aktualisiert');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // lokalen stundenplan aktualisieren
      const newSchedule = [...schedule];
      newSchedule[selectedCell.timeIndex][selectedCell.dayIndex] = { 
        ...formData,
        fachId,
        raumId,
        lehrerId
      };
      setSchedule(newSchedule);
      
      // modal schliessen
      closeModal();
      
      // stundenplan neu laden
      loadClassData(selectedKlasse);
    } catch (err) {
      console.error('fehler beim speichern des unterrichts:', err);
      setError(`fehler beim speichern: ${err.message}`);
      
      // lokalen stundenplan aktualisieren (fallback)
      const newSchedule = [...schedule];
      newSchedule[selectedCell.timeIndex][selectedCell.dayIndex] = { ...formData };
      setSchedule(newSchedule);
      
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  // unterricht loeschen
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // klassenname ermitteln
      const selectedKlasseObj = klassenOptions.find(k => 
        String(k.klassen_id) === String(selectedKlasse)
      );
      
      if (!selectedKlasseObj) {
        throw new Error('klassenname konnte nicht ermittelt werden');
      }
      
      const klassenName = selectedKlasseObj.name;
      
      // tag fuer api-aufruf bestimmen
      const dayMapping = {
        0: "montag",
        1: "dienstag",
        2: "mittwoch",
        3: "donnerstag",
        4: "freitag"
      };
      
      // api-aufruf zum loeschen
      const response = await fetch(`${API_URL}/stundenplan-management/unterricht`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          klassenName,
          stunde: selectedCell.timeIndex + 1, // stunde ist 1-basiert
          tag: dayMapping[selectedCell.dayIndex]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'fehler beim loeschen');
      }
      
      // erfolg!
      setSuccessMessage('unterricht erfolgreich geloescht');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // lokalen stundenplan aktualisieren
      const newSchedule = [...schedule];
      newSchedule[selectedCell.timeIndex][selectedCell.dayIndex] = null;
      setSchedule(newSchedule);
      
      // modal schliessen
      closeModal();
      
      // stundenplan neu laden
      loadClassData(selectedKlasse);
    } catch (err) {
      console.error('fehler beim loeschen des unterrichts:', err);
      setError(`fehler beim loeschen: ${err.message}`);
      
      // lokalen stundenplan aktualisieren (fallback)
      const newSchedule = [...schedule];
      newSchedule[selectedCell.timeIndex][selectedCell.dayIndex] = null;
      setSchedule(newSchedule);
      
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  // stundenplan speichern
  const saveSchedule = async () => {
    setSuccessMessage('stundenplan gespeichert!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="class-editor-container">
      <div className="editor-header">
        <h2>Stundenplanverwaltung</h2>
        
        {/* klassenauswahl */}
        <div className="class-selector">
          <select 
            value={selectedKlasse || ''} 
            onChange={handleClassChange}
            className="class-select"
            disabled={loading}
          >
            <option value="">Klasse auswaehlen...</option>
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
          <h2>Stundenplan fuer {className}</h2>
          
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
          <p>Bitte waehlen Sie eine Klasse aus dem Dropdown-Menue, um deren Stundenplan zu bearbeiten.</p>
        </div>
      )}

      {/* modal */}
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
                  <option value="">Bitte waehlen...</option>
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
                  <option value="">Bitte waehlen...</option>
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
                  <option value="">Bitte waehlen...</option>
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
                  <span className="button-icon">🗑️</span> Loeschen
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