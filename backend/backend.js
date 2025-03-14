import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import lehrerRoutes from './routes/lehrer.routes.js';
import schuelerRoutes from './routes/schueler.routes.js';

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lade .env aus dem Hauptverzeichnis
dotenv.config({ path: join(dirname(__dirname), '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routen
app.use('/api/teachers', lehrerRoutes);
app.use('/api/schueler', schuelerRoutes);

// Einfacher Test-Endpunkt
app.get('/', (req, res) => {
  res.json({ message: 'Verbindung zur BlindowTime API hergestellt!' });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log('Umgebungsvariablen:', {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT
  });
});