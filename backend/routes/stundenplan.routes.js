// backend/routes/stundenplan.routes.js
import express from 'express';
import * as stundenplanController from '../controllers/stundenplan.controller.js';

const router = express.Router();

// Stundenplan für eine bestimmte Klasse abrufen
router.get('/:klassenName', stundenplanController.getStundenplanByKlasse);

// Alle verfügbaren Klassen mit Stundenplänen abrufen
router.get('/klassen/alle', stundenplanController.getAlleKlassen);

export default router;