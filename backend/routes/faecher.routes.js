// backend/routes/faecher.routes.js
import express from 'express';
import * as faecherController from '../controllers/faecher.controller.js';

const router = express.Router();

router.get('/', faecherController.getAllFaecher);
router.get('/:id', faecherController.getFachById);
router.post('/', faecherController.createFach);
router.put('/:id', faecherController.updateFach);
router.delete('/:id', faecherController.deleteFach);

export default router;