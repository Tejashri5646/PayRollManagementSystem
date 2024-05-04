const mysql = require('mysql2');
const createCastTable = () =>{
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '#teju1357',
        database: 'payroll'
    });

    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS castCodes (
            code INT NOT NULL,
            name VARCHAR(255) NOT NULL
        )
    `;

    connection.query(createTableSQL, (err, results) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('Table created successfully');
        insertquery(connection); // Assuming insertquery is defined and exported properly
    });
}

const cast_codes = require('./castcodes');

  // SQL query to insert data into the table
  const insertquery = (connection) => {
    // SQL query to insert data into the table
    const remove = 'truncate table castCodes';
    connection.query(remove,(err,results) => {
        if (err) {
            console.error('Error inserting data into the table:', err);
            return;
        }
    })
    const sql = 'INSERT INTO castCodes (code, name) VALUES ?';

    // Data to be inserted
    const values = cast_codes.map(cast => [cast.code, cast.name]);

    // Execute the query
    connection.query(sql, [values], (err, results) => {
        if (err) {
            console.error('Error inserting data into the table:', err);
            return;
        }
        console.log('Data inserted successfully');
        console.log('Inserted rows:', results.affectedRows);
        
        // Close the connection
        // connection.end(); // You may or may not close the connection here depending on your use case
    });
};

module.exports = {createCastTable};
