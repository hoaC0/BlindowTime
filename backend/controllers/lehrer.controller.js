import LehrerModel from '../models/lehrer.model.js';

// ALLE LEHRER HOLEN!!!
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await LehrerModel.getAllLehrer();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// sucht nach lehrer mit einer bestimmten ID
export const getTeacherById = async (req, res) => {
  try {
    const id = req.params.id;
    const teacher = await LehrerModel.getLehrerById(id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Lehrer nicht gefunden' });
    }
    
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// neuer lehrer
export const createTeacher = async (req, res) => {
  try {
    const teacherId = await LehrerModel.createLehrer(req.body);
    res.status(201).json({ lehrer_id: teacherId, message: 'Lehrer erfolgreich erstellt' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// aktualisiert lehrer
export const updateTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await LehrerModel.updateLehrer(id, req.body);
    
    if (!success) {
      return res.status(404).json({ message: 'Lehrer nicht gefunden' });
    }
    
    res.json({ message: 'Lehrer erfolgreich aktualisiert' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// del lehrer von db
export const deleteTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await LehrerModel.deleteLehrer(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Lehrer nicht gefunden' });
    }
    
    res.json({ message: 'Lehrer erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};