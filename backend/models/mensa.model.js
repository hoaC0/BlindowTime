// backend/models/mensa.model.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// pfad zur json-datei fuer die mensadaten
const mensaDataDir = path.join(__dirname, '..', 'data');
const mensaDataFile = path.join(mensaDataDir, 'mensa.json');

// stellt sicher dass das verzeichnis existiert
const ensureDirectoryExists = async () => {
  try {
    await fs.access(mensaDataDir);
  } catch (error) {
    // verzeichnis existiert nicht, also erstellen
    await fs.mkdir(mensaDataDir, { recursive: true });
  }
};

class MensaModel {
  // aktuelle kalenderwoche berechnen
  static getCurrentWeek() {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    return Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  }

  // datum fuer einen wochentag
  static getDateForWeekday(weekday, weekNumber) {
    const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    const weekdayIndex = weekdays.indexOf(weekday);
    
    if (weekdayIndex === -1) return "";
    
    // aktuelles datum ermitteln
    const now = new Date();
    const year = now.getFullYear();
    
    // montag der aktuellen woche
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = sonntag, 1 = montag, ...
    const diff = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1); 
    const mondayOfCurrentWeek = new Date(currentDate.setDate(diff));
    
    // aktuelle kalenderwoche
    const currentWeek = this.getCurrentWeek();
    
    // berechnen wieviele wochen vor/nach aktueller
    const weekDiff = weekNumber - currentWeek;
    
    // montag der gewuenschten woche
    const targetMonday = new Date(mondayOfCurrentWeek);
    targetMonday.setDate(mondayOfCurrentWeek.getDate() + (weekDiff * 7));
    
    // gewuenschten wochentag ermitteln
    const targetDate = new Date(targetMonday);
    targetDate.setDate(targetMonday.getDate() + weekdayIndex);
    
    // formatieren zu DD.MM.YYYY
    return `${targetDate.getDate().toString().padStart(2, '0')}.${(targetDate.getMonth() + 1).toString().padStart(2, '0')}.${targetDate.getFullYear()}`;
  }

  // heutiges menue
  static async getTodaysMenu() {
    try {
      await ensureDirectoryExists();
      
      // aktuelle woche und wochentag
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = sonntag, 1 = montag
      
      // wochenende? kein angebot
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return null;
      }
      
      const weekday = ["", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"][dayOfWeek];
      const weekNumber = this.getCurrentWeek();
      
      // aus json laden
      let mensaData;
      try {
        const data = await fs.readFile(mensaDataFile, 'utf8');
        mensaData = JSON.parse(data);
      } catch (error) {
        if (error.code === 'ENOENT') {
          // keine datei, leere daten
          return null;
        }
        throw error;
      }
      
      // menue fuer aktuelle woche suchen
      const weeklyMenu = mensaData[weekNumber.toString()];
      if (!weeklyMenu) {
        return null;
      }
      
      // menue fuer aktuellen tag suchen
      return weeklyMenu.find(menu => menu.tag === weekday) || null;
    } catch (error) {
      console.error('fehler beim abrufen des heutigen menues:', error);
      throw error;
    }
  }

  // wochenplan abrufen
  static async getWeeklyMenu(weekNumber) {
    try {
      await ensureDirectoryExists();
      
      // daten aus json laden
      let mensaData;
      try {
        const data = await fs.readFile(mensaDataFile, 'utf8');
        mensaData = JSON.parse(data);
      } catch (error) {
        if (error.code === 'ENOENT') {
          // datei existiert nicht, leere daten
          return [];
        }
        throw error;
      }
      
      // menue fuer woche suchen
      const weeklyMenu = mensaData[weekNumber.toString()];
      if (!weeklyMenu) {
        // wenn kein menue gefunden, leere daten mit datum
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
      console.error(`fehler beim abrufen des menues fuer woche ${weekNumber}:`, error);
      throw error;
    }
  }

  // tagesmenue aktualisieren
  static async updateDayMenu(weekNumber, day, menuData) {
    try {
      await ensureDirectoryExists();
      
      // daten aus json laden
      let mensaData = {};
      try {
        const data = await fs.readFile(mensaDataFile, 'utf8');
        mensaData = JSON.parse(data);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
        // falls datei nicht existiert, leeres objekt
      }
      
      // menue fuer woche erstellen wenn nicht vorhanden
      if (!mensaData[weekNumber]) {
        mensaData[weekNumber] = [
          { tag: "Montag", datum: this.getDateForWeekday("Montag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Dienstag", datum: this.getDateForWeekday("Dienstag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Mittwoch", datum: this.getDateForWeekday("Mittwoch", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Donnerstag", datum: this.getDateForWeekday("Donnerstag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" },
          { tag: "Freitag", datum: this.getDateForWeekday("Freitag", weekNumber), hauptgericht: "", vegetarisch: "", beilage: "", nachtisch: "", preis: "4,20 €" }
        ];
      }
      
      // menue fuer tag aktualisieren
      const dayIndex = mensaData[weekNumber].findIndex(menu => menu.tag === day);
      if (dayIndex !== -1) {
        // datum sicherstellen
        if (!menuData.datum) {
          menuData.datum = this.getDateForWeekday(day, weekNumber);
        }
        
        // tag aktualisieren
        mensaData[weekNumber][dayIndex] = {
          ...mensaData[weekNumber][dayIndex],
          ...menuData
        };
      } else {
        // falls tag nicht existiert, hinzufuegen
        mensaData[weekNumber].push({
          tag: day,
          datum: menuData.datum || this.getDateForWeekday(day, weekNumber),
          hauptgericht: menuData.hauptgericht || "",
          vegetarisch: menuData.vegetarisch || "",
          beilage: menuData.beilage || "",
          nachtisch: menuData.nachtisch || "",
          preis: menuData.preis || "4,20 €"
        });
        
        // nach wochentagen sortieren
        const dayOrder = { "Montag": 1, "Dienstag": 2, "Mittwoch": 3, "Donnerstag": 4, "Freitag": 5 };
        mensaData[weekNumber].sort((a, b) => dayOrder[a.tag] - dayOrder[b.tag]);
      }
      
      // aktualisierte daten speichern
      await fs.writeFile(mensaDataFile, JSON.stringify(mensaData, null, 2), 'utf8');
      
      return mensaData[weekNumber][dayIndex !== -1 ? dayIndex : mensaData[weekNumber].length - 1];
    } catch (error) {
      console.error(`fehler beim aktualisieren des menues fuer tag ${day}:`, error);
      throw error;
    }
  }

  // wochenplan veroeffentlichen
  static async publishWeeklyMenu(weekNumber, menuData) {
    try {
      await ensureDirectoryExists();
      
      // daten aus json laden
      let mensaData = {};
      try {
        const data = await fs.readFile(mensaDataFile, 'utf8');
        mensaData = JSON.parse(data);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
        // falls datei nicht existiert leeres objekt
      }
      
      // daten fuer alle tage sicherstellen mit datum
      const updatedMenuData = menuData.map(dayMenu => ({
        ...dayMenu,
        datum: dayMenu.datum || this.getDateForWeekday(dayMenu.tag, weekNumber)
      }));
      
      // menue fuer woche aktualisieren
      mensaData[weekNumber] = updatedMenuData;
      
      // aktualisierten daten speichern
      await fs.writeFile(mensaDataFile, JSON.stringify(mensaData, null, 2), 'utf8');
      
      return mensaData[weekNumber];
    } catch (error) {
      console.error(`fehler beim veroeffentlichen des wochenplans fuer woche ${weekNumber}:`, error);
      throw error;
    }
  }
}

export default MensaModel;