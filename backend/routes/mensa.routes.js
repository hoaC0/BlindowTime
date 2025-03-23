// backend/routes/mensa.routes.js
import express from 'express';
import * as mensaController from '../controllers/mensa.controller.js';

const router = express.Router();

// Heutiges Menü abrufen
router.get('/heute', mensaController.getTodaysMenu);

// Wochenplan abrufen
router.get('/wochenplan/:weekNumber', mensaController.getWeeklyMenu);

// Tagesmenü aktualisieren
router.put('/speiseplan/:weekNumber/:day', mensaController.updateDayMenu);

// Wochenplan veröffentlichen
router.post('/wochenplan/:weekNumber/publish', mensaController.publishWeeklyMenu);

export default router;