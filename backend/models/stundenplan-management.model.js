// backend/models/stundenplan-management.model.js
import db from '../config/db.config.js';

class StundenplanManagementModel {
  // Alle Klassen abrufen
  static async getAllClasses() {
    try {
      const [rows] = await db.query('SELECT klassen_id, name FROM klassen ORDER BY name');
      return rows;
    } catch (error) {
      console.error('Fehler beim Abrufen der Klassen:', error);
      throw error;
    }
  }

  // Alle Fächer abrufen
  static async getAllSubjects() {
    try {
      const [rows] = await db.query('SELECT fach_id, name, kurzname, farbe FROM faecher ORDER BY name');
      return rows;
    } catch (error) {
      console.error('Fehler beim Abrufen der Fächer:', error);
      throw error;
    }
  }

  // Alle Lehrer abrufen
  static async getAllTeachers() {
    try {
      const [rows] = await db.query('SELECT lehrer_id, vorname, nachname, krzl FROM lehrer ORDER BY nachname, vorname');
      return rows;
    } catch (error) {
      console.error('Fehler beim Abrufen der Lehrer:', error);
      throw error;
    }
  }

  // Alle Räume abrufen
  static async getAllRooms() {
    try {
      const [rows] = await db.query('SELECT raum_id, nummer, name FROM raeume ORDER BY nummer');
      return rows;
    } catch (error) {
      console.error('Fehler beim Abrufen der Räume:', error);
      throw error;
    }
  }

  // Stundenplan für eine bestimmte Klasse abrufen
  static async getScheduleForClass(klassenName) {
    try {
      // Tabellenname ermitteln (stundenplan + klassenname in Kleinbuchstaben)
      const tabellenName = `stundenplan${klassenName.toLowerCase()}`;
      
      // Überprüfen, ob die Tabelle existiert
      const [tabellen] = await db.query(`SHOW TABLES LIKE ?`, [tabellenName]);
      
      if (tabellen.length === 0) {
        console.error(`Tabelle ${tabellenName} existiert nicht`);
        return [];
      }
      
      // Stundenplan-Daten abrufen
      const [zeilen] = await db.query(`
        SELECT * FROM ${tabellenName} ORDER BY stunde
      `);
      
      return zeilen;
    } catch (error) {
      console.error(`Fehler beim Abrufen des Stundenplans für ${klassenName}:`, error);
      throw error;
    }
  }

  // Unterricht aktualisieren oder hinzufügen
  static async updateLesson(klassenName, stunde, tag, fachId, raumId, lehrerId) {
    try {
      const tabellenName = `stundenplan${klassenName.toLowerCase()}`;
      
      // Überprüfen, ob die Tabelle existiert
      const [tabellen] = await db.query(`SHOW TABLES LIKE ?`, [tabellenName]);
      
      if (tabellen.length === 0) {
        throw new Error(`Stundenplan für ${klassenName} existiert nicht`);
      }
      
      // Aktualisiere die entsprechenden Felder basierend auf dem Tag
      const fachField = `fach_${tag}`;
      const raumField = `raum_${tag}`;
      const lehrerField = `lehrer_${tag}`;
      
      // Falls null oder undefined übergeben wird, setze explizit NULL in der Datenbank
      const fachValue = fachId !== undefined && fachId !== null ? fachId : null;
      const raumValue = raumId !== undefined && raumId !== null ? raumId : null;
      const lehrerValue = lehrerId !== undefined && lehrerId !== null ? lehrerId : null;
      
      // SQL-Statement mit Platzhaltern für die Werte
      const query = `
        UPDATE ${tabellenName} 
        SET ${fachField} = ?, ${raumField} = ?, ${lehrerField} = ?
        WHERE stunde = ?
      `;
      
      const [result] = await db.query(query, [fachValue, raumValue, lehrerValue, stunde]);
      
      return {
        affectedRows: result.affectedRows,
        klassenName,
        stunde,
        tag,
        updated: {
          fach: fachValue,
          raum: raumValue,
          lehrer: lehrerValue
        }
      };
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Unterrichts:', error);
      throw error;
    }
  }

  // Unterricht löschen (auf NULL setzen)
  static async deleteLesson(klassenName, stunde, tag) {
    try {
      // Ruf einfach updateLesson mit NULL-Werten auf
      return await this.updateLesson(klassenName, stunde, tag, null, null, null);
    } catch (error) {
      console.error('Fehler beim Löschen des Unterrichts:', error);
      throw error;
    }
  }
}

export default StundenplanManagementModel;