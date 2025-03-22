import express from 'express';
import * as raeumeController from '../controllers/raeume.controller.js';

const router = express.Router();

router.get('/', raeumeController.getAllRaeume);
router.get('/:id', raeumeController.getRaumById);
router.post('/', raeumeController.createRaum);
router.put('/:id', raeumeController.updateRaum);
router.delete('/:id', raeumeController.deleteRaum);

export default router;