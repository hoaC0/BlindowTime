import React, { useState, useEffect } from 'react';
import './styles/mensaWochenplan.css';

const MensaWochenplan = () => {
  const [wochenplan, setWochenplan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aktiveWoche, setAktiveWoche] = useState(getInitialWeek());
  
  // API-URL für Mensa-Daten
  const API_URL = 'http://localhost:3001/api';
  
  // Funktion zum Ermitteln der initialen Woche
  // Werktags: aktuelle Woche, Wochenende: nächste Woche
  function getInitialWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sonntag, 1 = Montag, ...
    
    // Am Wochenende (Samstag = 6, Sonntag = 0) zeigen wir die nächste Woche an
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Aktuelle Woche des Datums herausfinden
    // Montag der aktuellen Woche ermitteln
    const currentDate = new Date(today);
    const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); 
    currentDate.setDate(diff);
    
    // Aktuelle Kalenderwoche aus dem berechneten Montag bestimmen
    const currentWeek = getWeekNumber(currentDate);
    
    // Wenn Wochenende, dann nächste Woche anzeigen, sonst aktuelle
    return isWeekend ? currentWeek + 1 : currentWeek;
  }

  // Funktion zur Berechnung der Kalenderwoche nach ISO 8601
  function getWeekNumber(d) {
    // Kopie des Datums, um es nicht zu ändern
    const date = new Date(d.getTime());
    
    // Auf den nächsten Donnerstag setzen
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    
    // Erster Donnerstag im Jahr
    const firstThursday = new Date(date.getFullYear(), 0, 4);
    firstThursday.setDate(firstThursday.getDate() + 3 - (firstThursday.getDay() + 6) % 7);
    
    // Woche berechnen
    const weekNumber = 1 + Math.floor((date - firstThursday) / (7 * 24 * 60 * 60 * 1000));
    
    return weekNumber;
  }
  
  // Prüfen, ob es der aktuelle Tag ist
  const isCurrentDay = (tag) => {
    const heute = new Date().getDay(); // 0 = Sonntag, 1 = Montag, ...
    return heute === getWochentagIndex(tag) + 1; // +1, weil getWochentagIndex bei 0 für Montag beginnt
  };

  const getWochentagIndex = (tag) => {
    const wochentage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    return wochentage.indexOf(tag);
  };

  // Dummy-Daten für die Entwicklung
  const dummyData = [
    {
      tag: "Montag",
      datum: "18.03.2025",
      hauptgericht: "Spaghetti Bolognese",
      vegetarisch: "Spaghetti Napoli",
      beilage: "Parmesan, Salat",
      nachtisch: "Vanillepudding",
      preis: "4,20 €"
    },
    {
      tag: "Dienstag",
      datum: "19.03.2025",
      hauptgericht: "Schnitzel mit Pommes",
      vegetarisch: "Gemüseschnitzel mit Pommes",
      beilage: "Erbsen und Möhren",
      nachtisch: "Obstsalat",
      preis: "4,50 €"
    },
    {
      tag: "Mittwoch",
      datum: "20.03.2025",
      hauptgericht: "Hähnchencurry mit Reis",
      vegetarisch: "Gemüsecurry mit Reis",
      beilage: "Mango-Chutney",
      nachtisch: "Joghurt mit Früchten",
      preis: "4,30 €"
    },
    {
      tag: "Donnerstag",
      datum: "21.03.2025",
      hauptgericht: "Rindergulasch",
      vegetarisch: "Champignongulasch",
      beilage: "Kartoffeln, Rotkohl",
      nachtisch: "Schokoladenpudding",
      preis: "4,80 €"
    },
    {
      tag: "Freitag",
      datum: "22.03.2025",
      hauptgericht: "Fischfilet",
      vegetarisch: "Grillkäse",
      beilage: "Kartoffelpüree, Gurkensalat",
      nachtisch: "Berliner",
      preis: "4,10 €"
    }
  ];

  // Menüplan vom Backend laden
  useEffect(() => {
    const fetchMensaplan = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/mensa/wochenplan/${aktiveWoche}`);
        
        if (response.ok) {
          const data = await response.json();
          setWochenplan(data);
          setError(null);
        } else {
          console.error('Fehler beim Laden des Mensaplans:', response.status);
          // Im Fehlerfall Dummy-Daten verwenden
          setWochenplan(dummyData);
        }
      } catch (error) {
        console.error('Fehler beim Laden des Mensaplans:', error);
        setError('Der Mensaplan konnte nicht geladen werden. Wir zeigen dir Beispieldaten.');
        // Bei Netzwerkfehlern auch Dummy-Daten verwenden
        setWochenplan(dummyData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMensaplan();
  }, [aktiveWoche]);

  // Woche wechseln
  const vorherigeWoche = () => {
    setAktiveWoche(aktiveWoche - 1);
  };

  const naechsteWoche = () => {
    setAktiveWoche(aktiveWoche + 1);
  };

  return (
    <div className="mensa-container">
      <div className="mensa-header">
        <h1>Mensa-Speiseplan</h1>
        <div className="wochenauswahl">
          <button className="woche-button" onClick={vorherigeWoche}>&lt;</button>
          <span className="active-week">Kalenderwoche {aktiveWoche}</span>
          <button className="woche-button" onClick={naechsteWoche}>&gt;</button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Speiseplan wird geladen...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="mensa-grid">
          {wochenplan.map((tag, index) => (
            <div 
              key={index} 
              className={`mensa-card ${isCurrentDay(tag.tag) ? 'current-day' : ''}`}
            >
              <div className="card-header">
                <h2>{tag.tag}</h2>
                <span className="datum">{tag.datum}</span>
              </div>
              <div className="card-content">
                <div className="menu-item">
                  <h3>Hauptgericht</h3>
                  <p>{tag.hauptgericht || 'Nicht angegeben'}</p>
                </div>
                <div className="menu-item vegetarisch">
                  <h3>Vegetarisch</h3>
                  <p>{tag.vegetarisch || 'Nicht angegeben'}</p>
                </div>
                <div className="menu-item">
                  <h3>Beilage</h3>
                  <p>{tag.beilage || 'Nicht angegeben'}</p>
                </div>
                <div className="menu-item">
                  <h3>Nachtisch</h3>
                  <p>{tag.nachtisch || 'Nicht angegeben'}</p>
                </div>
                <div className="preis">
                  <span>{tag.preis}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mensa-info">
        <p><strong>Öffnungszeiten:</strong> Montag bis Freitag, 11:30 - 14:00 Uhr</p>
        <p><strong>Hinweis:</strong> Alle Preise gelten für Schüler und Studierende mit Ausweis. Allergene und Zusatzstoffe sind in der Mensa ausgeschildert.</p>
      </div>
    </div>
  );
};

export default MensaWochenplan;