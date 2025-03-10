import React, { useState } from 'react';
import './dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-grid">
            <div className="content">
                <h3 className='Stundenplan'>Stundenplan</h3>
                <h5 className='Stundenplan'>Nächste Stunde:<br></br>Englisch</h5>
                </div>
            <div className="content"><h3 className='ToDo'>ToDo</h3></div>
            <div className="content">
                <h3 className='Kalender'>Kalender</h3>
                <h5 className='Kalender'>29.10.2024 IT Klausur</h5>
                <h5 className='Kalender'>29.10.2024 IT Klausur</h5>
                <h5 className='Kalender'>29.10.2024 IT Klausur</h5>
            </div>
        </div>
    );
}   

export default Dashboard;