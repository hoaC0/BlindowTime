// backend/routes/stundenplan-management.routes.js
import express from 'express';
import * as stundenplanManagementController from '../controllers/stundenplan-management.controller.js';

const router = express.Router();

// Stammdaten abrufen
router.get('/klassen', stundenplanManagementController.getAllClasses);
router.get('/faecher', stundenplanManagementController.getAllSubjects);
router.get('/lehrer', stundenplanManagementController.getAllTeachers);
router.get('/raeume', stundenplanManagementController.getAllRooms);

// Stundenplan für eine Klasse abrufen
router.get('/:klassenName', stundenplanManagementController.getScheduleForClass);

// Unterricht bearbeiten
router.post('/unterricht', stundenplanManagementController.updateLesson);
router.delete('/unterricht', stundenplanManagementController.deleteLesson);

export default router;