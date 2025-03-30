import express from 'express';
import * as stundenplanManagementController from '../controllers/stundenplan-management.controller.js';

const router = express.Router();

// STAMMDATEN routen! alle notwendige infos holen
router.get('/klassen', stundenplanManagementController.getAllClasses);
router.get('/faecher', stundenplanManagementController.getAllSubjects);
router.get('/lehrer', stundenplanManagementController.getAllTeachers);
router.get('/raeume', stundenplanManagementController.getAllRooms);

// stundenplan abrufen nach name
router.get('/:klassenName', stundenplanManagementController.getScheduleForClass);

// unterricht bearbeiten
// unterricht anlegen/aendern
router.post('/unterricht', stundenplanManagementController.updateLesson);
// unterricht loeschen
router.delete('/unterricht', stundenplanManagementController.deleteLesson);

export default router;