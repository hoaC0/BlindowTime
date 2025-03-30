import StundenplanManagementModel from '../models/stundenplan-management.model.js';

// holt alle klassen aus der db
export const getAllClasses = async (req, res) => {
  try {
    const klassen = await StundenplanManagementModel.getAllClasses();
    res.json(klassen);
  } catch (error) {
    console.error('Fehler beim Abrufen der Klassen:', error);
    res.status(500).json({ message: error.message });
  }
};

// ALLE FAECHER VON DB HOLEN 
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await StundenplanManagementModel.getAllSubjects();
    res.json(subjects);
  } catch (error) {
    console.error('Fehler beim Abrufen der Fächer:', error);
    res.status(500).json({ message: error.message });
  }
};

// lehrer liste aus db
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await StundenplanManagementModel.getAllTeachers();
    res.json(teachers);
  } catch (error) {
    console.error('Fehler beim Abrufen der Lehrer:', error);
    res.status(500).json({ message: error.message });
  }
};

// raeume werden hier geholt
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await StundenplanManagementModel.getAllRooms();
    res.json(rooms);
  } catch (error) {
    console.error('Fehler beim Abrufen der Räume:', error);
    res.status(500).json({ message: error.message });
  }
};

// stundenplan von einer bestimmten klasse holen
// wir muessen den klassenNamen verwenden um den richtigen stundenplan zu finden
// dann wird alles zurueck gegeben
export const getScheduleForClass = async (req, res) => {
  try {
    const klassenName = req.params.klassenName;
    const stundenplan = await StundenplanManagementModel.getScheduleForClass(klassenName);
    
    if (!stundenplan || stundenplan.length === 0) {
      return res.status(404).json({ message: `Stundenplan für ${klassenName} nicht gefunden` });
    }
    
    res.json(stundenplan);
  } catch (error) {
    console.error(`Fehler beim Abrufen des Stundenplans für ${req.params.klassenName}:`, error);
    res.status(500).json({ message: error.message });
  }
};

// unterricht aktualisieren
export const updateLesson = async (req, res) => {
  try {
    const {
      klassenName,
      stunde,
      tag,
      fachId,
      raumId,
      lehrerId
    } = req.body;

    // check if alles da is
    if (!klassenName || !stunde || !tag) {
      return res.status(400).json({ message: 'Klasse, Stunde und Tag sind erforderlich' });
    }

    // tag -> tagespräfix (z.B. "montag" -> "mo")
    const tagMapping = {
      "montag": "mo",
      "dienstag": "di",
      "mittwoch": "mi",
      "donnerstag": "do",
      "freitag": "fr"
    };
    
    const tagPrefix = tagMapping[tag.toLowerCase()];
    
    if (!tagPrefix) {
      return res.status(400).json({ message: 'Ungültiger Tag. Erlaubt sind: Montag, Dienstag, Mittwoch, Donnerstag, Freitag' });
    }

    const result = await StundenplanManagementModel.updateLesson(
      klassenName, 
      stunde, 
      tagPrefix, 
      fachId, 
      raumId, 
      lehrerId
    );

    res.status(200).json({
      success: true,
      message: 'Unterricht erfolgreich aktualisiert',
      data: result
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Unterrichts:', error);
    res.status(500).json({ message: error.message });
  }
};

// deletes unterricht fuer klasse
export const deleteLesson = async (req, res) => {
  try {
    const { klassenName, stunde, tag } = req.body;

    // pruefen ob alle felder da sind
    if (!klassenName || !stunde || !tag) {
      return res.status(400).json({ message: 'Klasse, Stunde und Tag sind erforderlich' });
    }

    // tag in prefix umwandeln
    const tagMapping = {
      "montag": "mo",
      "dienstag": "di",
      "mittwoch": "mi",
      "donnerstag": "do",
      "freitag": "fr"
    };
    
    const tagPrefix = tagMapping[tag.toLowerCase()];
    
    if (!tagPrefix) {
      return res.status(400).json({ message: 'Ungültiger Tag. Erlaubt sind: Montag, Dienstag, Mittwoch, Donnerstag, Freitag' });
    }

    const result = await StundenplanManagementModel.deleteLesson(klassenName, stunde, tagPrefix);

    res.status(200).json({
      success: true,
      message: 'Unterricht erfolgreich gelöscht',
      data: result
    });
  } catch (error) {
    console.error('Fehler beim Löschen des Unterrichts:', error);
    res.status(500).json({ message: error.message });
  }
};