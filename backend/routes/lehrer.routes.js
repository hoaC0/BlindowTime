import express from 'express';
import * as teacherController from '../controllers/lehrer.controller.js';

const router = express.Router();

// alle lehrer
router.get('/', teacherController.getAllTeachers);

// lehrer mit id
router.get('/:id', teacherController.getTeacherById);

// neu anlegen
router.post('/', teacherController.createTeacher);

// update
router.put('/:id', teacherController.updateTeacher);

// LOESCHEN
router.delete('/:id', teacherController.deleteTeacher);

export default router;