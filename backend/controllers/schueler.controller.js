import SchuelerModel from '../models/schueler.model.js';

export const getAllSchueler = async (req, res) => {
  try {
    const schueler = await SchuelerModel.getAllSchueler();
    res.json(schueler);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// holt einen schueler nach ID
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

// ALLE SCHUELER AUS EINER KLASSE HOLEN!
export const getSchuelerByKlasse = async (req, res) => {
  try {
    const klassenId = req.params.klassenId;
    const schueler = await SchuelerModel.getSchuelerByKlasse(klassenId);
    res.json(schueler);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// neuen schueler anlegen (mit allen daten)
export const createSchueler = async (req, res) => {
  try {
    console.log('Request body received:', req.body);
    
    // check if wir umbennen muessen klassen_id -> klasse_id
    let schuelerData = { ...req.body };
    if ('klassen_id' in schuelerData && !('klasse_id' in schuelerData)) {
      console.log('Renaming klassen_id to klasse_id');
      schuelerData.klasse_id = schuelerData.klassen_id;
      delete schuelerData.klassen_id;
    }
    
    console.log('Processed data to save:', schuelerData);
    
    const schuelerId = await SchuelerModel.createSchueler(schuelerData);
    res.status(201).json({ schueler_id: schuelerId, message: 'Schüler erfolgreich erstellt' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update schueler
export const updateSchueler = async (req, res) => {
  try {
    console.log('Update request body received:', req.body);
    
    // evtl umbennen
    let schuelerData = { ...req.body };
    if ('klassen_id' in schuelerData && !('klasse_id' in schuelerData)) {
      console.log('Renaming klassen_id to klasse_id in update');
      schuelerData.klasse_id = schuelerData.klassen_id;
      delete schuelerData.klassen_id;
    }
    
    const id = req.params.id;
    const success = await SchuelerModel.updateSchueler(id, schuelerData);
    
    if (!success) {
      return res.status(404).json({ message: 'Schüler nicht gefunden' });
    }
    
    res.json({ message: 'Schüler erfolgreich aktualisiert' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// entferne schueler von db
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

// HOL ALLE KLASSEN
export const getAllKlassen = async (req, res) => {
  try {
    const klassen = await SchuelerModel.getAllKlassen();
    res.json(klassen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};