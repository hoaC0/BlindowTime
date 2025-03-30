import React, { useState, useEffect } from 'react';
import './styles/dashboard.css';
import MensaElement from './mensaElement.jsx';

const Dashboard = () => {
    // state fuer tasks aus den cookies
    const [tasks, setTasks] = useState([]);
    
    // state fuer stundenplan
    const [ausgewaehlteKlasse, setAusgewaehlteKlasse] = useState('');
    const [naechsteStunden, setNaechsteStunden] = useState([]);
    const [aktuelleStunde, setAktuelleStunde] = useState(null);
    const [ladenStundenplan, setLadenStundenplan] = useState(false);
    const [fehlerStundenplan, setFehlerStundenplan] = useState(null);
    
    // api-url fuer backend-anfragen
    const API_URL = 'http://localhost:3001/api';
    
    // aktuelles datum und aktuelle woche
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = sonntag, 1 = montag, ...
    
    // wochentag-namen
    const weekDays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    
    // aktualle kalenderwoche generieren (7 tage)
    const generateWeekDays = () => {
        const days = [];
        const today = new Date();
        
        // startdatum berechnen (montag dieser woche)
        const monday = new Date(today);
        const dayOfWeek = today.getDay() || 7; // wenn heute sonntag (0) ist, wird 7 verwendet
        monday.setDate(today.getDate() - dayOfWeek + 1);
        
        // 7 tage generieren
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            days.push({
                name: weekDays[day.getDay()].substring(0, 2),
                number: day.getDate(),
                month: day.getMonth(),
                isToday: day.toDateString() === today.toDateString(),
                events: []
            });
        }
        
        // beispiel-events hinzufuegen
        days[1].events.push("Mathe Klausur");
        days[3].events.push("Gruppenprojekt");
        days[4].events.push("Bio Referat");
        
        return days;
    };
    
    // tasks laden beim erststart
    useEffect(() => {
        const savedTasks = getCookie('tasks');
        if (savedTasks) {
            try {
                const parsedTasks = JSON.parse(savedTasks);
                setTasks(parsedTasks);
            } catch (error) {
                console.error('error parsing tasks from cookie:', error);
            }
        }

        // klasse aus cookie holen
        const gespeicherteKlasse = getCookie('selectedClass');
        if (gespeicherteKlasse) {
            setAusgewaehlteKlasse(gespeicherteKlasse);
        }
    }, []);

    // wenn klasse geaendert, stundenplan neu laden
    useEffect(() => {
        if (ausgewaehlteKlasse) {
            stundenLaden();
        }
    }, [ausgewaehlteKlasse]);
    
    // cookies holen helper
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
    
    // task erledigung umschalten
    const toggleTaskComplete = (id) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
        setCookie('tasks', JSON.stringify(updatedTasks), 30);
    };
    
    // cookie setzen
    const setCookie = (name, value, days) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
    };

    // stundenplan vom server holen
    const stundenLaden = async () => {
        setLadenStundenplan(true);
        setFehlerStundenplan(null);
        
        try {
            const antwort = await fetch(`${API_URL}/stundenplan/${ausgewaehlteKlasse}`);
            
            if (!antwort.ok) {
                throw new Error(`fehler beim laden des stundenplans: ${antwort.status}`);
            }
            
            const stundenplanDaten = await antwort.json();
            verarbeiteStundenplanDaten(stundenplanDaten);
        } catch (error) {
            console.error('fehler beim laden des stundenplans:', error);
            setFehlerStundenplan(error.message);
            // dummy daten nutzen wenn server weg
            ladeMockStunden();
        } finally {
            setLadenStundenplan(false);
        }
    };

    const ladeMockStunden = () => {
        const mockStunden = [
            { nummer: 1, fach: 'Mathematik', zeit: '08:00 - 08:45', lehrer: 'Fr. Mueller', raum: '101' },
            { nummer: 2, fach: 'Mathematik', zeit: '08:45 - 09:30', lehrer: 'Fr. Mueller', raum: '101' },
            { nummer: 3, fach: 'Deutsch', zeit: '09:45 - 10:30', lehrer: 'Hr. Schmidt', raum: '203' },
            { nummer: 4, fach: 'Englisch', zeit: '10:30 - 11:15', lehrer: 'Fr. Weber', raum: '105' },
            { nummer: 5, fach: 'Physik', zeit: '11:30 - 12:15', lehrer: 'Hr. Fischer', raum: '204' }
        ];
        
        // aktuelle zeit fuer bestimmung der aktuellen stunde
        const jetzt = new Date();
        const aktuelleStundeIndex = bestimmeAktuelleStundeIndex(jetzt);
        
        if (aktuelleStundeIndex !== -1 && aktuelleStundeIndex < mockStunden.length) {
            setAktuelleStunde(mockStunden[aktuelleStundeIndex]);
        } else {
            setAktuelleStunde(null);
        }
        
        setNaechsteStunden(mockStunden);
    };

    // verarbeitet stundenplan daten
    const verarbeiteStundenplanDaten = (stundenplanDaten) => {
        // check ob heute wochenende
        const jetzt = new Date();
        const aktuellerTag = jetzt.getDay();
        
        // wochenende - kein unterricht
        if (aktuellerTag === 0 || aktuellerTag === 6) {
            setAktuelleStunde(null);
            setNaechsteStunden([]);
            return;
        }
        
        // index fuer den aktuellen tag bestimmen (0 = montag)
        const tagIndex = aktuellerTag - 1;
        const tagPrefix = ['mo', 'di', 'mi', 'do', 'fr'][tagIndex];
        
        // stunden fuer den aktuellen tag extrahieren
        const heutigeStunden = [];
        
        // stundenplanzeilen durchgehen
        stundenplanDaten.forEach(zeile => {
            const fachId = zeile[`fach_${tagPrefix}`];
            
            // nur wenn ein fach fuer diesen tag eingetragen ist
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
        
        // sortieren nach stundennummer
        heutigeStunden.sort((a, b) => a.nummer - b.nummer);
        
        // aktuelle stunde bestimmen
        const aktuelleStundeIndex = bestimmeAktuelleStundeIndex(jetzt);
        
        if (aktuelleStundeIndex !== -1 && aktuelleStundeIndex < heutigeStunden.length) {
            setAktuelleStunde(heutigeStunden[aktuelleStundeIndex]);
        } else {
            setAktuelleStunde(null);
        }
        
        setNaechsteStunden(heutigeStunden);
    };

    // welche stunde is aktuell?
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
        
        // finde die aktuelle stunde
        for (let i = 0; i < stundenZeiten.length; i++) {
            const { start, ende } = stundenZeiten[i];
            
            if (aktuelleZeit >= start && aktuelleZeit <= ende) {
                return i;
            }
            
            // zwischen stunden
            if (i < stundenZeiten.length - 1) {
                const naechsterStart = stundenZeiten[i + 1].start;
                if (aktuelleZeit > ende && aktuelleZeit < naechsterStart) {
                    return i + 1;
                }
            }
        }
        
        // vor den stunden
        if (aktuelleZeit < stundenZeiten[0].start) {
            return 0;
        }
        
        // nach allen stunden
        return -1;
    };
    
    // kalenderwoche
    const weekDaysData = generateWeekDays();
    
    // nur 5 offene zeigen statt alle
    const pendingTasks = tasks
        .filter(task => !task.completed)
        .slice(0, 5);
    
    return (
        <div className="dashboard-container">
            {/* karten grid */}
            <div className="dashboard-grid">
                {/* todo karte */}
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
                                <a href="todo.html" className="add-new">Aufgabe hinzufuegen</a>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* kalender karte */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Kalender</h2>
                        <button 
                            className="view-all"
                            onClick={() => window.location.href = 'kalender.html'}
                        >
                            Vollstaendig
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
                                        <div key={eventIndex} className="calendar-event">
                                            {event}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* stundenplan karte */}
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
                                                    <h3 className="next-class-title">Naechste Stunde</h3>
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
                                                    <p>Keine Stunden fuer heute</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                                
                                {!fehlerStundenplan && !ausgewaehlteKlasse && (
                                    <div className="empty-state">
                                        <p>Bitte waehle zuerst eine Klasse aus</p>
                                        <a href="stundenplan.html" className="add-new">Klasse auswaehlen</a>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {/* mensa element */}
            <MensaElement />
        </div>
    );
};

export default Dashboard;