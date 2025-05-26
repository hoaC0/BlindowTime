import React, { useState, useEffect } from 'react';
import "./styles/kalenderElement.css";

const Kalender = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventForm, setEventForm] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        color: '#0f3c63'
    });
    const [editingEvent, setEditingEvent] = useState(null);
    
    const today = new Date();
    
    // Farb-Optionen für Termine
    const colorOptions = [
        { value: '#0f3c63', label: 'Dunkelblau (Standard)' },
        { value: '#428FF4', label: 'Blau' },
        { value: '#EA4335', label: 'Rot' },
        { value: '#FBBC05', label: 'Gelb' },
        { value: '#34A853', label: 'Grün' },
        { value: '#7B1FA2', label: 'Lila' },
        { value: '#FF9800', label: 'Orange' },
        { value: '#607D8B', label: 'Grau' }
    ];
    
    // Termine aus Cookies laden
    useEffect(() => {
        const savedEvents = getCookie('calendarEvents');
        if (savedEvents) {
            try {
                const parsedEvents = JSON.parse(savedEvents);
                setEvents(parsedEvents);
            } catch (error) {
                console.error('Error parsing events from cookie:', error);
                setEvents([]);
            }
        }
    }, []);
    
    // Termine in Cookies speichern
    useEffect(() => {
        if (events.length > 0) {
            setCookie('calendarEvents', JSON.stringify(events), 30);
        } else {
            // Wenn keine Events, Cookie löschen
            document.cookie = "calendarEvents=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    }, [events]);
    
    // Cookie-Hilfsfunktionen
    const setCookie = (name, value, days) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
    };
    
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
    
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };
    
    const getFirstDayOfMonth = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1; // Montag = 0, Sonntag = 6
    };
    
    // Navigation
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };
    
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };
    
    // Formatierung
    const formatMonth = (date) => {
        return date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
    };
    
    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const isPastDay = (day) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };
    
    const isToday = (day) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return checkDate.toDateString() === today.toDateString();
    };
    
    // Events für einen bestimmten Tag abrufen
    const getEventsForDay = (day) => {
        const dateStr = formatDateForInput(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        return events.filter(event => event.date === dateStr);
    };
    
    // Klick auf einen Tag
    const handleDayClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(clickedDate);
        setEventForm({
            ...eventForm,
            date: formatDateForInput(clickedDate)
        });
        setEditingEvent(null);
        setShowEventModal(true);
    };
    
    // Event-Formular Handler
    const handleEventFormChange = (e) => {
        const { name, value } = e.target;
        setEventForm({
            ...eventForm,
            [name]: value
        });
    };
    
    // Event speichern
    const handleSaveEvent = () => {
        if (!eventForm.title || !eventForm.date) {
            alert('Bitte geben Sie mindestens einen Titel und ein Datum ein.');
            return;
        }
        
        if (editingEvent) {
            // Event bearbeiten
            const updatedEvents = events.map(event => 
                event.id === editingEvent.id 
                    ? { ...eventForm, id: editingEvent.id }
                    : event
            );
            setEvents(updatedEvents);
        } else {
            // Neues Event
            const newEvent = {
                ...eventForm,
                id: Date.now()
            };
            setEvents([...events, newEvent]);
        }
        
        // Modal schließen und Form zurücksetzen
        setShowEventModal(false);
        setEventForm({
            title: '',
            description: '',
            date: '',
            time: '',
            color: '#0f3c63'
        });
        setEditingEvent(null);
    };
    
    // Event bearbeiten
    const handleEditEvent = (event, e) => {
        e.stopPropagation();
        setEditingEvent(event);
        setEventForm(event);
        setShowEventModal(true);
    };
    
    // Event löschen
    const handleDeleteEvent = (eventId, e) => {
        e.stopPropagation();
        if (window.confirm('Möchten Sie diesen Termin wirklich löschen?')) {
            setEvents(events.filter(event => event.id !== eventId));
        }
    };
    
    // Kalendertage generieren
    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        
        // Leere Zellen am Anfang
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        
        // Tage des Monats
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        
        return days;
    };
    
    const handleFormKeyPress = (e) => {
        if (e.key === 'Enter' && e.target.type !== 'textarea') {
            e.preventDefault();
            handleSaveEvent();
        }
    };
    
    const days = generateCalendarDays();
    const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    
    return (
        <div className="kalender">
            <div className="kalender-header">
                <button onClick={prevMonth} className="nav-button">&lt;</button>
                <h2>{formatMonth(currentDate)}</h2>
                <button onClick={nextMonth} className="nav-button">&gt;</button>
            </div>
            
            <div className="kalender-weekdays">
                {weekDays.map((day, index) => (
                    <div key={index} className="weekday-header">
                        {day}
                    </div>
                ))}
            </div>
            
            <div className="kalender-grid">
                {days.map((day, index) => (
                    <div 
                        key={index} 
                        className={`calendar-day ${
                            day === null ? 'empty-day' : ''
                        } ${
                            day && isPastDay(day) ? 'past-day' : ''
                        } ${
                            day && isToday(day) ? 'today' : ''
                        } ${
                            day && getEventsForDay(day).length > 0 ? 'has-events' : ''
                        }`}
                        onClick={() => day && handleDayClick(day)}
                    >
                        {day && (
                            <>
                                <div className="day-number">{day}</div>
                                <div className="day-events">
                                    {getEventsForDay(day).slice(0, 3).map((event, eventIndex) => (
                                        <div 
                                            key={event.id} 
                                            className="day-event"
                                            style={{ backgroundColor: event.color }}
                                            onClick={(e) => handleEditEvent(event, e)}
                                            title={event.title}
                                        >
                                            <span className="event-title">{event.title}</span>
                                            <button 
                                                className="event-delete"
                                                onClick={(e) => handleDeleteEvent(event.id, e)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {getEventsForDay(day).length > 3 && (
                                        <div className="more-events">
                                            +{getEventsForDay(day).length - 3} weitere
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Event Modal */}
            {showEventModal && (
                <div className="event-modal-overlay" onClick={() => setShowEventModal(false)}>
                    <div className="event-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingEvent ? 'Termin bearbeiten' : 'Neuer Termin'}</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowEventModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="event-form">
                            <div className="form-group">
                                <label htmlFor="title">Titel *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={eventForm.title}
                                    onChange={handleEventFormChange}
                                    onKeyPress={handleFormKeyPress}
                                    placeholder="z.B. Klausur Mathematik"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="description">Beschreibung</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={eventForm.description}
                                    onChange={handleEventFormChange}
                                    rows="3"
                                    placeholder="Weitere Details zum Termin..."
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="date">Datum *</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={eventForm.date}
                                        onChange={handleEventFormChange}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="time">Uhrzeit</label>
                                    <input
                                        type="time"
                                        id="time"
                                        name="time"
                                        value={eventForm.time}
                                        onChange={handleEventFormChange}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="color">Farbe</label>
                                <div className="color-selector">
                                    <select
                                        id="color"
                                        name="color"
                                        value={eventForm.color}
                                        onChange={handleEventFormChange}
                                        className="color-select"
                                    >
                                        {colorOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div 
                                        className="color-preview"
                                        style={{ backgroundColor: eventForm.color }}
                                    />
                                </div>
                            </div>
                            
                            <div className="modal-buttons">
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => setShowEventModal(false)}
                                >
                                    Abbrechen
                                </button>
                                <button 
                                    type="button"
                                    className="save-button"
                                    onClick={handleSaveEvent}
                                >
                                    {editingEvent ? 'Speichern' : 'Termin hinzufügen'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Kalender;