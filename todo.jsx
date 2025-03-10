import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Header from "./Header.jsx";
import './todo.css';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      setTasks([...tasks, inputValue]);
      setInputValue('');
    }
  };

  return (
    <div className="todo-container">
      <form onSubmit={handleSubmit} className="add-task-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add Task"
          className="task-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      <div className="task-list">
        <h2>Task List</h2>
        {tasks.map((task, index) => (
          <div key={index} className="task-item">
            <input type="checkbox" />
            <span>{task}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header/>
    <TodoList/>
  </React.StrictMode>
);