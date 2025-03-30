// backend/routes/stundenplan.routes.js
import express from 'express';
import * as stundenplanController from '../controllers/stundenplan.controller.js';

const router = express.Router();

// stundenplan fuer bestimmte klasse
router.get('/:klassenName', stundenplanController.getStundenplanByKlasse);

// ALLE KLASSEN MIT STUNDENPLAENEN!!!
router.get('/klassen/alle', stundenplanController.getAlleKlassen);

export default router;