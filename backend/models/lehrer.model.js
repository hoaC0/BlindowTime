import db from '../config/db.config.js';

class LehrerModel {
    static async getAllLehrer() {
        try {
            const [rows] = await db.query('SELECT lehrer_id, vorname, nachname, email, krd, tel FROM lehrer ORDER BY nachname, vorname');
            return rows;
        } catch (error) {
            console.error('LehrerModel.getAllLehrer:', error);
            return [];
        }
    }

    static async getLehrerById(id) {
        try {
            const [rows] = await db.query('SELECT lehrer_id, vorname, nachname, email, krd, tel FROM lehrer WHERE lehrer_id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('LehrerModel.getLehrerById:', error);
            return null;
        }
    }

    static async createLehrer(lehrerData) {
        try {
            const { vorname, nachname, email, krd, tel } = lehrerData;
            const [result] = await db.query(
                'INSERT INTO lehrer (vorname, nachname, email, krd, tel) VALUES (?, ?, ?, ?, ?)',
                [vorname, nachname, email, krd, tel]
            );
            return result.insertId;
        } catch (error) {
            console.error('LehrerModel.createLehrer:', error);
            throw error;
        }
    }

    static async updateLehrer(id, lehrerData) {
        try {
            const { vorname, nachname, email, krd, tel } = lehrerData;
            const [result] = await db.query(
                'UPDATE lehrer SET vorname = ?, nachname = ?, email = ?, krd = ?, tel = ? WHERE lehrer_id = ?',
                [vorname, nachname, email, krd, tel, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('LehrerModel.updateLehrer:', error);
            throw error;
        }
    }

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