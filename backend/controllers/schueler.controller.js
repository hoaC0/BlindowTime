const schuelerModel = require('../models/schueler.model');

exports.getAllschueler = async (req, res) => {
  try {
    const schueler = await schuelerModel.getAllschueler();
    res.json(schueler);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};