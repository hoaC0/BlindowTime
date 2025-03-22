import db from '../config/db.config.js';

class RaeumeModel {
    static async getAllRaeume() {
        try {
            const [rows] = await db.query('SELECT raum_id, nummer, name FROM raeume ORDER BY nummer');
            return rows;
        } catch (error) {
            console.error('RaeumeModel.getAllRaeume:', error);
            return [];
        }
    }

    static async getRaumById(id) {
        try {
            const [rows] = await db.query('SELECT raum_id, nummer, name FROM raeume WHERE raum_id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('RaeumeModel.getRaumById:', error);
            return null;
        }
    }

    static async createRaum(raumData) {
        try {
            const { nummer, name } = raumData;
            const [result] = await db.query(
                'INSERT INTO raeume (nummer, name) VALUES (?, ?)',
                [nummer, name]
            );
            return result.insertId;
        } catch (error) {
            console.error('RaeumeModel.createRaum:', error);
            throw error;
        }
    }

    static async updateRaum(id, raumData) {
        try {
            const { nummer, name } = raumData;
            const [result] = await db.query(
                'UPDATE raeume SET nummer = ?, name = ? WHERE raum_id = ?',
                [nummer, name, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('RaeumeModel.updateRaum:', error);
            throw error;
        }
    }

    static async deleteRaum(id) {
        try {
            const [result] = await db.query('DELETE FROM raeume WHERE raum_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('RaeumeModel.deleteRaum:', error);
            throw error;
        }
    }
}

export default RaeumeModel;