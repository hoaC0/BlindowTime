import db from '../config/db.config.js';

class SchuelerModel {
    static async getAllSchueler() {
        try {
            // klasse_id fuer db schema 
            const [rows] = await db.query('SELECT schueler_id, vorname, nachname, geburtsdatum, klasse_id, adresse, tel, email FROM schueler ORDER BY nachname, vorname');
            return rows;
        } catch (error) {
            console.error('SchuelerModel.getAllSchueler:', error);
            return [];
        }
    }

    static async getSchuelerById(id) {
        try {
            const [rows] = await db.query('SELECT schueler_id, vorname, nachname, geburtsdatum, klasse_id, adresse, tel, email FROM schueler WHERE schueler_id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('SchuelerModel.getSchuelerById:', error);
            return null;
        }
    }

    // ALLE SCHUELER EINER KLASSE!
    static async getSchuelerByKlasse(klassenId) {
        try {
            const [rows] = await db.query('SELECT schueler_id, vorname, nachname, geburtsdatum, klasse_id, adresse, tel, email FROM schueler WHERE klasse_id = ? ORDER BY nachname, vorname', [klassenId]);
            return rows;
        } catch (error) {
            console.error('SchuelerModel.getSchuelerByKlasse:', error);
            return [];
        }
    }

    // erstelle neuen schueler mit allen daten
    static async createSchueler(schuelerData) {
        try {
            const { vorname, nachname, geburtsdatum, klasse_id, adresse, tel, email } = schuelerData;
            const [result] = await db.query(
                'INSERT INTO schueler (vorname, nachname, geburtsdatum, klasse_id, adresse, tel, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [vorname, nachname, geburtsdatum, klasse_id, adresse, tel, email]
            );
            return result.insertId;
        } catch (error) {
            console.error('SchuelerModel.createSchueler:', error);
            throw error;
        }
    }

    // schueler update
    static async updateSchueler(id, schuelerData) {
        try {
            const { vorname, nachname, geburtsdatum, klasse_id, adresse, tel, email } = schuelerData;
            const [result] = await db.query(
                'UPDATE schueler SET vorname = ?, nachname = ?, geburtsdatum = ?, klasse_id = ?, adresse = ?, tel = ?, email = ? WHERE schueler_id = ?',
                [vorname, nachname, geburtsdatum, klasse_id, adresse, tel, email, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('SchuelerModel.updateSchueler:', error);
            throw error;
        }
    }

    // SCHUELER LOESCHEN!
    static async deleteSchueler(id) {
        try {
            const [result] = await db.query('DELETE FROM schueler WHERE schueler_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('SchuelerModel.deleteSchueler:', error);
            throw error;
        }
    }

    // hol alle klassen
    static async getAllKlassen() {
        try {
            const [rows] = await db.query('SELECT * FROM klassen ORDER BY klassen_id');
            return rows;
        } catch (error) {
            console.error('SchuelerModel.getAllKlassen:', error);
            return [];
        }
    }
}

export default SchuelerModel;