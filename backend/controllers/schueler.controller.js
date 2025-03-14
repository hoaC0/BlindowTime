const schuelerModel = require('../models/schueler.model');

exports.getAllSchueler = async (req, res) => {
  try {
    const schueler = await schuelerModel.getAllSchueler();
    res.json(schueler);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};