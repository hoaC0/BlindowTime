import React, { useState, useEffect } from 'react';
import './styles/MensaElement.css';

const MensaElement = () => {
  const [heutigesMenue, setHeutigesMenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API-URL für Mensa-Daten
  const API_URL = 'http://localhost:3001/api';

  // Aktuellen Wochentag ermitteln
  const getAktuellerWochentag = () => {
    const weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    return weekdays[new Date().getDay()];
  };

  // Dummy-Daten für die Entwicklung
  const dummyData = {
    tag: getAktuellerWochentag(),
    datum: new Date().toLocaleDateString('de-DE'),
    hauptgericht: "Spaghetti Bolognese",
    vegetarisch: "Spaghetti Napoli",
    beilage: "Parmesan, Salat",
    nachtisch: "Vanillepudding",
    preis: "4,20 €"
  };

  // Heutiges Mensa-Angebot laden
  useEffect(() => {
    const fetchHeutigesMenue = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/mensa/heute`);
        
        if (response.ok) {
          const data = await response.json();
          setHeutigesMenue(data);
          setError(null);
        } else {
          console.error('Fehler beim Laden des Mensa-Menüs:', response.status);
          // Im Fehlerfall Dummy-Daten verwenden
          setHeutigesMenue(dummyData);
        }
      } catch (error) {
        console.error('Fehler beim Laden des Mensa-Menüs:', error);
        // Bei Netzwerkfehlern auch Dummy-Daten verwenden
        setHeutigesMenue(dummyData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHeutigesMenue();
  }, []);

  // Wenn heute kein Mensa-Angebot existiert oder Wochenende ist
  const isWochenende = () => {
    const today = new Date().getDay();
    return today === 0 || today === 6; // 0 = Sonntag, 6 = Samstag
  };

  return (
    <div className="dashboard-mensa-card">
      <div className="mensa-card-header">
        <h2>Mensa Heute</h2>
        <button 
          className="show-all-button"
          onClick={() => window.location.href = 'mensa.html'}
        >
          Wochenplan
        </button>
      </div>
      
      <div className="mensa-card-content">
        {loading ? (
          <div className="mensa-loading">Laden...</div>
        ) : isWochenende() ? (
          <div className="mensa-weekend">
            <p>Die Mensa hat am Wochenende geschlossen.</p>
            <a href="mensa.html" className="mensa-link">Menüplan für nächste Woche ansehen</a>
          </div>
        ) : heutigesMenue ? (
          <div className="todays-menu">
            <div className="menu-header">
              <div className="menu-day">{heutigesMenue.tag}</div>
              <div className="menu-date">{heutigesMenue.datum}</div>
            </div>
            
            <div className="menu-options">
              <div className="menu-option">
                <span className="option-label">Hauptgericht:</span>
                <span className="option-value">{heutigesMenue.hauptgericht}</span>
              </div>
              
              <div className="menu-option vegetarian">
                <span className="option-label">Vegetarisch:</span>
                <span className="option-value">{heutigesMenue.vegetarisch}</span>
              </div>
              
              <div className="menu-option">
                <span className="option-label">Beilage:</span>
                <span className="option-value">{heutigesMenue.beilage}</span>
              </div>
              
              <div className="menu-option">
                <span className="option-label">Nachtisch:</span>
                <span className="option-value">{heutigesMenue.nachtisch}</span>
              </div>
            </div>
            
            <div className="menu-footer">
              <div className="menu-price">{heutigesMenue.preis}</div>
              <div className="menu-time">11:30 - 14:00 Uhr</div>
            </div>
          </div>
        ) : (
          <div className="mensa-no-menu">
            <p>Für heute steht kein Menü zur Verfügung.</p>
            <a href="mensa.html" className="mensa-link">Menüplan für die Woche ansehen</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MensaElement;