import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from "./Header.jsx";
import './styles/todo.css';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  
  useEffect(() => {
    const savedTasks = getCookie('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error parsing tasks from cookie:', error);
        setTasks([]);
      }
    }
  }, []);


  useEffect(() => {
    if (tasks.length > 0) {
      setCookie('tasks', JSON.stringify(tasks), 30); // expires in 30 days
    }
  }, [tasks]);

  // Sset cookie
  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  };

  // Get cookie value by name
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

  // add new task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        date: new Date().toLocaleDateString()
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
    }
  };

  // Toggle task completion status
  const toggleComplete = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (tasks.length === 1) {
      // If the last task is deleted, also delete the cookie
      document.cookie = "tasks=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  };

  // Clear all tasks
  const clearAllTasks = () => {
    if (window.confirm('Möchtest du wirklich alle Aufgaben löschen?')) {
      setTasks([]);
      document.cookie = "tasks=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  };

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  // Get counts for the filter tabs
  const counts = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>Aufgabenliste</h1>
        <p>Plane deine Aufgaben und behalte den Überblick</p>
      </div>

      <form onSubmit={handleSubmit} className="add-task-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Neue Aufgabe hinzufügen..."
          className="task-input"
        />
        <button type="submit" className="add-button">Hinzufügen</button>
      </form>

      <div className="task-list">
        <div className="task-list-header">
          <h2>Meine Aufgaben</h2>
          <div className="filter-buttons-wrapper">
            <div className="filter-buttons">
              <button 
                className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Alle ({counts.all})
              </button>
              <button 
                className={`filter-button ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Offen ({counts.active})
              </button>
              <button 
                className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Erledigt ({counts.completed})
              </button>
            </div>
            
            {tasks.length > 0 && (
              <button 
                onClick={clearAllTasks}
                className="clear-all-button"
              >
                Alle löschen
              </button>
            )}
          </div>
        </div>

        <div className="task-items">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className={`task-item ${task.completed ? 'task-completed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  className="task-checkbox"
                />
                <span className="task-text">{task.text}</span>
                <span className="task-date">{task.date}</span>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="task-button delete-button"
                  title="Löschen"
                >
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <div className="empty-list">
              <p>Keine Aufgaben gefunden</p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')} 
                  className="filter-button"
                >
                  Alle anzeigen
                </button>
              )}
            </div>
          )}
        </div>
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