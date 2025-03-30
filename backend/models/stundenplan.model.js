import db from '../config/db.config.js';

class StundenplanModel {
  // HOL DEN STUNDENPLAN FUER EINE KLASSE!
  // klassenmame = z.B. ITA25
  static async getStundenplanByKlasse(klassenName) {
    try {
      // tabelle = stundenplan + klassenname kleingeschrieben
      const tabellenName = `stundenplan${klassenName.toLowerCase()}`;
      
      // checken ob tabelle existiert (sql injection verhindern)
      const [tabellen] = await db.query(`SHOW TABLES LIKE ?`, [tabellenName]);
      
      if (tabellen.length === 0) {
        console.error(`Tabelle ${tabellenName} existiert nicht`);
        return [];
      }
      
      // stunden abrufen mit allen infos
      const [zeilen] = await db.query(`
        SELECT 
          s.id,
          s.stunde,
          s.zeit,
          -- Montag
          s.fach_mo,
          f_mo.name AS fach_mo_name,
          f_mo.farbe AS fach_mo_farbe,
          s.raum_mo,
          r_mo.nummer AS raum_mo_nummer,
          r_mo.name AS raum_mo_name,
          s.lehrer_mo,
          l_mo.vorname AS lehrer_mo_vorname,
          l_mo.nachname AS lehrer_mo_nachname,
          -- Dienstag
          s.fach_di,
          f_di.name AS fach_di_name,
          f_di.farbe AS fach_di_farbe,
          s.raum_di,
          r_di.nummer AS raum_di_nummer,
          r_di.name AS raum_di_name,
          s.lehrer_di,
          l_di.vorname AS lehrer_di_vorname,
          l_di.nachname AS lehrer_di_nachname,
          -- Mittwoch
          s.fach_mi,
          f_mi.name AS fach_mi_name,
          f_mi.farbe AS fach_mi_farbe,
          s.raum_mi,
          r_mi.nummer AS raum_mi_nummer,
          r_mi.name AS raum_mi_name,
          s.lehrer_mi,
          l_mi.vorname AS lehrer_mi_vorname,
          l_mi.nachname AS lehrer_mi_nachname,
          -- Donnerstag
          s.fach_do,
          f_do.name AS fach_do_name,
          f_do.farbe AS fach_do_farbe,
          s.raum_do,
          r_do.nummer AS raum_do_nummer,
          r_do.name AS raum_do_name,
          s.lehrer_do,
          l_do.vorname AS lehrer_do_vorname,
          l_do.nachname AS lehrer_do_nachname,
          -- Freitag
          s.fach_fr,
          f_fr.name AS fach_fr_name,
          f_fr.farbe AS fach_fr_farbe,
          s.raum_fr,
          r_fr.nummer AS raum_fr_nummer,
          r_fr.name AS raum_fr_name,
          s.lehrer_fr,
          l_fr.vorname AS lehrer_fr_vorname,
          l_fr.nachname AS lehrer_fr_nachname
        FROM 
          ${tabellenName} s
        LEFT JOIN faecher f_mo ON s.fach_mo = f_mo.fach_id
        LEFT JOIN raeume r_mo ON s.raum_mo = r_mo.raum_id
        LEFT JOIN lehrer l_mo ON s.lehrer_mo = l_mo.lehrer_id
        LEFT JOIN faecher f_di ON s.fach_di = f_di.fach_id
        LEFT JOIN raeume r_di ON s.raum_di = r_di.raum_id
        LEFT JOIN lehrer l_di ON s.lehrer_di = l_di.lehrer_id
        LEFT JOIN faecher f_mi ON s.fach_mi = f_mi.fach_id
        LEFT JOIN raeume r_mi ON s.raum_mi = r_mi.raum_id
        LEFT JOIN lehrer l_mi ON s.lehrer_mi = l_mi.lehrer_id
        LEFT JOIN faecher f_do ON s.fach_do = f_do.fach_id
        LEFT JOIN raeume r_do ON s.raum_do = r_do.raum_id
        LEFT JOIN lehrer l_do ON s.lehrer_do = l_do.lehrer_id
        LEFT JOIN faecher f_fr ON s.fach_fr = f_fr.fach_id
        LEFT JOIN raeume r_fr ON s.raum_fr = r_fr.raum_id
        LEFT JOIN lehrer l_fr ON s.lehrer_fr = l_fr.lehrer_id
        ORDER BY s.stunde
      `);
      
      return zeilen;
    } catch (error) {
      console.error(`Fehler beim Abrufen des Stundenplans für ${klassenName}:`, error);
      throw error;
    }
  }

  // alle klassen die stundenplan haben
  static async getAlleKlassen() {
    try {
      // alle stundenplantabellen in DB finden
      const [tabellen] = await db.query(`
        SHOW TABLES LIKE 'stundenplan%'
      `);
      
      // klassennamen extrahieren aus tabellennamen
      const klassen = tabellen.map(row => {
        const tabellenName = Object.values(row)[0];
        // z.B. "stundenplanita25" -> "ITA25"
        const klassenName = tabellenName.replace('stundenplan', '').toUpperCase();
        return { name: klassenName };
      });
      
      return klassen;
    } catch (error) {
      console.error('Fehler beim Abrufen der Klassen mit Stundenplänen:', error);
      throw error;
    }
  }
}

export default StundenplanModel;