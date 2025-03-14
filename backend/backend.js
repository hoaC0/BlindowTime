const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routen
app.use('/api/teachers', require('./routes/teacher.routes'));

// Einfacher Test-Endpunkt
app.get('/', (req, res) => {
  res.json({ message: 'Verbindung zur BlindowTime API hergestellt!' });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});