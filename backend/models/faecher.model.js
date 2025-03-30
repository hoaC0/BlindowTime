import db from '../config/db.config.js';

class FaecherModel {
    // ALLE FAECHER MIT FARBEN!!
    static async getAllFaecher() {
        try {
            const [rows] = await db.query('SELECT fach_id, name, kurzname, farbe FROM faecher ORDER BY name');
            return rows;
        } catch (error) {
            console.error('FaecherModel.getAllFaecher:', error);
            return [];
        }
    }

    // fach mit bestimmter id
    static async getFachById(id) {
        try {
            const [rows] = await db.query('SELECT fach_id, name, kurzname, farbe FROM faecher WHERE fach_id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('FaecherModel.getFachById:', error);
            return null;
        }
    }

    // erstellt ein neues fach
    // mit name, kurzname und farbe
    static async createFach(fachData) {
        try {
            const { name, kurzname, farbe } = fachData;
            const [result] = await db.query(
                'INSERT INTO faecher (name, kurzname, farbe) VALUES (?, ?, ?)',
                [name, kurzname, farbe]
            );
            return result.insertId;
        } catch (error) {
            console.error('FaecherModel.createFach:', error);
            throw error;
        }
    }

    // aendert fachdaten
    static async updateFach(id, fachData) {
        try {
            const { name, kurzname, farbe } = fachData;
            const [result] = await db.query(
                'UPDATE faecher SET name = ?, kurzname = ?, farbe = ? WHERE fach_id = ?',
                [name, kurzname, farbe, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('FaecherModel.updateFach:', error);
            throw error;
        }
    }

    // del fach
    static async deleteFach(id) {
        try {
            const [result] = await db.query('DELETE FROM faecher WHERE fach_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('FaecherModel.deleteFach:', error);
            throw error;
        }
    }
}

export default FaecherModel;