const mysql = require('mysql2/promise');

async function fetchDetails(table, code) {
    try {
        const pool = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '#teju1357',
            database: 'payroll',

        });

        const query = 'SELECT * FROM ?? WHERE code = ?';
        const [rows] = await pool.query(query, [table, code]);
        console.log('Rows:', rows[0]);
        return rows;
    } catch (error) {
        console.error('Error in fetchDetails:', error);
        throw error;
    }
}

module.exports = fetchDetails;
