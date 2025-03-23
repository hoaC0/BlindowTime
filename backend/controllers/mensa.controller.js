// backend/controllers/mensa.controller.js
import MensaModel from '../models/mensa.model.js';

// Heutiges Mensaangebot abrufen
export const getTodaysMenu = async (req, res) => {
  try {
    const menu = await MensaModel.getTodaysMenu();
    
    if (!menu) {
      return res.status(404).json({ message: 'Kein Menü für heute gefunden' });
    }
    
    res.json(menu);
  } catch (error) {
    console.error('Fehler beim Abrufen des heutigen Menüs:', error);
    res.status(500).json({ message: error.message });
  }
};

// Wochenplan abrufen
export const getWeeklyMenu = async (req, res) => {
  try {
    const weekNumber = parseInt(req.params.weekNumber) || MensaModel.getCurrentWeek();
    const weeklyMenu = await MensaModel.getWeeklyMenu(weekNumber);
    
    if (!weeklyMenu || weeklyMenu.length === 0) {
      return res.status(404).json({ message: `Kein Menü für Woche ${weekNumber} gefunden` });
    }
    
    res.json(weeklyMenu);
  } catch (error) {
    console.error(`Fehler beim Abrufen des Menüs für Woche ${req.params.weekNumber}:`, error);
    res.status(500).json({ message: error.message });
  }
};

// Tagesmenü aktualisieren
export const updateDayMenu = async (req, res) => {
  try {
    const { weekNumber, day } = req.params;
    const menuData = req.body;
    
    // Validierung der Daten
    if (!menuData.hauptgericht || !menuData.vegetarisch) {
      return res.status(400).json({ 
        message: 'Hauptgericht und vegetarisches Gericht sind erforderlich' 
      });
    }
    
    // Datum aus der Wochennummer und dem Tag berechnen, falls nicht angegeben
    if (!menuData.datum) {
      menuData.datum = MensaModel.getDateForWeekday(day, parseInt(weekNumber));
    }
    
    const result = await MensaModel.updateDayMenu(parseInt(weekNumber), day, menuData);
    
    res.status(200).json({
      success: true,
      message: `Menü für ${day} in Woche ${weekNumber} erfolgreich aktualisiert`,
      data: result
    });
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Menüs für Tag ${req.params.day}:`, error);
    res.status(500).json({ message: error.message });
  }
};

// Wochenplan veröffentlichen
export const publishWeeklyMenu = async (req, res) => {
  try {
    const weekNumber = parseInt(req.params.weekNumber);
    const menuData = req.body;
    
    // Validierung
    if (!Array.isArray(menuData) || menuData.length === 0) {
      return res.status(400).json({ message: 'Gültige Menüdaten sind erforderlich' });
    }
    
    const result = await MensaModel.publishWeeklyMenu(weekNumber, menuData);
    
    res.status(200).json({
      success: true,
      message: `Wochenplan für Woche ${weekNumber} erfolgreich veröffentlicht`,
      data: result
    });
  } catch (error) {
    console.error(`Fehler beim Veröffentlichen des Wochenplans für Woche ${req.params.weekNumber}:`, error);
    res.status(500).json({ message: error.message });
  }
};