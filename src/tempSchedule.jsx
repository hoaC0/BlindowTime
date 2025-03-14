"use client";
import React, { useState, useEffect } from 'react';
import "./tempSchedule.css";

const TempSchedule = () => {
  const [currentClass, setCurrentClass] = useState('');
  const [days] = useState(["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]);
  const [times] = useState([
    { id: 1, time: "08:00 - 08:45" },
    { id: 2, time: "08:45 - 09:30" },
    { id: 3, time: "09:45 - 10:30" },
    { id: 4, time: "10:30 - 11:15" },
    { id: 5, time: "11:30 - 12:15" },
    { id: 6, time: "12:15 - 13:00" },
    { id: 7, time: "14:00 - 14:45" },
    { id: 8, time: "14:45 - 15:30" },
    { id: 9, time: "15:45 - 16:30" },
    { id: 10, time: "16:30 - 17:15" },
    { id: 11, time: "17:30 - 18:15" },
    { id: 12, time: "18:15 - 19:00" },
    { id: 13, time: "19:15 - 20:00" }
  ]);

  // Stundenplan-Daten (würde in einer echten App von einer API kommen)
  const [scheduleData, setScheduleData] = useState([]);
  
  // Aktueller Tag für Highlight-Funktion
  const currentDay = new Date().getDay(); // 0 = Sonntag, 1 = Montag, ...
  const currentDayIndex = currentDay === 0 || currentDay === 6 ? -1 : currentDay - 1;
  
  // Klassenoptionen für Dropdown
  const classOptions = [
    { id: '', name: '' },
    { id: 'ITA25', name: 'ITA25' },
    { id: 'BTA26', name: 'BTA26' },
    { id: 'GD25', name: 'GD25' },
    { id: 'PTA26', name: 'PTA26' }
  ];

  // Laden der Beispiel-Daten
  useEffect(() => {
    // Hier würden in einer echten App die Daten von einer API geladen
    const mockScheduleData = [];
    
    // Beispiel-Daten für ITA25
    if (currentClass === 'ITA25') {
      mockScheduleData.push(
        { timeId: 1, dayIndex: 0, subject: 'Mathematik', teacher: 'Fr. Müller', room: '101', color: '#4285F4' },
        { timeId: 2, dayIndex: 0, subject: 'Mathematik', teacher: 'Fr. Müller', room: '101', color: '#4285F4' },
        { timeId: 3, dayIndex: 1, subject: 'Deutsch', teacher: 'Hr. Schmidt', room: '203', color: '#EA4335' },
        { timeId: 4, dayIndex: 1, subject: 'Deutsch', teacher: 'Hr. Schmidt', room: '203', color: '#EA4335' },
        { timeId: 5, dayIndex: 2, subject: 'Englisch', teacher: 'Fr. Weber', room: '105', color: '#FBBC05' },
        { timeId: 6, dayIndex: 2, subject: 'Englisch', teacher: 'Fr. Weber', room: '105', color: '#FBBC05' },
        { timeId: 3, dayIndex: 0, subject: 'Informatik', teacher: 'Hr. Schneider', room: 'PC-Lab 1', color: '#34A853' },
        { timeId: 4, dayIndex: 0, subject: 'Informatik', teacher: 'Hr. Schneider', room: 'PC-Lab 1', color: '#34A853' },
        { timeId: 7, dayIndex: 3, subject: 'Physik', teacher: 'Hr. Fischer', room: '204', color: '#7B1FA2' },
        { timeId: 8, dayIndex: 3, subject: 'Physik', teacher: 'Hr. Fischer', room: '204', color: '#7B1FA2' },
        { timeId: 5, dayIndex: 4, subject: 'Projektarbeit', teacher: 'Fr. Müller', room: 'PC-Lab 2', color: '#0097A7' },
        { timeId: 6, dayIndex: 4, subject: 'Projektarbeit', teacher: 'Fr. Müller', room: 'PC-Lab 2', color: '#0097A7' }
      );
    } else if (currentClass === 'BTA26') {
      mockScheduleData.push(
        { timeId: 1, dayIndex: 1, subject: 'Biologie', teacher: 'Fr. Fischer', room: '201', color: '#34A853' },
        { timeId: 2, dayIndex: 1, subject: 'Biologie', teacher: 'Fr. Fischer', room: '201', color: '#34A853' },
        { timeId: 5, dayIndex: 0, subject: 'Chemie', teacher: 'Hr. Weber', room: 'Labor 1', color: '#EA4335' },
        { timeId: 6, dayIndex: 0, subject: 'Chemie', teacher: 'Hr. Weber', room: 'Labor 1', color: '#EA4335' }
      );
    } else if (currentClass === 'GD25') {
      mockScheduleData.push(
        { timeId: 3, dayIndex: 2, subject: 'Gestaltung', teacher: 'Fr. Wagner', room: 'Atelier', color: '#FBBC05' },
        { timeId: 4, dayIndex: 2, subject: 'Gestaltung', teacher: 'Fr. Wagner', room: 'Atelier', color: '#FBBC05' }
      );
    } else if (currentClass === 'PTA26') {
      mockScheduleData.push(
        { timeId: 7, dayIndex: 4, subject: 'Pharmazie', teacher: 'Hr. Schuster', room: 'Labor 2', color: '#7B1FA2' },
        { timeId: 8, dayIndex: 4, subject: 'Pharmazie', teacher: 'Hr. Schuster', room: 'Labor 2', color: '#7B1FA2' }
      );
    }
    
    setScheduleData(mockScheduleData);
  }, [currentClass]);

  const handleClassChange = (e) => {
    setCurrentClass(e.target.value);
  };

  // Finde Unterrichtsstunde für eine bestimmte Zeit und einen Tag
  const getClassForTimeAndDay = (timeId, dayIndex) => {
    return scheduleData.find(item => item.timeId === timeId && item.dayIndex === dayIndex);
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <div className="schedule-title-area">
          <h2>Stundenplan</h2>
          <div className="current-date-display">
            <div className="today-marker">
              Heute: {currentDayIndex >= 0 ? days[currentDayIndex] : 'Wochenende'}
            </div>
          </div>
        </div>
        <div className="class-selector">
          <label htmlFor="class-select">Klasse:</label>
          <select 
            id="class-select" 
            value={currentClass} 
            onChange={handleClassChange}
            className="class-select"
          >
            {classOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="schedule-grid">
        {/* Überschriften-Zeile */}
        <div className="schedule-cell header time-header">Zeit</div>
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`schedule-cell header ${index === currentDayIndex ? 'current-day' : ''}`}
          >
            {day}
          </div>
        ))}
        
        {/* Stundenzeilen */}
        {times.map((time) => (
          <React.Fragment key={time.id}>
            <div className="schedule-cell time-cell" title={time.time}>
              <div className="hour-number">{time.id}</div>
              <div className="hour-time">{time.time}</div>
            </div>
            
            {days.map((_, dayIndex) => {
              const classData = getClassForTimeAndDay(time.id, dayIndex);
              return (
                <div 
                  key={`${time.id}-${dayIndex}`} 
                  className={`schedule-cell ${dayIndex === currentDayIndex ? 'current-day-column' : ''} ${classData ? 'has-class' : ''}`}
                >
                  {classData && (
                    <div 
                      className="class-card" 
                      style={{borderLeftColor: classData.color}}
                    >
                      <div className="class-subject" style={{color: classData.color}}>
                        {classData.subject}
                      </div>
                      <div className="class-details">
                        <span className="class-teacher">{classData.teacher}</span>
                        <span className="class-room">{classData.room}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      <div className="schedule-legend">
        <div className="legend-title">Legende:</div>
        <div className="legend-item">
          <div className="legend-dot current-day-dot"></div>
          <div>Heutiger Tag</div>
        </div>
      </div>
    </div>
  );
};

export default TempSchedule;