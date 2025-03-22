import RaeumeModel from '../models/raeume.model.js';

export const getAllRaeume = async (req, res) => {
  try {
    const raeume = await RaeumeModel.getAllRaeume();
    res.json(raeume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRaumById = async (req, res) => {
  try {
    const id = req.params.id;
    const raum = await RaeumeModel.getRaumById(id);
    
    if (!raum) {
      return res.status(404).json({ message: 'Raum nicht gefunden' });
    }
    
    res.json(raum);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRaum = async (req, res) => {
  try {
    const raumId = await RaeumeModel.createRaum(req.body);
    res.status(201).json({ raum_id: raumId, message: 'Raum erfolgreich erstellt' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRaum = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await RaeumeModel.updateRaum(id, req.body);
    
    if (!success) {
      return res.status(404).json({ message: 'Raum nicht gefunden' });
    }
    
    res.json({ message: 'Raum erfolgreich aktualisiert' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRaum = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await RaeumeModel.deleteRaum(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Raum nicht gefunden' });
    }
    
    res.json({ message: 'Raum erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};