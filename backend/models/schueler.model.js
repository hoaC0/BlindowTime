const db = require('../config/db.config');

class schuelerModel {
    static async getAllSchueler() {
        try {
            const [rows] = await db.query('SELECT * FROM schueler');
            return rows;
        } catch (error) {
            console.error('schuelerModel.getAllSchueler:', error);
            return [];
        }
    }
}

module.exports = schuelerModel;