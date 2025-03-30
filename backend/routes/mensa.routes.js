import express from 'express';
import * as mensaController from '../controllers/mensa.controller.js';

const router = express.Router();

// heutiges menue abrufen
router.get('/heute', mensaController.getTodaysMenu);

// wochenplan abrufen
router.get('/wochenplan/:weekNumber', mensaController.getWeeklyMenu);

// tagesmenue aktualisieren
router.put('/speiseplan/:weekNumber/:day', mensaController.updateDayMenu);

// wochenplan veroeffentlichen
router.post('/wochenplan/:weekNumber/publish', mensaController.publishWeeklyMenu);

export default router;