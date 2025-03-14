import express from 'express';
import * as schuelerController from '../controllers/schueler.controller.js';

const router = express.Router();

// Klassen abrufen - diese Route muss vor der ID-Route stehen!
router.get('/klassen', schuelerController.getAllKlassen);

// Schüler nach Klasse abrufen
router.get('/klasse/:klassenId', schuelerController.getSchuelerByKlasse);

// Alle Schüler abrufen
router.get('/', schuelerController.getAllSchueler);

// Schüler nach ID abrufen
router.get('/:id', schuelerController.getSchuelerById);

// Neuen Schüler erstellen
router.post('/', schuelerController.createSchueler);

// Schüler aktualisieren
router.put('/:id', schuelerController.updateSchueler);

// Schüler löschen
router.delete('/:id', schuelerController.deleteSchueler);

export default router;