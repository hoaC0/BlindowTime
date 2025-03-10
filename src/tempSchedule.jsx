"use client";
import React from "react"; // ✅ Import React
import "./tempSchedule.css";

const TempSchedule = () => {
  const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

  const times = [
    "08:00 - 08:45",
    "08:45 - 09:30",
    "09:45 - 10:30",
    "10:30 - 11:15",
    "11:30 - 12:15",
    "12:15 - 13:00",
    "14:00 - 14:45",
    "14:45 - 15:30",
    "15:45 - 16:30",
    "16:30 - 17:15",
    "17:30 - 18:15",
    "18:15 - 19:00",
    "19:15 - 20:00",
  ];

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <button className="nav-button">&lt;</button>
        <h2>Klasse</h2>
        <button className="nav-button">&gt;</button>
      </div>

      <div className="schedule-grid">
        {/* header */}
        <div className="schedule-cell header">Stunde</div>
        {days.map((day, index) => (
          <div key={index} className="schedule-cell header">
            {day}
          </div>
        ))}

        
        {times.map((time, timeIndex) => (
          <React.Fragment key={timeIndex}>
            <div className="schedule-cell time-cell" title={time}>
              {timeIndex + 1}
            </div>

            {days.map((day, dayIndex) => (
              <div 
                key={`cell-${timeIndex}-${dayIndex}`} 
                className={`schedule-cell ${day.toLowerCase()}${timeIndex + 1}`} // generiert "montag1", "dienstag2" usw
                title=""
              ></div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TempSchedule;
