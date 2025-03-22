// src/MensaAdmin.jsx - Verwaltungskomponente für den Mensaspeiseplan
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from "./Header.jsx";
import './styles/MensaAdmin.css';

const MensaAdmin = () => {
  // API-URL für Backend-Anfragen
  const API_URL = 'http://localhost:3001/api';

  // State für die aktive Woche
  const [activeWeek, setActiveWeek] = useState(getCurrentWeek());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // State für die Menüdaten
  const [menuData, setMenuData] = useState([
    { tag: "Montag", datum: "", hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
    { tag: "Dienstag", datum: "", hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
    { tag: "Mittwoch", datum: "", hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
    { tag: "Donnerstag", datum: "", hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
    { tag: "Freitag", datum: "", hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" }
  ]);

  // State für den bearbeiteten Tag
  const [editDay, setEditDay] = useState(null);
  const [dayFormData, setDayFormData] = useState({
    tag: "",
    datum: "",
    hauptgericht: "",
    vegetarisch: "",
    beilage: "",
    nachtisch: "",
    preis: "4,20 €"
  });

  // Funktion zum Berechnen der aktuellen Kalenderwoche
  function getCurrentWeek() {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    return Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  }

  // Berechnet das Datum für einen bestimmten Tag der ausgewählten Woche
  const getDateForWeekday = (weekday, weekNumber) => {
    const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    const weekdayIndex = weekdays.indexOf(weekday);
    
    if (weekdayIndex === -1) return "";
    
    // Aktuelles Datum ermitteln
    const now = new Date();
    const year = now.getFullYear();
    
    // Montag der aktuellen Woche ermitteln
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = Sonntag, 1 = Montag, ...
    const diff = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1); 
    const mondayOfCurrentWeek = new Date(currentDate.setDate(diff));
    
    // Aktuelle Kalenderwoche ermitteln
    const currentWeek = getCurrentWeek();
    
    // Berechnen wie viele Wochen vor oder nach der aktuellen Woche
    const weekDiff = weekNumber - currentWeek;
    
    // Montag der gewünschten Woche ermitteln
    const targetMonday = new Date(mondayOfCurrentWeek);
    targetMonday.setDate(mondayOfCurrentWeek.getDate() + (weekDiff * 7));
    
    // Gewünschten Wochentag in der Zielwoche ermitteln
    const targetDate = new Date(targetMonday);
    targetDate.setDate(targetMonday.getDate() + weekdayIndex);
    
    // Formatieren zu DD.MM.YYYY
    return `${targetDate.getDate().toString().padStart(2, '0')}.${(targetDate.getMonth() + 1).toString().padStart(2, '0')}.${targetDate.getFullYear()}`;
  };

  // Menü-Daten für eine bestimmte Woche laden
  useEffect(() => {
    fetchMenuForWeek(activeWeek);
  }, [activeWeek]);

  const fetchMenuForWeek = async (weekNumber) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/mensa/wochenplan/${weekNumber}`);
      
      if (response.ok) {
        const data = await response.json();
        setMenuData(data);
        setError(null);
      } else {
        console.error('Fehler beim Laden des Mensaplans:', response.status);
        // Generiere Standarddaten mit korrektem Datum für diese Woche
        const defaultData = [
          { tag: "Montag", datum: getDateForWeekday("Montag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Dienstag", datum: getDateForWeekday("Dienstag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Mittwoch", datum: getDateForWeekday("Mittwoch", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Donnerstag", datum: getDateForWeekday("Donnerstag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Freitag", datum: getDateForWeekday("Freitag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" }
        ];
        setMenuData(defaultData);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Mensaplans:', error);
      setError('Der Mensaplan konnte nicht geladen werden. Wir zeigen dir Standarddaten.');
      
      // Generiere Standarddaten mit korrektem Datum für diese Woche
      const defaultData = [
        { tag: "Montag", datum: getDateForWeekday("Montag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
        { tag: "Dienstag", datum: getDateForWeekday("Dienstag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
        { tag: "Mittwoch", datum: getDateForWeekday("Mittwoch", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
        { tag: "Donnerstag", datum: getDateForWeekday("Donnerstag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
        { tag: "Freitag", datum: getDateForWeekday("Freitag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" }
      ];
      setMenuData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  // Woche wechseln
  const previousWeek = () => {
    setActiveWeek(activeWeek - 1);
  };

  const nextWeek = () => {
    setActiveWeek(activeWeek + 1);
  };

  // Tagesmenü bearbeiten
  const handleEditDay = (dayData) => {
    setEditDay(dayData.tag);
    setDayFormData({
      tag: dayData.tag,
      datum: dayData.datum,
      hauptgericht: dayData.hauptgericht,
      vegetarisch: dayData.vegetarisch,
      beilage: dayData.beilage,
      nachtisch: dayData.nachtisch,
      preis: dayData.preis
    });
  };

  // Formular-Änderungen verarbeiten
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setDayFormData({
      ...dayFormData,
      [name]: value
    });
  };

  // Formular absenden
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Die aktualisierten Daten für diesen Tag
      const updatedDayData = {
        ...dayFormData,
        woche: activeWeek
      };
      
      // API-Aufruf zum Speichern des Tagesmenüs
      const response = await fetch(`${API_URL}/mensa/speiseplan/${activeWeek}/${dayFormData.tag}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDayData),
      });
      
      if (response.ok) {
        // Erfolgreiche Aktualisierung
        setSuccessMessage(`Speiseplan für ${dayFormData.tag} wurde erfolgreich aktualisiert.`);
        
        // Lokale Menüdaten aktualisieren
        const updatedMenuData = menuData.map(day => 
          day.tag === dayFormData.tag ? { ...day, ...dayFormData } : day
        );
        setMenuData(updatedMenuData);
        
        // Bearbeitungsmodus beenden
        setEditDay(null);
        
        // Erfolgsmeldung nach 3 Sekunden ausblenden
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        throw new Error('Fehler beim Speichern des Speiseplans');
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Speiseplans:', error);
      setError(`Fehler beim Speichern: ${error.message}`);
      
      // Simuliere Erfolg für die Entwicklung
      setSuccessMessage(`Speiseplan für ${dayFormData.tag} wurde erfolgreich aktualisiert (simuliert).`);
      
      // Lokale Menüdaten aktualisieren
      const updatedMenuData = menuData.map(day => 
        day.tag === dayFormData.tag ? { ...day, ...dayFormData } : day
      );
      setMenuData(updatedMenuData);
      
      // Bearbeitungsmodus beenden
      setEditDay(null);
      
      // Erfolgsmeldung nach 3 Sekunden ausblenden
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Gesamten Wochenplan veröffentlichen
  const publishWeeklyMenu = async () => {
    if (window.confirm('Möchten Sie den gesamten Wochenplan veröffentlichen?')) {
      setLoading(true);
      
      try {
        // API-Aufruf zum Veröffentlichen des Wochenplans
        const response = await fetch(`${API_URL}/mensa/wochenplan/${activeWeek}/publish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(menuData),
        });
        
        if (response.ok) {
          setSuccessMessage('Der Wochenplan wurde erfolgreich veröffentlicht.');
          
          // Erfolgsmeldung nach 3 Sekunden ausblenden
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        } else {
          throw new Error('Fehler beim Veröffentlichen des Wochenplans');
        }
      } catch (error) {
        console.error('Fehler beim Veröffentlichen des Wochenplans:', error);
        setError(`Fehler beim Veröffentlichen: ${error.message}`);
        
        // Simuliere Erfolg für die Entwicklung
        setSuccessMessage('Der Wochenplan wurde erfolgreich veröffentlicht (simuliert).');
        
        // Erfolgsmeldung nach 3 Sekunden ausblenden
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mensa-admin-container">
      <div className="mensa-admin-header">
        <h1>Mensaplan-Verwaltung</h1>
        <div className="week-selector">
          <button className="week-button" onClick={previousWeek}>&lt;</button>
          <span className="active-week">Kalenderwoche {activeWeek}</span>
          <button className="week-button" onClick={nextWeek}>&gt;</button>
        </div>
        <button 
          className="publish-button" 
          onClick={publishWeeklyMenu}
          disabled={loading}
        >
          Wochenplan veröffentlichen
        </button>
      </div>

      {loading && <div className="loading-indicator">Daten werden geladen...</div>}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="mensa-admin-content">
        <div className="menu-grid">
          {menuData.map((day, index) => (
            <div 
              key={index} 
              className={`menu-card ${editDay === day.tag ? 'editing' : ''}`}
            >
              <div className="menu-card-header">
                <h2>{day.tag}</h2>
                <span className="menu-date">{day.datum}</span>
                {editDay !== day.tag ? (
                  <button 
                    className="edit-button"
                    onClick={() => handleEditDay(day)}
                  >
                    Bearbeiten
                  </button>
                ) : null}
              </div>
              
              {editDay === day.tag ? (
                <form onSubmit={handleSubmit} className="menu-form">
                  <div className="form-group">
                    <label htmlFor="hauptgericht">Hauptgericht</label>
                    <input
                      type="text"
                      id="hauptgericht"
                      name="hauptgericht"
                      value={dayFormData.hauptgericht}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="vegetarisch">Vegetarisch</label>
                    <input
                      type="text"
                      id="vegetarisch"
                      name="vegetarisch"
                      value={dayFormData.vegetarisch}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="beilage">Beilage</label>
                    <input
                      type="text"
                      id="beilage"
                      name="beilage"
                      value={dayFormData.beilage}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="nachtisch">Nachtisch</label>
                    <input
                      type="text"
                      id="nachtisch"
                      name="nachtisch"
                      value={dayFormData.nachtisch}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="preis">Preis</label>
                    <input
                      type="text"
                      id="preis"
                      name="preis"
                      value={dayFormData.preis}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="form-buttons">
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => setEditDay(null)}
                    >
                      Abbrechen
                    </button>
                    <button 
                      type="submit" 
                      className="save-button"
                      disabled={loading}
                    >
                      Speichern
                    </button>
                  </div>
                </form>
              ) : (
                <div className="menu-details">
                  <div className="menu-item">
                    <h3>Hauptgericht</h3>
                    <p>{day.hauptgericht || 'Nicht angegeben'}</p>
                  </div>
                  
                  <div className="menu-item vegetarisch">
                    <h3>Vegetarisch</h3>
                    <p>{day.vegetarisch || 'Nicht angegeben'}</p>
                  </div>
                  
                  <div className="menu-item">
                    <h3>Beilage</h3>
                    <p>{day.beilage || 'Nicht angegeben'}</p>
                  </div>
                  
                  <div className="menu-item">
                    <h3>Nachtisch</h3>
                    <p>{day.nachtisch || 'Nicht angegeben'}</p>
                  </div>
                  
                  <div className="menu-price">
                    <span>{day.preis}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Komponente rendern
const renderMensaAdmin = () => {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Header/>
      <MensaAdmin/>
    </React.StrictMode>
  );
};

// Wenn dieses Skript direkt ausgeführt wird, rendere die Komponente
if (document.getElementById('root')) {
  renderMensaAdmin();
}

export default MensaAdmin;