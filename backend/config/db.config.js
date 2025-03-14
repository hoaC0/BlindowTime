// Diese Datei stellt die Verbindung zur MySQL-Datenbank her
const mysql = require('mysql2/promise');
require('dotenv').config();

// Erstellt einen Pool von Datenbankverbindungen für bessere Performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // Server-Adresse (meist localhost)
  user: process.env.DB_USER,         // Dein MySQL-Benutzername
  password: process.env.DB_PASSWORD, // Dein MySQL-Passwort
  database: process.env.DB_NAME,     // Name der Datenbank
  waitForConnections: true,
  connectionLimit: 10,   // Maximal 10 gleichzeitige Verbindungen
  queueLimit: 0          // Unbegrenzte Warteschlange
});

module.exports = pool;