const mysql = require('mysql2/promise'); // Import the promise-based version of mysql2

async function fetchGradCodes() {
    try {
        // Create a connection to the database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '#teju1357',
            database: 'payroll'
        });

        // SQL query to select data from the castCodes table
        const sql = 'SELECT code, name FROM gradCodes';

        // Execute the query
        const [rows] = await connection.execute(sql);

        // Close the connection
        await connection.end();

        // Check if the query returned any rows
        if (rows.length === 0) {
            console.log('No data found in the gradCodes table');
            return [];
        }

        // Map the rows into an iterable object
        const gradCodes = {};
        rows.forEach(row => {
            gradCodes[row.code] = row.name;
        });

        return gradCodes;
    } catch (error) {
        console.error('Error fetching cast codes:', error);
        throw error;
    }
}

module.exports = fetchGradCodes;
