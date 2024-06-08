const mysql = require('mysql2/promise');

async function fetchEmpInfo() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '#teju1357',
            database: 'payroll'
        });

        const sql = 'SELECT * FROM employeeInfo'; // Select all columns
        const [rows] = await connection.execute(sql);
        await connection.end();

        if (rows.length === 0) {
            console.log('No data found in the employeeInfo table');
            return [];
        }

        return rows;
    } catch (error) {
        console.error('Error fetching employee data:', error);
        throw error;
    }
}

module.exports = fetchEmpInfo;
