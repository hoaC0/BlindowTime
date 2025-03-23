// backend/backend.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import lehrerRoutes from './routes/lehrer.routes.js';
import schuelerRoutes from './routes/schueler.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import stundenplanRoutes from './routes/stundenplan.routes.js';
import stundenplanManagementRoutes from './routes/stundenplan-management.routes.js';
import raeumeRoutes from './routes/raeume.routes.js';
import faecherRoutes from './routes/faecher.routes.js';
import mensaRoutes from './routes/mensa.routes.js';

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
app.use('/api/lehrer', lehrerRoutes);
app.use('/api/schueler', schuelerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stundenplan', stundenplanRoutes);
app.use('/api/stundenplan-management', stundenplanManagementRoutes);
app.use('/api/raeume', raeumeRoutes);
app.use('/api/faecher', faecherRoutes);
app.use('/api/mensa', mensaRoutes);

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