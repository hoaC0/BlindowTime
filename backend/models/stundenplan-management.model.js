import db from '../config/db.config.js';

class StundenplanManagementModel {
  // gibt alle klassen zurueck
  static async getAllClasses() {
    try {
      const [rows] = await db.query('SELECT klassen_id, name FROM klassen ORDER BY name');
      return rows;
    } catch (error) {
      console.error('Fehler beim Abrufen der Klassen:', error);
      throw error;
    }
  }

  // LIEFERT ALLE FAECHER!!! inklusive farben usw
  static async getAllSubjects() {
    try {
      const [rows] = await db.query('SELECT fach_id, name, kurzname, farbe FROM faecher ORDER BY name');
      return rows;
    } catch (error) {
      console.error('Fehler beim Abrufen der Fächer:', error);
      throw error;
    }
  }

  // lehrer abrufen - brauchen wir fuer stundenplan
  static async getAllTeachers() {
    try {
      const [rows] = await db.query('SELECT lehrer_id, vorname, nachname, krzl FROM lehrer ORDER BY nachname, vorname');
      return rows;
    } catch (error) {
      console.error('Fehler beim Abrufen der Lehrer:', error);
      throw error;
    }
  }

  // hol alle raeume aus db
  static async getAllRooms() {
    try {
      const [rows] = await db.query('SELECT raum_id, nummer, name FROM raeume ORDER BY nummer');
      return rows;
    } catch (error) {
      console.error('Fehler beim Abrufen der Räume:', error);
      throw error;
    }
  }

  // stundenplan fuer klasse laden
  static async getScheduleForClass(klassenName) {
    try {
      // tabellenname: stundenplan + klassenname kleingeschrieben
      const tabellenName = `stundenplan${klassenName.toLowerCase()}`;
      
      // testen ob tabelle existiert
      const [tabellen] = await db.query(`SHOW TABLES LIKE ?`, [tabellenName]);
      
      if (tabellen.length === 0) {
        console.error(`Tabelle ${tabellenName} existiert nicht`);
        return [];
      }
      
      // stundenplan abrufen
      const [zeilen] = await db.query(`
        SELECT * FROM ${tabellenName} ORDER BY stunde
      `);
      
      return zeilen;
    } catch (error) {
      console.error(`Fehler beim Abrufen des Stundenplans für ${klassenName}:`, error);
      throw error;
    }
  }

  // unterricht hinzufuegen/aendern
  static async updateLesson(klassenName, stunde, tag, fachId, raumId, lehrerId) {
    try {
      const tabellenName = `stundenplan${klassenName.toLowerCase()}`;
      
      // check ob tabelle da ist
      const [tabellen] = await db.query(`SHOW TABLES LIKE ?`, [tabellenName]);
      
      if (tabellen.length === 0) {
        throw new Error(`Stundenplan für ${klassenName} existiert nicht`);
      }
      
      // alle werte aktualisieren je nach tag
      const fachField = `fach_${tag}`;
      const raumField = `raum_${tag}`;
      const lehrerField = `lehrer_${tag}`;
      
      // wenn null uebergeben wird setzen wir NULL in der DB
      const fachValue = fachId !== undefined && fachId !== null ? fachId : null;
      const raumValue = raumId !== undefined && raumId !== null ? raumId : null;
      const lehrerValue = lehrerId !== undefined && lehrerId !== null ? lehrerId : null;
      
      // SQL query generieren
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

  // del unterricht
  static async deleteLesson(klassenName, stunde, tag) {
    try {
      // wieder updateLesson aufrufen mit NULL werten
      return await this.updateLesson(klassenName, stunde, tag, null, null, null);
    } catch (error) {
      console.error('Fehler beim Löschen des Unterrichts:', error);
      throw error;
    }
  }
}

export default StundenplanManagementModel;