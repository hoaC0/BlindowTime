import SchuelerModel from '../models/schueler.model.js';

export const getAllSchueler = async (req, res) => {
  try {
    const schueler = await SchuelerModel.getAllSchueler();
    res.json(schueler);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSchuelerById = async (req, res) => {
  try {
    const id = req.params.id;
    const schueler = await SchuelerModel.getSchuelerById(id);
    
    if (!schueler) {
      return res.status(404).json({ message: 'Schüler nicht gefunden' });
    }
    
    res.json(schueler);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSchuelerByKlasse = async (req, res) => {
  try {
    const klassenId = req.params.klassenId;
    const schueler = await SchuelerModel.getSchuelerByKlasse(klassenId);
    res.json(schueler);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSchueler = async (req, res) => {
  try {
    const schuelerId = await SchuelerModel.createSchueler(req.body);
    res.status(201).json({ schueler_id: schuelerId, message: 'Schüler erfolgreich erstellt' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSchueler = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await SchuelerModel.updateSchueler(id, req.body);
    
    if (!success) {
      return res.status(404).json({ message: 'Schüler nicht gefunden' });
    }
    
    res.json({ message: 'Schüler erfolgreich aktualisiert' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSchueler = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await SchuelerModel.deleteSchueler(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Schüler nicht gefunden' });
    }
    
    res.json({ message: 'Schüler erfolgreich gelöscht' });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllKlassen = async (req, res) => {
  try {
    const klassen = await SchuelerModel.getAllKlassen();
    res.json(klassen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};