// backend/models/mensa.model.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Pfad zur JSON-Datei für die Mensadaten
const mensaDataDir = path.join(__dirname, '..', 'data');
const mensaDataFile = path.join(mensaDataDir, 'mensa.json');

// Stellt sicher, dass das Verzeichnis existiert
const ensureDirectoryExists = async () => {
  try {
    await fs.access(mensaDataDir);
  } catch (error) {
    // Verzeichnis existiert nicht, also erstellen
    await fs.mkdir(mensaDataDir, { recursive: true });
  }
};

class MensaModel {
  // Aktuelle Kalenderwoche berechnen
  static getCurrentWeek() {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    return Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  }

  // Datum für einen Wochentag in einer bestimmten Woche berechnen
  static getDateForWeekday(weekday, weekNumber) {
    const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    const weekdayIndex = weekdays.indexOf(weekday);
    
    if (weekdayIndex === -1) return "";
    
    // Aktuelles Datum ermitteln
    const now = new Date();
    const year = now.getFullYear();
    
    // Montag der aktuellen Woche ermitteln
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = Sonntag, 1 = Montag, ...
    const diff = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1); 
    const mondayOfCurrentWeek = new Date(currentDate.setDate(diff));
    
    // Aktuelle Kalenderwoche ermitteln
    const currentWeek = this.getCurrentWeek();
    
    // Berechnen wie viele Wochen vor oder nach der aktuellen Woche
    const weekDiff = weekNumber - currentWeek;
    
    // Montag der gewünschten Woche ermitteln
    const targetMonday = new Date(mondayOfCurrentWeek);
    targetMonday.setDate(mondayOfCurrentWeek.getDate() + (weekDiff * 7));
    
    // Gewünschten Wochentag in der Zielwoche ermitteln
    const targetDate = new Date(targetMonday);
    targetDate.setDate(targetMonday.getDate() + weekdayIndex);
    
    // Formatieren zu DD.MM.YYYY
    return `${targetDate.getDate().toString().padStart(2, '0')}.${(targetDate.getMonth() + 1).toString().padStart(2, '0')}.${targetDate.getFullYear()}`;
  }

  // Heutiges Menü abrufen
  static async getTodaysMenu() {
    try {
      await ensureDirectoryExists();
      
      // Aktuelle Woche und Wochentag bestimmen
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sonntag, 1 = Montag, ...
      
      // Am Wochenende gibt es kein Mensaangebot
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return null;
      }
      
      const weekday = ["", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"][dayOfWeek];
      const weekNumber = this.getCurrentWeek();
      
      // Daten aus der JSON-Datei laden
      let mensaData;
      try {
        const data = await fs.readFile(mensaDataFile, 'utf8');
        mensaData = JSON.parse(data);
      } catch (error) {
        if (error.code === 'ENOENT') {
          // Datei existiert nicht, leere Daten zurückgeben
          return null;
        }
        throw error;
      }
      
      // Menü für die aktuelle Woche suchen
      const weeklyMenu = mensaData[weekNumber.toString()];
      if (!weeklyMenu) {
        return null;
      }
      
      // Menü für den aktuellen Tag suchen
      return weeklyMenu.find(menu => menu.tag === weekday) || null;
    } catch (error) {
      console.error('Fehler beim Abrufen des heutigen Menüs:', error);
      throw error;
    }
  }

  // Wochenplan abrufen
  static async getWeeklyMenu(weekNumber) {
    try {
      await ensureDirectoryExists();
      
      // Daten aus der JSON-Datei laden
      let mensaData;
      try {
        const data = await fs.readFile(mensaDataFile, 'utf8');
        mensaData = JSON.parse(data);
      } catch (error) {
        if (error.code === 'ENOENT') {
          // Datei existiert nicht, leere Daten zurückgeben
          return [];
        }
        throw error;
      }
      
      // Menü für die angegebene Woche suchen
      const weeklyMenu = mensaData[weekNumber.toString()];
      if (!weeklyMenu) {
        // Wenn kein Menü gefunden wurde, leere Daten mit korrekten Datumswerten zurückgeben
        return [
          { tag: "Montag", datum: this.getDateForWeekday("Montag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Dienstag", datum: this.getDateForWeekday("Dienstag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Mittwoch", datum: this.getDateForWeekday("Mittwoch", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Donnerstag", datum: this.getDateForWeekday("Donnerstag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Freitag", datum: this.getDateForWeekday("Freitag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" }
        ];
      }
      
      return weeklyMenu;
    } catch (error) {
      console.error(`Fehler beim Abrufen des Menüs für Woche ${weekNumber}:`, error);
      throw error;
    }
  }

  // Tagesmenü aktualisieren
  static async updateDayMenu(weekNumber, day, menuData) {
    try {
      await ensureDirectoryExists();
      
      // Daten aus der JSON-Datei laden
      let mensaData = {};
      try {
        const data = await fs.readFile(mensaDataFile, 'utf8');
        mensaData = JSON.parse(data);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
        // Falls die Datei nicht existiert, wird ein leeres Objekt verwendet
      }
      
      // Menü für die angegebene Woche initialisieren, falls nicht vorhanden
      if (!mensaData[weekNumber]) {
        mensaData[weekNumber] = [
          { tag: "Montag", datum: this.getDateForWeekday("Montag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Dienstag", datum: this.getDateForWeekday("Dienstag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Mittwoch", datum: this.getDateForWeekday("Mittwoch", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Donnerstag", datum: this.getDateForWeekday("Donnerstag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Freitag", datum: this.getDateForWeekday("Freitag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" }
        ];
      }
      
      // Menü für den angegebenen Tag aktualisieren
      const dayIndex = mensaData[weekNumber].findIndex(menu => menu.tag === day);
      if (dayIndex !== -1) {
        // Datum sicherstellen
        if (!menuData.datum) {
          menuData.datum = this.getDateForWeekday(day, weekNumber);
        }
        
        // Tag aktualisieren
        mensaData[weekNumber][dayIndex] = {
          ...mensaData[weekNumber][dayIndex],
          ...menuData
        };
      } else {
        // Falls der Tag noch nicht existiert, hinzufügen
        mensaData[weekNumber].push({
          tag: day,
          datum: menuData.datum || this.getDateForWeekday(day, weekNumber),
          hauptgericht: menuData.hauptgericht || "",
          vegetarisch: menuData.vegetarisch || "",
          beilage: menuData.beilage || "",
          nachtisch: menuData.nachtisch || "",
          preis: menuData.preis || "4,20 €"
        });
        
        // Nach Wochentagen sortieren
        const dayOrder = { "Montag": 1, "Dienstag": 2, "Mittwoch": 3, "Donnerstag": 4, "Freitag": 5 };
        mensaData[weekNumber].sort((a, b) => dayOrder[a.tag] - dayOrder[b.tag]);
      }
      
      // Aktualisierte Daten in die Datei schreiben
      await fs.writeFile(mensaDataFile, JSON.stringify(mensaData, null, 2), 'utf8');
      
      return mensaData[weekNumber][dayIndex !== -1 ? dayIndex : mensaData[weekNumber].length - 1];
    } catch (error) {
      console.error(`Fehler beim Aktualisieren des Menüs für Tag ${day}:`, error);
      throw error;
    }
  }

  // Wochenplan veröffentlichen
  static async publishWeeklyMenu(weekNumber, menuData) {
    try {
      await ensureDirectoryExists();
      
      // Daten aus der JSON-Datei laden
      let mensaData = {};
      try {
        const data = await fs.readFile(mensaDataFile, 'utf8');
        mensaData = JSON.parse(data);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
        // Falls die Datei nicht existiert, wird ein leeres Objekt verwendet
      }
      
      // Sicherstellen, dass alle Tage das korrekte Datum haben
      const updatedMenuData = menuData.map(dayMenu => ({
        ...dayMenu,
        datum: dayMenu.datum || this.getDateForWeekday(dayMenu.tag, weekNumber)
      }));
      
      // Menü für die angegebene Woche aktualisieren
      mensaData[weekNumber] = updatedMenuData;
      
      // Aktualisierte Daten in die Datei schreiben
      await fs.writeFile(mensaDataFile, JSON.stringify(mensaData, null, 2), 'utf8');
      
      return mensaData[weekNumber];
    } catch (error) {
      console.error(`Fehler beim Veröffentlichen des Wochenplans für Woche ${weekNumber}:`, error);
      throw error;
    }
  }
}

export default MensaModel;