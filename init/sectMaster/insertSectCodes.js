const mysql = require('mysql2');
const createSectTable = () =>{
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '#teju1357',
        database: 'payroll'
    });

    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS sectCodes (
            code INT NOT NULL,
            name VARCHAR(255) NOT NULL
        )
    `;

    connection.query(createTableSQL, (err, results) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        
        insertquery(connection); // Assuming insertquery is defined and exported properly
    });
}

const sect_codes = require('./sectCodes');

  // SQL query to insert data into the table
  const insertquery = (connection) => {
    // SQL query to insert data into the table
    const remove = 'truncate table sectCodes';
    connection.query(remove,(err,results) => {
        if (err) {
            console.error('Error inserting data into the table:', err);
            return;
        }
    })
    const sql = 'INSERT INTO sectCodes (code, name) VALUES ?';

    // Data to be inserted
    const values = sect_codes.map(sect => [sect.code, sect.name]);

    // Execute the query
    connection.query(sql, [values], (err, results) => {
        if (err) {
            console.error('Error inserting data into the table:', err);
            return;
        }
       
        });
};

module.exports = {createSectTable};
