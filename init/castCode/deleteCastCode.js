const mysql = require('mysql2/promise');

// Function to delete a cast code from the database
async function deleteCastCode(code) {
    try {
        // Create a connection to the database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '#teju1357',
            database: 'payroll'
        });

        // SQL query to delete data from the castCodes table based on the code
        const sql = 'DELETE FROM castCodes WHERE code = ?';

        // Execute the query with the provided code
        const [result] = await connection.execute(sql, [code]);

        // Close the connection
        await connection.end();

        // Check if any row was affected (deleted)
        if (result.affectedRows === 0) {
            console.log(`Cast code ${code} not found`);
        } else {
            console.log(`Cast code ${code} deleted successfully`);
        }

        return result.affectedRows;
    } catch (error) {
        console.error('Error deleting cast code:', error);
        throw error;
    }
}

module.exports = deleteCastCode;
