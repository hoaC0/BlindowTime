'use client';

import React, { useState } from 'react';
import "./styles/kalenderElement.css";

const Kalender = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();
    
    
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // navigation
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    // formatierung
    const formatMonth = (date) => {
        return date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
    };

    const getWeekDay = (year, month, day) => {
        const date = new Date(year, month, day);
        return date.toLocaleString('de-DE', { weekday: 'short' });
    };

    const isPastDay = (day) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };

    // Kalendertage generieren
    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const days = [];

        // Nur Tage des aktuellen Monats
        for (let day = 1; day <= daysInMonth; day++) {
            const weekDay = getWeekDay(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
            );
            days.push({
                day,
                weekDay,
                isPast: isPastDay(day)
            });
        }

        return days;
    };

    const days = generateCalendarDays();

    return (
        <div className="kalender">
            <div className="kalender-header">
                <button onClick={prevMonth}>&lt;</button>
                <h2>{formatMonth(currentDate)}</h2>
                <button onClick={nextMonth}>&gt;</button>
            </div>
            <div className="kalender-grid">
                {days.map((day, index) => (
                    <div 
                        key={index} 
                        className={`calendar-day ${day.isPast ? 'past-day' : ''}`}
                    >
                        <div className="day-number">{day.day}</div>
                        <div className="week-day">{day.weekDay}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Kalender;
