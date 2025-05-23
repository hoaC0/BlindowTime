import FaecherModel from '../models/faecher.model.js';

// liste aller faecher holen 
export const getAllFaecher = async (req, res) => {
    try {
        const faecher = await FaecherModel.getAllFaecher();
        res.json(faecher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// EIN FACH MIT ID HOLEN!
export const getFachById = async (req, res) => {
    try {
        const id = req.params.id;
        const fach = await FaecherModel.getFachById(id);
        
        if (!fach) {
            return res.status(404).json({ message: 'Fach nicht gefunden' });
        }
        
        res.json(fach);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// neues fach erstellen
export const createFach = async (req, res) => {
    try {
        const fachId = await FaecherModel.createFach(req.body);
        res.status(201).json({ fach_id: fachId, message: 'Fach erfolgreich erstellt' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// fach aktualisieren
// bekommt neue werte aus body
export const updateFach = async (req, res) => {
    try {
        const id = req.params.id;
        const success = await FaecherModel.updateFach(id, req.body);
        
        if (!success) {
            return res.status(404).json({ message: 'Fach nicht gefunden' });
        }
        
        res.json({ message: 'Fach erfolgreich aktualisiert' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// loescht fach
export const deleteFach = async (req, res) => {
    try {
        const id = req.params.id;
        const success = await FaecherModel.deleteFach(id);
        
        if (!success) {
            return res.status(404).json({ message: 'Fach nicht gefunden' });
        }
        
        res.json({ message: 'Fach erfolgreich gelöscht' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};