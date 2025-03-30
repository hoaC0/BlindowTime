import express from 'express';
import * as raeumeController from '../controllers/raeume.controller.js';

const router = express.Router();

// alle raeume holen
router.get('/', raeumeController.getAllRaeume);

// raum mit id
router.get('/:id', raeumeController.getRaumById);

// NEUEN RAUM ANLEGEN
router.post('/', raeumeController.createRaum);

// update raum
router.put('/:id', raeumeController.updateRaum);

// loescht raum
router.delete('/:id', raeumeController.deleteRaum);

export default router;