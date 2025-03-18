import React, { useState, useEffect } from 'react';
import './mensaWochenplan.css';

const MensaWochenplan = () => {
  const [wochenplan, setWochenplan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aktiveWoche, setAktiveWoche] = useState(getCurrentWeek());
  
  // Aktuelle Kalenderwoche berechnen
  function getCurrentWeek() {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    return Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  }
  
  // Wochentage definieren
  const wochentage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
  
  // API-URL für Mensa-Daten
  const API_URL = 'http://localhost:3001/api';
  
  // Prüfen, ob es der aktuelle Tag ist
  const isCurrentDay = (tag) => {
    const heute = new Date().getDay(); // 0 = Sonntag, 1 = Montag, ...
    return heute === wochentage.indexOf(tag) + 1; // +1, weil wochentage bei 0 für Montag beginnt
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
        setError('Der Mensaplan konnte nicht geladen werden. Wir zeigen dir stattdessen Beispieldaten.');
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
                  <p>{tag.hauptgericht}</p>
                </div>
                <div className="menu-item vegetarisch">
                  <h3>Vegetarisch</h3>
                  <p>{tag.vegetarisch}</p>
                </div>
                <div className="menu-item">
                  <h3>Beilage</h3>
                  <p>{tag.beilage}</p>
                </div>
                <div className="menu-item">
                  <h3>Nachtisch</h3>
                  <p>{tag.nachtisch}</p>
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