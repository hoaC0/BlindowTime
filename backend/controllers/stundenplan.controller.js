import StundenplanModel from '../models/stundenplan.model.js';

// HOL STUNDENPLAN FUER EINE KLASSE!
export const getStundenplanByKlasse = async (req, res) => {
  try {
    const klassenName = req.params.klassenName;
    const stundenplan = await StundenplanModel.getStundenplanByKlasse(klassenName);
    
    if (!stundenplan || stundenplan.length === 0) {
      return res.status(404).json({ message: `Stundenplan für ${klassenName} nicht gefunden` });
    }
    
    res.json(stundenplan);
  } catch (error) {
    console.error(`Fehler beim Abrufen des Stundenplans für ${req.params.klassenName}:`, error);
    res.status(500).json({ message: error.message });
  }
};

// gibt alle verhandene klassen zurueck
export const getAlleKlassen = async (req, res) => {
  try {
    const klassen = await StundenplanModel.getAlleKlassen();
    res.json(klassen);
  } catch (error) {
    console.error('Fehler beim Abrufen der Klassen mit Stundenplänen:', error);
    res.status(500).json({ message: error.message });
  }
};