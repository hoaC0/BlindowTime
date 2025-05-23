import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from "./Header.jsx";
import './styles/MensaAdmin.css';

const MensaAdmin = () => {
  // api-url
  const API_URL = 'http://localhost:3001/api';

  const [activeWeek, setActiveWeek] = useState(getCurrentWeek());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // menuedaten
  const [menuData, setMenuData] = useState([
    { tag: "Montag", datum: "", hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
    { tag: "Dienstag", datum: "", hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
    { tag: "Mittwoch", datum: "", hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
    { tag: "Donnerstag", datum: "", hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
    { tag: "Freitag", datum: "", hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" }
  ]);

  // tag bearbeiten
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

  // woche berechnen
  function getCurrentWeek() {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    return Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  }

  // berechnet datum
  const getDateForWeekday = (weekday, weekNumber) => {
    const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    const weekdayIndex = weekdays.indexOf(weekday);
    
    if (weekdayIndex === -1) return "";
    
    // aktuelles datum
    const now = new Date();
    const year = now.getFullYear();
    
    // montag dieser woche bestimmen
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = sonntag, 1 = montag, ...
    const diff = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1); 
    const mondayOfCurrentWeek = new Date(currentDate.setDate(diff));
    
    // aktuelle KW
    const currentWeek = getCurrentWeek();
    
    // wochen differenz berechnen
    const weekDiff = weekNumber - currentWeek;
    
    // montag der gewuenschten woche
    const targetMonday = new Date(mondayOfCurrentWeek);
    targetMonday.setDate(mondayOfCurrentWeek.getDate() + (weekDiff * 7));
    
    // wochentag in zielwoche
    const targetDate = new Date(targetMonday);
    targetDate.setDate(targetMonday.getDate() + weekdayIndex);
    
    // als DD.MM.YYYY
    return `${targetDate.getDate().toString().padStart(2, '0')}.${(targetDate.getMonth() + 1).toString().padStart(2, '0')}.${targetDate.getFullYear()}`;
  };

  // menue fuer woche laden
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
        console.error('fehler beim laden des mensaplans:', response.status);
        // default daten
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
      console.error('fehler beim laden des mensaplans:', error);
      setError('der mensaplan konnte nicht geladen werden. wir zeigen dir standarddaten.');
      
      // standard mit korrekten daten
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

  // woche aendern
  const previousWeek = () => {
    setActiveWeek(activeWeek - 1);
  };

  const nextWeek = () => {
    setActiveWeek(activeWeek + 1);
  };

  // tag bearbeiten
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

  // form aenderung
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setDayFormData({
      ...dayFormData,
      [name]: value
    });
  };

  // form senden
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // aktuelle tagesdaten
      const updatedDayData = {
        ...dayFormData,
        woche: activeWeek
      };
      
      // api-aufruf zum speichern
      const response = await fetch(`${API_URL}/mensa/speiseplan/${activeWeek}/${dayFormData.tag}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDayData),
      });
      
      if (response.ok) {
        // erfolg
        setSuccessMessage(`speiseplan fuer ${dayFormData.tag} wurde erfolgreich aktualisiert.`);
        
        // lokale daten aktualisieren
        const updatedMenuData = menuData.map(day => 
          day.tag === dayFormData.tag ? { ...day, ...dayFormData } : day
        );
        setMenuData(updatedMenuData);
        
        // bearbeitungsmodus ende
        setEditDay(null);
        
        // erfolgs nachricht ausblenden
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        throw new Error('fehler beim speichern des speiseplans');
      }
    } catch (error) {
      console.error('fehler beim speichern des speiseplans:', error);
      setError(`fehler beim speichern: ${error.message}`);
      
      // erfolg simulieren
      setSuccessMessage(`speiseplan fuer ${dayFormData.tag} wurde erfolgreich aktualisiert (simuliert).`);
      
      // lokale daten aktualisieren
      const updatedMenuData = menuData.map(day => 
        day.tag === dayFormData.tag ? { ...day, ...dayFormData } : day
      );
      setMenuData(updatedMenuData);
      
      // bearbeitungsmodus ende
      setEditDay(null);
      
      // erfolgs nachricht ausblenden
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // wochenplan veroeffentlichen
  const publishWeeklyMenu = async () => {
    if (window.confirm('moechten sie den gesamten wochenplan veroeffentlichen?')) {
      setLoading(true);
      
      try {
        // api-aufruf
        const response = await fetch(`${API_URL}/mensa/wochenplan/${activeWeek}/publish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(menuData),
        });
        
        if (response.ok) {
          setSuccessMessage('der wochenplan wurde erfolgreich veroeffentlicht.');
          
          // meldung ausblenden
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        } else {
          throw new Error('fehler beim veroeffentlichen des wochenplans');
        }
      } catch (error) {
        console.error('fehler beim veroeffentlichen des wochenplans:', error);
        setError(`fehler beim veroeffentlichen: ${error.message}`);
        
        // erfolg simulieren
        setSuccessMessage('der wochenplan wurde erfolgreich veroeffentlicht (simuliert).');
        
        // meldung ausblenden
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
          Wochenplan veroeffentlichen
        </button>
      </div>

      {loading && <div className="loading-indicator">daten werden geladen...</div>}
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

// komponente rendern
const renderMensaAdmin = () => {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Header/>
      <MensaAdmin/>
    </React.StrictMode>
  );
};

// wenn dieses skript direkt ausgefuehrt wird
if (document.getElementById('root')) {
  renderMensaAdmin();
}

export default MensaAdmin;
