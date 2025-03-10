import React, { useState, useEffect } from 'react';
import './dashboard.css';

const Dashboard = () => {
    // State für Tasks aus den Cookies
    const [tasks, setTasks] = useState([]);
    
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
            days.push({
                name: weekDays[day.getDay()].substring(0, 2),
                number: day.getDate(),
                month: day.getMonth(),
                isToday: day.toDateString() === today.toDateString(),
                events: []
            });
        }
        
        // Beispiel-Events hinzufügen
        days[1].events.push("Mathe Klausur");
        days[3].events.push("Gruppenprojekt");
        days[4].events.push("Bio Referat");
        
        return days;
    };
    
    // Stundenplan-Daten
    const scheduleData = {
        nextClass: {
            subject: "Englisch",
            time: "10:30 - 11:15",
            teacher: "Fr. Weber",
            room: "105"
        },
        todayClasses: [
            { number: 1, subject: "Mathematik", time: "08:00 - 08:45" },
            { number: 2, subject: "Mathematik", time: "08:45 - 09:30" },
            { number: 3, subject: "Deutsch", time: "09:45 - 10:30" },
            { number: 4, subject: "Englisch", time: "10:30 - 11:15" },
            { number: 5, subject: "Physik", time: "11:30 - 12:15" }
        ]
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
    }, []);
    
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
    
    // Aktuelle Woche generieren
    const weekDaysData = generateWeekDays();
    
    // Aufgaben filtern - zeige nur die ersten 5 nicht erledigten Aufgaben
    const pendingTasks = tasks
        .filter(task => !task.completed)
        .slice(0, 5);
    
    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">
                {/* ToDo-Karte */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>ToDo</h2>
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
                                        <div key={eventIndex} className="calendar-event">
                                            {event}
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
                        <div className="next-class">
                            <div className="next-class-header">
                                <h3 className="next-class-title">Nächste Stunde</h3>
                                <span className="class-time">{scheduleData.nextClass.time}</span>
                            </div>
                            <div className="class-details">
                                <div className="class-detail">
                                    <span className="detail-label">Fach:</span>
                                    <span className="detail-value">{scheduleData.nextClass.subject}</span>
                                </div>
                                <div className="class-detail">
                                    <span className="detail-label">Lehrer:</span>
                                    <span className="detail-value">{scheduleData.nextClass.teacher}</span>
                                </div>
                                <div className="class-detail">
                                    <span className="detail-label">Raum:</span>
                                    <span className="detail-value">{scheduleData.nextClass.room}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="today-schedule">
                            <h3>Heute: {weekDays[currentDay]}</h3>
                            {scheduleData.todayClasses.map((classItem, index) => (
                                <div key={index} className="schedule-class">
                                    <div className="schedule-class-left">
                                        <div className="class-number">{classItem.number}</div>
                                        <div className="schedule-subject">{classItem.subject}</div>
                                    </div>
                                    <div className="schedule-time">{classItem.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;