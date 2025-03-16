// backend/routes/notification.routes.js
import express from 'express';
import * as notificationController from '../controllers/notification.controller.js';

const router = express.Router();

// Alle Benachrichtigungen abrufen
router.get('/', notificationController.getAllNotifications);

// Neue Benachrichtigung erstellen
router.post('/', notificationController.createNotification);

// Benachrichtigung als gelesen markieren
router.put('/:id/read', notificationController.markAsRead);

// Benachrichtigung löschen
router.delete('/:id', notificationController.deleteNotification);

export default router;