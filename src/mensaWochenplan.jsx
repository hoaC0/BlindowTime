import React, { useState, useEffect } from 'react';
import './styles/mensaWochenplan.css';

const MensaWochenplan = () => {
  const [wochenplan, setWochenplan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aktiveWoche, setAktiveWoche] = useState(getInitialWeek());
  
  // api url
  const API_URL = 'http://localhost:3001/api';
  
  // erstmal startwochen 
  function getInitialWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = so, 1 = mo, ...
    
    // am wochenende zeig naechste woche
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // aktuelle woche des datums
    // montag der aktuellen woche ermitteln
    const currentDate = new Date(today);
    const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); 
    currentDate.setDate(diff);
    
    // kalenderwoche aus dem berechneten montag bestimmen
    const currentWeek = getWeekNumber(currentDate);
    
    // wenn wochenende, dann naechste woche anzeigen, sonst aktuelle
    return isWeekend ? currentWeek + 1 : currentWeek;
  }

  // kalenderwochen nach iso 8601
  function getWeekNumber(d) {
    // kopie des datums, um es nicht zu aendern
    const date = new Date(d.getTime());
    
    // auf den naechsten donnerstag setzen
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    
    // erster donnerstag im jahr
    const firstThursday = new Date(date.getFullYear(), 0, 4);
    firstThursday.setDate(firstThursday.getDate() + 3 - (firstThursday.getDay() + 6) % 7);
    
    // woche berechnen
    const weekNumber = 1 + Math.floor((date - firstThursday) / (7 * 24 * 60 * 60 * 1000));
    
    return weekNumber;
  }
  
  // ist heute?
  const isCurrentDay = (tag) => {
    const heute = new Date().getDay(); // 0 = so, 1 = mo, ...
    return heute === getWochentagIndex(tag) + 1; // +1, weil getWochentagIndex bei 0 für mo beginnt
  };

  const getWochentagIndex = (tag) => {
    const wochentage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    return wochentage.indexOf(tag);
  };

  // testdaten
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
      vegetarisch: "Gemueseschnitzel mit Pommes",
      beilage: "Erbsen und Moehren",
      nachtisch: "Obstsalat",
      preis: "4,50 €"
    },
    {
      tag: "Mittwoch",
      datum: "20.03.2025",
      hauptgericht: "Haehnchencurry mit Reis",
      vegetarisch: "Gemuesecurry mit Reis",
      beilage: "Mango-Chutney",
      nachtisch: "Joghurt mit Fruechten",
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
      vegetarisch: "Grillkaese",
      beilage: "Kartoffelpüree, Gurkensalat",
      nachtisch: "Berliner",
      preis: "4,10 €"
    }
  ];

  // mensa vom server holen
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
          console.error('fehler beim laden des mensaplans:', response.status);
          // im fehlerfall dummy testdaten verwenden
          setWochenplan(dummyData);
        }
      } catch (error) {
        console.error('fehler beim laden des mensaplans:', error);
        setError('der mensaplan konnte nicht geladen werden. wir zeigen dir beispieldaten.');
        // bei netzwerkfehlern auch dummy testdaten verwenden
        setWochenplan(dummyData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMensaplan();
  }, [aktiveWoche]);

  // woche wechseln
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
        <p><strong>Oeffnungszeiten:</strong> Montag bis Freitag, 11:30 - 14:00 Uhr</p>
        <p><strong>Hinweis:</strong> Alle Preise gelten fuer Schueler und Studierende mit Ausweis. Allergene und Zusatzstoffe sind in der Mensa ausgeschildert.</p>
      </div>
    </div>
  );
};

export default MensaWochenplan;