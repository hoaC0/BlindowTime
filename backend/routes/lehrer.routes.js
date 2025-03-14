import express from 'express';
import * as teacherController from '../controllers/lehrer.controller.js';

const router = express.Router();

router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById);
router.post('/', teacherController.createTeacher);
router.put('/:id', teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);

export default router;