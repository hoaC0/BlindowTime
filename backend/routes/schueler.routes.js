const express = require('express');
const router = express.Router();
const schuelerController = require('../controllers/schueler.controller');

router.get('/', schuelerController.getschuelerTeachers);
module.exports = router;