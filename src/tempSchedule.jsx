import React from 'react';
import './TempSchedule.css';

const TempSchedule = () => {
  const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
  const times = [
    '8:00', '9:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  return (
    <div className="schedule-container">
      <h1 className="schedule-title">ITA 23</h1>
      <div className="schedule-grid">
        <div className="time-column">
          <div className="grid-cell header">Zeit</div>
          {times.map((time, index) => (
            <div key={index} className="grid-cell time">{time}</div>
          ))}
        </div>
        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="day-column">
            <div className="grid-cell header">{day}</div>
            {times.map((_, timeIndex) => (
              <div key={timeIndex} className="grid-cell"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TempSchedule;