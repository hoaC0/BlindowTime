// Diese Datei stellt die Verbindung zur MySQL-Datenbank her
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lade .env aus dem Hauptverzeichnis
dotenv.config({ path: join(dirname(__dirname), '.env') });

console.log('DB Konfiguration:', {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '******' : 'nicht gesetzt',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Erstellt einen Pool von Datenbankverbindungen für bessere Performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;