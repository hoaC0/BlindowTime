import db from '../config/db.config.js';

class LehrerModel {
    // holt ALLE lehrer aus DB
    static async getAllLehrer() {
        try {
            const [rows] = await db.query('SELECT lehrer_id, vorname, nachname, email, krzl, tel FROM lehrer ORDER BY nachname, vorname');
            return rows;
        } catch (error) {
            console.error('LehrerModel.getAllLehrer:', error);
            return [];
        }
    }

    // findet lehrer nach id
    static async getLehrerById(id) {
        try {
            const [rows] = await db.query('SELECT lehrer_id, vorname, nachname, email, krzl, tel FROM lehrer WHERE lehrer_id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('LehrerModel.getLehrerById:', error);
            return null;
        }
    }

    // erstellt neuen lehrer
    // bekommt alle daten als objekt
    static async createLehrer(lehrerData) {
        try {
            const { vorname, nachname, email, krzl, tel } = lehrerData;
            const [result] = await db.query(
                'INSERT INTO lehrer (vorname, nachname, email, krzl, tel) VALUES (?, ?, ?, ?, ?)',
                [vorname, nachname, email, krzl, tel]
            );
            return result.insertId;
        } catch (error) {
            console.error('LehrerModel.createLehrer:', error);
            throw error;
        }
    }

    // aendert lehrerdaten in db
    static async updateLehrer(id, lehrerData) {
        try {
            const { vorname, nachname, email, krzl, tel } = lehrerData;
            const [result] = await db.query(
                'UPDATE lehrer SET vorname = ?, nachname = ?, email = ?, krzl = ?, tel = ? WHERE lehrer_id = ?',
                [vorname, nachname, email, krzl, tel, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('LehrerModel.updateLehrer:', error);
            throw error;
        }
    }

    // LOESCHT LEHRER!!!
    static async deleteLehrer(id) {
        try {
            const [result] = await db.query('DELETE FROM lehrer WHERE lehrer_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('LehrerModel.deleteLehrer:', error);
            throw error;
        }
    }
}

export default LehrerModel;