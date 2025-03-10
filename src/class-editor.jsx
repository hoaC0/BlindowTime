import React, { useState, useEffect } from 'react';
import './classEditor.css';

const ClassEditor = () => {
  // Get class ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const classId = urlParams.get('id');
  
  const [className, setClassName] = useState('');
  const [days] = useState(["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]);
  const [times] = useState([
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
  ]);
  
  // State for the schedule data
  const [schedule, setSchedule] = useState(Array(times.length).fill().map(() => Array(days.length).fill(null)));
  
  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ timeIndex: -1, dayIndex: -1 });
  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    room: ''
  });

  // Load class data
  useEffect(() => {
    // This would fetch data from your backend in a real application
    // Simulated data fetch
    if (classId) {
      // Sample data
      const classNames = {
        "1": "Klasse 10A",
        "2": "Klasse 11B",
        "3": "Klasse 12C",
        "4": "Klasse 9D"
      };
      
      setClassName(classNames[classId] || 'Unbekannte Klasse');
      
      // In a real app, you would fetch the schedule data from your backend
      
      // Simulate some sample data
      const sampleSchedule = Array(times.length).fill().map(() => Array(days.length).fill(null));
      
      // Add some example classes
      if (classId === "1") {
        sampleSchedule[0][0] = { subject: "Mathematik", teacher: "Fr. Müller", room: "101" };
        sampleSchedule[1][0] = { subject: "Mathematik", teacher: "Fr. Müller", room: "101" };
        sampleSchedule[2][1] = { subject: "Deutsch", teacher: "Hr. Schmidt", room: "203" };
        sampleSchedule[3][1] = { subject: "Deutsch", teacher: "Hr. Schmidt", room: "203" };
        sampleSchedule[4][2] = { subject: "Englisch", teacher: "Fr. Weber", room: "105" };
      }
      
      setSchedule(sampleSchedule);
    }
  }, [classId, days.length, times.length]);

  const openModal = (timeIndex, dayIndex) => {
    const cellData = schedule[timeIndex][dayIndex] || { subject: '', teacher: '', room: '' };
    setSelectedCell({ timeIndex, dayIndex });
    setFormData(cellData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCell({ timeIndex: -1, dayIndex: -1 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update the schedule state with the new data
    const newSchedule = [...schedule];
    newSchedule[selectedCell.timeIndex][selectedCell.dayIndex] = { ...formData };
    setSchedule(newSchedule);
    
    // In a real app, you would save this data to your backend
    
    closeModal();
  };

  const handleDelete = () => {
    const newSchedule = [...schedule];
    newSchedule[selectedCell.timeIndex][selectedCell.dayIndex] = null;
    setSchedule(newSchedule);
    closeModal();
  };

  const goBack = () => {
    window.location.href = '/admin.html';
  };

  const saveSchedule = () => {
    // In a real app, you would send the schedule data to your backend
    alert('Stundenplan gespeichert!');
  };

  return (
    <div className="class-editor-container">
      <div className="editor-header">
        <button className="back-button" onClick={goBack}>&larr; Zurück</button>
        <h2>Stundenplan für {className}</h2>
        <button className="save-button" onClick={saveSchedule}>Speichern</button>
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

            {days.map((day, dayIndex) => {
              const cellData = schedule[timeIndex][dayIndex];
              return (
                <div 
                  key={`cell-${timeIndex}-${dayIndex}`} 
                  className={`schedule-cell ${cellData ? 'has-class' : ''}`}
                  onClick={() => openModal(timeIndex, dayIndex)}
                >
                  {cellData && (
                    <div className="cell-content">
                      <div className="subject">{cellData.subject}</div>
                      <div className="details">{cellData.teacher} | {cellData.room}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Modal for editing */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Unterricht bearbeiten</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="subject">Fach</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleInputChange}
                  placeholder="Fach eingeben"
                />
              </div>
              <div className="form-group">
                <label htmlFor="teacher">Lehrer</label>
                <input 
                  type="text" 
                  id="teacher" 
                  name="teacher" 
                  value={formData.teacher} 
                  onChange={handleInputChange}
                  placeholder="Lehrer eingeben"
                />
              </div>
              <div className="form-group">
                <label htmlFor="room">Raum</label>
                <input 
                  type="text" 
                  id="room" 
                  name="room" 
                  value={formData.room} 
                  onChange={handleInputChange}
                  placeholder="Raum eingeben"
                />
              </div>
              <div className="modal-buttons">
                <button type="button" className="delete-button" onClick={handleDelete}>Löschen</button>
                <div>
                  <button type="button" className="cancel-button" onClick={closeModal}>Abbrechen</button>
                  <button type="submit" className="save-button">Speichern</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassEditor;
