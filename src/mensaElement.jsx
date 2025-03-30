import React, { useState, useEffect } from 'react';
import './styles/MensaElement.css';

const MensaElement = () => {
  const [heutigesMenue, setHeutigesMenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // api url
  const API_URL = 'http://localhost:3001/api';

  // tag heute
  const getAktuellerWochentag = () => {
    const weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    return weekdays[new Date().getDay()];
  };

  // dummy daten
  const dummyData = {
    tag: getAktuellerWochentag(),
    datum: new Date().toLocaleDateString('de-DE'),
    hauptgericht: "Spaghetti Bolognese",
    vegetarisch: "Spaghetti Napoli",
    beilage: "Parmesan, Salat",
    nachtisch: "Vanillepudding",
    preis: "4,20 €"
  };

  // mensa holen
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
          console.error('fehler beim laden des mensa-menuees:', response.status);
          // dummydaten
          setHeutigesMenue(dummyData);
        }
      } catch (error) {
        console.error('fehler beim laden des mensa-menuees:', error);
        // dummydaten
        setHeutigesMenue(dummyData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHeutigesMenue();
  }, []);

  // wochenende?
  const isWochenende = () => {
    const today = new Date().getDay();
    return today === 0 || today === 6; // 0 = sonntag, 6 = samstag
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
            <a href="mensa.html" className="mensa-link">Menuplan fuer naechste Woche ansehen</a>
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
            <p>Fuer heute steht kein Menue zur Verfuegung.</p>
            <a href="mensa.html" className="mensa-link">Menuplan fuer die Woche ansehen</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MensaElement;