const mysql = require('mysql2');

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
module.exports = insertquery;
