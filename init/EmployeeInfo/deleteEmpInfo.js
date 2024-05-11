const mysql = require('mysql2/promise');

async function deleteEmpInfo(eCode) {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '#teju1357',
            database: 'payroll'
        });

        const sql = 'DELETE FROM employeeInfo WHERE eCode = ?';
        const [result] = await connection.execute(sql, [eCode]);
        await connection.end();

        if (result.affectedRows === 0) {
            console.log(`Employee with code ${eCode} not found`);
        } else {
            console.log(`Employee with code ${eCode} deleted successfully`);
        }

        return result.affectedRows;
    } catch (error) {
        console.error('Error deleting employee data:', error);
        throw error;
    }
}

module.exports = deleteEmpInfo;
