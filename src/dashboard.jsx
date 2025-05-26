// src/dashboard.jsx
import React, { useState, useEffect } from 'react';
import './styles/dashboard.css';
import MensaElement from './mensaElement.jsx';

const Dashboard = () => {
    // State für Tasks aus den Cookies
    const [tasks, setTasks] = useState([]);
    
    // State für Kalender-Events
    const [calendarEvents, setCalendarEvents] = useState([]);
    
    // State für Stundenplan
    const [ausgewaehlteKlasse, setAusgewaehlteKlasse] = useState('');
    const [naechsteStunden, setNaechsteStunden] = useState([]);
    const [aktuelleStunde, setAktuelleStunde] = useState(null);
    const [ladenStundenplan, setLadenStundenplan] = useState(false);
    const [fehlerStundenplan, setFehlerStundenplan] = useState(null);
    
    // API-URL für Backend-Anfragen
    const API_URL = 'http://localhost:3001/api';
    
    // Aktuelles Datum und aktuelle Woche
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = Sonntag, 1 = Montag, ...
    
    // Wochentag-Namen
    const weekDays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    
    // Aktuelle Kalenderwoche generieren (7 Tage)
    const generateWeekDays = () => {
        const days = [];
        const today = new Date();
        
        // Startdatum berechnen (Montag dieser Woche)
        const monday = new Date(today);
        const dayOfWeek = today.getDay() || 7; // Wenn heute Sonntag (0) ist, wird 7 verwendet
        monday.setDate(today.getDate() - dayOfWeek + 1);
        
        // 7 Tage generieren
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            
            // Events für diesen Tag finden
            const dayEvents = calendarEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.toDateString() === day.toDateString();
            });
            
            days.push({
                name: weekDays[day.getDay()].substring(0, 2),
                number: day.getDate(),
                month: day.getMonth(),
                isToday: day.toDateString() === today.toDateString(),
                events: dayEvents.map(event => ({
                    title: event.title,
                    time: event.time,
                    color: event.color
                }))
            });
        }
        
        return days;
    };
    
    // Tasks aus den Cookies laden
    useEffect(() => {
        const savedTasks = getCookie('tasks');
        if (savedTasks) {
            try {
                const parsedTasks = JSON.parse(savedTasks);
                setTasks(parsedTasks);
            } catch (error) {
                console.error('Error parsing tasks from cookie:', error);
            }
        }

        // Gespeicherte Klassenauswahl laden
        const gespeicherteKlasse = getCookie('selectedClass');
        if (gespeicherteKlasse) {
            setAusgewaehlteKlasse(gespeicherteKlasse);
        }
        
        // Kalender-Events laden
        const savedEvents = getCookie('calendarEvents');
        if (savedEvents) {
            try {
                const parsedEvents = JSON.parse(savedEvents);
                setCalendarEvents(parsedEvents);
            } catch (error) {
                console.error('Error parsing events from cookie:', error);
            }
        }
    }, []);

    // Wenn die ausgewählte Klasse sich ändert, lade die Stunden
    useEffect(() => {
        if (ausgewaehlteKlasse) {
            stundenLaden();
        }
    }, [ausgewaehlteKlasse]);
    
    // Cookie-Hilfsfunktion
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
    
    // Tasks Status umschalten
    const toggleTaskComplete = (id) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
        setCookie('tasks', JSON.stringify(updatedTasks), 30);
    };
    
    // Cookie-Setzen-Hilfsfunktion
    const setCookie = (name, value, days) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
    };

    // Stundenplan vom Backend laden
    const stundenLaden = async () => {
        setLadenStundenplan(true);
        setFehlerStundenplan(null);
        
        try {
            const antwort = await fetch(`${API_URL}/stundenplan/${ausgewaehlteKlasse}`);
            
            if (!antwort.ok) {
                throw new Error(`Fehler beim Laden des Stundenplans: ${antwort.status}`);
            }
            
            const stundenplanDaten = await antwort.json();
            verarbeiteStundenplanDaten(stundenplanDaten);
        } catch (error) {
            console.error('Fehler beim Laden des Stundenplans:', error);
            setFehlerStundenplan(error.message);
            // Fallback: Mock-Daten für die Entwicklung
            ladeMockStunden();
        } finally {
            setLadenStundenplan(false);
        }
    };

    // Mock-Daten für die Entwicklung (falls Backend nicht verfügbar)
    const ladeMockStunden = () => {
        const mockStunden = [
            { nummer: 1, fach: 'Mathematik', zeit: '08:00 - 08:45', lehrer: 'Fr. Müller', raum: '101' },
            { nummer: 2, fach: 'Mathematik', zeit: '08:45 - 09:30', lehrer: 'Fr. Müller', raum: '101' },
            { nummer: 3, fach: 'Deutsch', zeit: '09:45 - 10:30', lehrer: 'Hr. Schmidt', raum: '203' },
            { nummer: 4, fach: 'Englisch', zeit: '10:30 - 11:15', lehrer: 'Fr. Weber', raum: '105' },
            { nummer: 5, fach: 'Physik', zeit: '11:30 - 12:15', lehrer: 'Hr. Fischer', raum: '204' }
        ];
        
        // Aktuelle Zeit für Bestimmung der aktuellen Stunde
        const jetzt = new Date();
        const aktuelleStundeIndex = bestimmeAktuelleStundeIndex(jetzt);
        
        if (aktuelleStundeIndex !== -1 && aktuelleStundeIndex < mockStunden.length) {
            setAktuelleStunde(mockStunden[aktuelleStundeIndex]);
        } else {
            setAktuelleStunde(null);
        }
        
        setNaechsteStunden(mockStunden);
    };

    // Verarbeitet die Stundenplan-Daten um aktuelle und nächste Stunden zu ermitteln
    const verarbeiteStundenplanDaten = (stundenplanDaten) => {
        // Aktuellen Tag bestimmen (0 = Sonntag, 1 = Montag, ...)
        const jetzt = new Date();
        const aktuellerTag = jetzt.getDay();
        
        // Am Wochenende gibt es keinen Unterricht
        if (aktuellerTag === 0 || aktuellerTag === 6) {
            setAktuelleStunde(null);
            setNaechsteStunden([]);
            return;
        }
        
        // Index für den aktuellen Tag im Stundenplan (0 = Montag)
        const tagIndex = aktuellerTag - 1;
        const tagPrefix = ['mo', 'di', 'mi', 'do', 'fr'][tagIndex];
        
        // Stunden für den aktuellen Tag extrahieren
        const heutigeStunden = [];
        
        // Stundenplanzeilen durchgehen (sortiert nach stunde)
        stundenplanDaten.forEach(zeile => {
            const fachId = zeile[`fach_${tagPrefix}`];
            
            // Nur wenn ein Fach für diesen Tag eingetragen ist
            if (fachId) {
                heutigeStunden.push({
                    nummer: zeile.stunde,
                    zeit: zeile.zeit,
                    fach: zeile[`fach_${tagPrefix}_name`],
                    fachFarbe: zeile[`fach_${tagPrefix}_farbe`],
                    lehrer: `${zeile[`lehrer_${tagPrefix}_vorname`] ? zeile[`lehrer_${tagPrefix}_vorname`].charAt(0) + '. ' : ''}${zeile[`lehrer_${tagPrefix}_nachname`] || ''}`,
                    raum: zeile[`raum_${tagPrefix}_nummer`] || zeile[`raum_${tagPrefix}_name`] || ''
                });
            }
        });
        
        // Sortieren nach Stundennummer
        heutigeStunden.sort((a, b) => a.nummer - b.nummer);
        
        // Aktuelle Stunde bestimmen
        const aktuelleStundeIndex = bestimmeAktuelleStundeIndex(jetzt);
        
        if (aktuelleStundeIndex !== -1 && aktuelleStundeIndex < heutigeStunden.length) {
            setAktuelleStunde(heutigeStunden[aktuelleStundeIndex]);
        } else {
            setAktuelleStunde(null);
        }
        
        setNaechsteStunden(heutigeStunden);
    };

    // Bestimmt den Index der aktuellen Stunde basierend auf der Uhrzeit
    const bestimmeAktuelleStundeIndex = (jetzt) => {
        const stundenZeiten = [
            { start: '08:00', ende: '08:45' },
            { start: '08:45', ende: '09:30' },
            { start: '09:45', ende: '10:30' },
            { start: '10:30', ende: '11:15' },
            { start: '11:30', ende: '12:15' },
            { start: '12:15', ende: '13:00' },
            { start: '14:00', ende: '14:45' },
            { start: '14:45', ende: '15:30' },
            { start: '15:45', ende: '16:30' },
            { start: '16:30', ende: '17:15' },
            { start: '17:30', ende: '18:15' },
            { start: '18:15', ende: '19:00' },
            { start: '19:15', ende: '20:00' }
        ];
        
        const stunden = jetzt.getHours();
        const minuten = jetzt.getMinutes();
        const aktuelleZeit = `${stunden.toString().padStart(2, '0')}:${minuten.toString().padStart(2, '0')}`;
        
        // Finde die aktuelle Stunde
        for (let i = 0; i < stundenZeiten.length; i++) {
            const { start, ende } = stundenZeiten[i];
            
            if (aktuelleZeit >= start && aktuelleZeit <= ende) {
                return i;
            }
            
            // Wenn die aktuelle Zeit zwischen zwei Unterrichtsstunden liegt,
            // gib die nächste Stunde zurück
            if (i < stundenZeiten.length - 1) {
                const naechsterStart = stundenZeiten[i + 1].start;
                if (aktuelleZeit > ende && aktuelleZeit < naechsterStart) {
                    return i + 1;
                }
            }
        }
        
        // Wenn die aktuelle Zeit vor der ersten Stunde liegt, gib die erste Stunde zurück
        if (aktuelleZeit < stundenZeiten[0].start) {
            return 0;
        }
        
        // Wenn die aktuelle Zeit nach der letzten Stunde liegt, gib -1 zurück
        return -1;
    };
    
    // Aktuelle Woche generieren
    const weekDaysData = generateWeekDays();
    
    // Aufgaben filtern - zeige nur die ersten 5 nicht erledigten Aufgaben
    const pendingTasks = tasks
        .filter(task => !task.completed)
        .slice(0, 5);
    
    return (
        <div className="dashboard-container">
            {/* Top three cards in the original grid */}
            <div className="dashboard-grid">
                {/* ToDo-Karte */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Aufgabenliste</h2>
                        <button 
                            className="view-all"
                            onClick={() => window.location.href = 'todo.html'}
                        >
                            Alle anzeigen
                        </button>
                    </div>
                    <div className="card-content">
                        {pendingTasks.length > 0 ? (
                            pendingTasks.map(task => (
                                <div 
                                    key={task.id} 
                                    className={`todo-item ${task.completed ? 'todo-completed' : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTaskComplete(task.id)}
                                        className="todo-checkbox"
                                    />
                                    <span className="todo-text">{task.text}</span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>Keine offenen Aufgaben</p>
                                <a href="todo.html" className="add-new">Aufgabe hinzufügen</a>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Kalender-Karte */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Kalender</h2>
                        <button 
                            className="view-all"
                            onClick={() => window.location.href = 'kalender.html'}
                        >
                            Vollständig
                        </button>
                    </div>
                    <div className="card-content">
                        <div className="calendar-week">
                            {weekDaysData.map((day, index) => (
                                <div 
                                    key={index} 
                                    className={`calendar-day ${day.isToday ? 'today' : ''}`}
                                >
                                    <div className="day-name">{day.name}</div>
                                    <div className="day-number">{day.number}</div>
                                    {day.events.map((event, eventIndex) => (
                                        <div 
                                            key={eventIndex} 
                                            className="calendar-event"
                                            style={{ 
                                                backgroundColor: event.color || '#0f3c63',
                                                fontSize: '11px',
                                                padding: '2px 4px',
                                                borderRadius: '3px',
                                                marginBottom: '2px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                            title={event.time ? `${event.title} um ${event.time}` : event.title}
                                        >
                                            {event.time ? `${event.time.substring(0, 5)} ` : ''}{event.title}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Stundenplan-Karte */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Stundenplan</h2>
                        <button 
                            className="view-all"
                            onClick={() => window.location.href = 'stundenplan.html'}
                        >
                            Alle Kurse
                        </button>
                    </div>
                    <div className="card-content">
                        {fehlerStundenplan && (
                            <div className="error-message">
                                {fehlerStundenplan}
                            </div>
                        )}
                        
                        {ladenStundenplan ? (
                            <div className="loading-message">
                                Stundenplan wird geladen...
                            </div>
                        ) : (
                            <>
                                {!fehlerStundenplan && ausgewaehlteKlasse && (
                                    <>
                                        {aktuelleStunde && (
                                            <div className="next-class">
                                                <div className="next-class-header">
                                                    <h3 className="next-class-title">Nächste Stunde</h3>
                                                    <span className="class-time">{aktuelleStunde.zeit}</span>
                                                </div>
                                                <div className="class-details">
                                                    <div className="class-detail">
                                                        <span className="detail-label">Fach:</span>
                                                        <span className="detail-value">{aktuelleStunde.fach}</span>
                                                    </div>
                                                    <div className="class-detail">
                                                        <span className="detail-label">Lehrer:</span>
                                                        <span className="detail-value">{aktuelleStunde.lehrer}</span>
                                                    </div>
                                                    <div className="class-detail">
                                                        <span className="detail-label">Raum:</span>
                                                        <span className="detail-value">{aktuelleStunde.raum}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="today-schedule">
                                            <h3>Heute: {weekDays[currentDate.getDay()]}</h3>
                                            {naechsteStunden.length > 0 ? (
                                                naechsteStunden.map((stunde, index) => (
                                                    <div key={index} className="schedule-class">
                                                        <div className="schedule-class-left">
                                                            <div className="class-number">{stunde.nummer}</div>
                                                            <div className="schedule-subject">{stunde.fach}</div>
                                                        </div>
                                                        <div className="schedule-time">{stunde.zeit}</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="empty-schedule">
                                                    <p>Keine Stunden für heute</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                                
                                {!fehlerStundenplan && !ausgewaehlteKlasse && (
                                    <div className="empty-state">
                                        <p>Bitte wählen Sie zuerst eine Klasse aus</p>
                                        <a href="stundenplan.html" className="add-new">Klasse auswählen</a>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Mensa-Karte */}
            <MensaElement />
        </div>
    );
};

export default Dashboard;