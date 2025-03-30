import express from 'express';
import * as schuelerController from '../controllers/schueler.controller.js';

const router = express.Router();

// KLASSEN HOLEN - die MUSS vor id route sein!!
router.get('/klassen', schuelerController.getAllKlassen);

// schueler nach klasse finden
router.get('/klasse/:klassenId', schuelerController.getSchuelerByKlasse);

// alle schueler
router.get('/', schuelerController.getAllSchueler);

// schueler via id
router.get('/:id', schuelerController.getSchuelerById);

// neuen schueler anlegen
router.post('/', schuelerController.createSchueler);

// update schueler
router.put('/:id', schuelerController.updateSchueler);

// del schueler
router.delete('/:id', schuelerController.deleteSchueler);

export default router;