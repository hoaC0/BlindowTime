// backend/routes/faecher.routes.js
import express from 'express';
import * as faecherController from '../controllers/faecher.controller.js';

const router = express.Router();

// ALLE FAECHER
router.get('/', faecherController.getAllFaecher);

// fach via id
router.get('/:id', faecherController.getFachById);

// neues fach
router.post('/', faecherController.createFach);

// fach aendern
router.put('/:id', faecherController.updateFach);

// del fach
router.delete('/:id', faecherController.deleteFach);

export default router;