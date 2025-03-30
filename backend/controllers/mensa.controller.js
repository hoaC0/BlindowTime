import MensaModel from '../models/mensa.model.js';

// heutiges mensaangebot abrufen
export const getTodaysMenu = async (req, res) => {
  try {
    const menu = await MensaModel.getTodaysMenu();
    
    if (!menu) {
      return res.status(404).json({ message: 'kein menue fuer heute gefunden' });
    }
    
    res.json(menu);
  } catch (error) {
    console.error('fehler beim abrufen des heutigen menues:', error);
    res.status(500).json({ message: error.message });
  }
};

// wochenplan holen
export const getWeeklyMenu = async (req, res) => {
  try {
    const weekNumber = parseInt(req.params.weekNumber) || MensaModel.getCurrentWeek();
    const weeklyMenu = await MensaModel.getWeeklyMenu(weekNumber);
    
    if (!weeklyMenu || weeklyMenu.length === 0) {
      return res.status(404).json({ message: `kein menue fuer woche ${weekNumber} gefunden` });
    }
    
    res.json(weeklyMenu);
  } catch (error) {
    console.error(`fehler beim abrufen des menues fuer woche ${req.params.weekNumber}:`, error);
    res.status(500).json({ message: error.message });
  }
};

// tagesmenue aktualisieren
export const updateDayMenu = async (req, res) => {
  try {
    const { weekNumber, day } = req.params;
    const menuData = req.body;
    
    // validierung
    if (!menuData.hauptgericht || !menuData.vegetarisch) {
      return res.status(400).json({ 
        message: 'hauptgericht und vegetarisches gericht sind erforderlich' 
      });
    }
    
    // datum aus wochennummer und tag berechnen falls nicht angegeben
    if (!menuData.datum) {
      menuData.datum = MensaModel.getDateForWeekday(day, parseInt(weekNumber));
    }
    
    const result = await MensaModel.updateDayMenu(parseInt(weekNumber), day, menuData);
    
    res.status(200).json({
      success: true,
      message: `menue fuer ${day} in woche ${weekNumber} erfolgreich aktualisiert`,
      data: result
    });
  } catch (error) {
    console.error(`fehler beim aktualisieren des menues fuer tag ${req.params.day}:`, error);
    res.status(500).json({ message: error.message });
  }
};

// wochenplan veroeffentlichen
export const publishWeeklyMenu = async (req, res) => {
  try {
    const weekNumber = parseInt(req.params.weekNumber);
    const menuData = req.body;
    
    // validierung
    if (!Array.isArray(menuData) || menuData.length === 0) {
      return res.status(400).json({ message: 'gueltige menuedaten sind erforderlich' });
    }
    
    const result = await MensaModel.publishWeeklyMenu(weekNumber, menuData);
    
    res.status(200).json({
      success: true,
      message: `wochenplan fuer woche ${weekNumber} erfolgreich veroeffentlicht`,
      data: result
    });
  } catch (error) {
    console.error(`fehler beim veroeffentlichen des wochenplans fuer woche ${req.params.weekNumber}:`, error);
    res.status(500).json({ message: error.message });
  }
};