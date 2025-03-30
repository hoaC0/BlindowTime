// backend/routes/notification.routes.js
import express from 'express';
import * as notificationController from '../controllers/notification.controller.js';

const router = express.Router();

// alle notifications holen
router.get('/', notificationController.getAllNotifications);

// NEUE NACHRICHT ERSTELLEN!!
router.post('/', notificationController.createNotification);

// markiert nachricht als gelesen
router.put('/:id/read', notificationController.markAsRead);

// loescht eine nachricht
router.delete('/:id', notificationController.deleteNotification);

export default router;