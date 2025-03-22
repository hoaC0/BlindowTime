// src/StundenplanAnzeige.jsx
import React, { useState, useEffect } from 'react';
import "./styles/tempSchedule.css";

const tempSchedule = () => {
  const [aktuelleKlasse, setAktuelleKlasse] = useState('');
  const [tage] = useState(["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]);
  const [zeiten] = useState([
    { id: 1, zeit: "08:00 - 08:45" },
    { id: 2, zeit: "08:45 - 09:30" },
    { id: 3, zeit: "09:45 - 10:30" },
    { id: 4, zeit: "10:30 - 11:15" },
    { id: 5, zeit: "11:30 - 12:15" },
    { id: 6, zeit: "12:15 - 13:00" },
    { id: 7, zeit: "14:00 - 14:45" },
    { id: 8, zeit: "14:45 - 15:30" },
    { id: 9, zeit: "15:45 - 16:30" },
    { id: 10, zeit: "16:30 - 17:15" },
    { id: 11, zeit: "17:30 - 18:15" },
    { id: 12, zeit: "18:15 - 19:00" },
    { id: 13, zeit: "19:15 - 20:00" }
  ]);

  // Stundenplan-Daten
  const [stundenplanDaten, setStundenplanDaten] = useState([]);
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState(null);
  
  // Aktueller Tag für Highlight-Funktion
  const aktuellerTag = new Date().getDay(); // 0 = Sonntag, 1 = Montag, ...
  const aktuellerTagIndex = aktuellerTag === 0 || aktuellerTag === 6 ? -1 : aktuellerTag - 1;
  
  // Klassenoptionen für Dropdown
  const [klassenOptionen, setKlassenOptionen] = useState([
    { id: '', name: 'Bitte wählen...' }
  ]);

  // API URL
  const API_URL = 'http://localhost:3001/api';

  // Beim Laden der Komponente: Cookie lesen
  useEffect(() => {
    // Cookie für gespeicherte Klasse lesen
    const gespeicherteKlasse = getCookie('selectedClass');
    if (gespeicherteKlasse) {
      setAktuelleKlasse(gespeicherteKlasse);
    }
  }, []);

  // Laden der Klassen für das Dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${API_URL}/stundenplan/klassen/alle`);
        
        if (response.ok) {
          const klassen = await response.json();
          const formattierteKlassen = [
            { id: '', name: 'Bitte wählen...' },
            ...klassen.map(cls => ({ 
              id: cls.name, 
              name: cls.name 
            }))
          ];
          setKlassenOptionen(formattierteKlassen);
        } else {
          console.error('Fehler beim Laden der Klassen:', response.status);
          // Fallback zu statischen Daten
          setKlassenOptionen([
            { id: '', name: 'Bitte wählen...' },
            { id: 'ITA25', name: 'ITA25' },
            { id: 'BTA25', name: 'BTA25' },
            { id: 'GD25', name: 'GD25' },
            { id: 'PTA25', name: 'PTA25' }
          ]);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Klassen:', error);
        // Fallback zu statischen Daten
        setKlassenOptionen([
          { id: '', name: 'Bitte wählen...' },
          { id: 'ITA25', name: 'ITA25' },
          { id: 'BTA25', name: 'BTA25' },
          { id: 'GD25', name: 'GD25' },
          { id: 'PTA25', name: 'PTA25' }
        ]);
      }
    };
    
    fetchClasses();
  }, [API_URL]);

  // Laden des Stundenplans basierend auf der ausgewählten Klasse
  useEffect(() => {
    if (!aktuelleKlasse) {
      setStundenplanDaten([]);
      return;
    }
    
    const fetchSchedule = async () => {
      setLaden(true);
      setFehler(null);
      
      try {
        const response = await fetch(`${API_URL}/stundenplan/${aktuelleKlasse}`);
        
        if (response.ok) {
          const data = await response.json();
          setStundenplanDaten(data);
        } else {
          console.error('Fehler beim Laden des Stundenplans:', response.status);
          setFehler('Der Stundenplan konnte nicht geladen werden.');
          setStundenplanDaten([]);
        }
      } catch (error) {
        console.error('Fehler beim Laden des Stundenplans:', error);
        setFehler('Der Stundenplan konnte nicht geladen werden.');
        setStundenplanDaten([]);
      } finally {
        setLaden(false);
      }
    };
    
    fetchSchedule();
  }, [aktuelleKlasse, API_URL]);

  // Cookie-Funktionen
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

  const handleKlassenWechsel = (e) => {
    const neueKlasse = e.target.value;
    setAktuelleKlasse(neueKlasse);
    
    // Speichere Klassenauswahl in Cookie (für 30 Tage)
    if (neueKlasse) {
      setCookie('selectedClass', neueKlasse, 30);
    } else {
      // Wenn keine Klasse ausgewählt ist, lösche das Cookie
      document.cookie = "selectedClass=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  };

  // Diese Funktion gibt die Unterrichtsdaten für eine bestimmte Stunde und einen Tag zurück
  const getUnterrichtFuerStundeUndTag = (stundenId, tagIndex) => {
    if (!stundenplanDaten || stundenplanDaten.length === 0) return null;

    // Suche nach dem passenden Stundeneintrag
    const stunde = stundenplanDaten.find(eintrag => eintrag.stunde === stundenId);
    if (!stunde) return null;

    // Tagespräfixe für die Datenfelder
    const tagPraefix = ['mo', 'di', 'mi', 'do', 'fr'][tagIndex];
    const fachId = stunde[`fach_${tagPraefix}`];
    
    // Wenn kein Fach für diesen Tag/diese Stunde existiert
    if (!fachId) return null;

    // Erstelle ein Unterrichtsobjekt mit allen relevanten Daten
    return {
      fachId,
      fachName: stunde[`fach_${tagPraefix}_name`],
      fachFarbe: stunde[`fach_${tagPraefix}_farbe`],
      raumId: stunde[`raum_${tagPraefix}`],
      raumNummer: stunde[`raum_${tagPraefix}_nummer`],
      raumName: stunde[`raum_${tagPraefix}_name`],
      lehrerId: stunde[`lehrer_${tagPraefix}`],
      lehrerVorname: stunde[`lehrer_${tagPraefix}_vorname`],
      lehrerNachname: stunde[`lehrer_${tagPraefix}_nachname`]
    };
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <div className="schedule-title-area">
          <h2>Stundenplan</h2>
          <div className="current-date-display">
            <div className="today-marker">
              Heute: {aktuellerTagIndex >= 0 ? tage[aktuellerTagIndex] : 'Wochenende'}
            </div>
          </div>
        </div>
        <div className="class-selector">
          <label htmlFor="class-select">Klasse:</label>
          <select 
            id="class-select" 
            value={aktuelleKlasse} 
            onChange={handleKlassenWechsel}
            className="class-select"
          >
            {/* Nur ein einziger map-Aufruf */}
            {klassenOptionen.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {fehler && (
        <div className="error-message" style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '20px', borderRadius: '5px' }}>
          {fehler}
          {fehler}
        </div>
      )}
      
      {laden ? (
        <div className="loading-message" style={{ textAlign: 'center', padding: '20px' }}>
          Stundenplan wird geladen...
        </div>
      ) : (
        <div className="schedule-grid">
          {/* Überschriften-Zeile */}
          <div className="schedule-cell header time-header">Zeit</div>
          {tage.map((tag, index) => (
            <div 
              key={index} 
              className={`schedule-cell header ${index === aktuellerTagIndex ? 'current-day' : ''}`}
            >
              {tag}
            </div>
          ))}
          
          {/* Stundenzeilen */}
          {zeiten.map((zeit) => (
            <React.Fragment key={zeit.id}>
              <div className="schedule-cell time-cell" title={zeit.zeit}>
                <div className="hour-number">{zeit.id}</div>
                <div className="hour-time">{zeit.zeit}</div>
              </div>
              
              {tage.map((_, tagIndex) => {
                const unterricht = getUnterrichtFuerStundeUndTag(zeit.id, tagIndex);
                return (
                  <div 
                    key={`${zeit.id}-${tagIndex}`} 
                    className={`schedule-cell ${tagIndex === aktuellerTagIndex ? 'current-day-column' : ''} ${unterricht ? 'has-class' : ''}`}
                  >
                    {unterricht && (
                      <div 
                        className="class-card" 
                        style={{borderLeftColor: unterricht.fachFarbe || '#0f3c63'}}
                      >
                        <div className="class-subject" style={{color: unterricht.fachFarbe || '#0f3c63'}}>
                          {unterricht.fachName}
                        </div>
                        <div className="class-details">
                          <span className="class-teacher">
                            {unterricht.lehrerVorname ? 
                              `${unterricht.lehrerVorname.charAt(0)}. ${unterricht.lehrerNachname}` : 
                              'Kein Lehrer'}
                          </span>
                          <span className="class-room">
                            {unterricht.raumNummer || unterricht.raumName || 'Kein Raum'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}
      
      <div className="schedule-legend">
        <div className="legend-title">Legende:</div>
        <div className="legend-item">
          <div className="legend-dot current-day-dot"></div>
          <div>Heutiger Tag</div>
        </div>
      </div>
    </div>
  );
};

export default tempSchedule;