const mysql = require('mysql2');
const createBranchTable = () =>{
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '#teju1357',
        database: 'payroll'
    });

    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS branchCodes (
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

const branch_codes = require('./branchCodes');

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
    const sql = 'INSERT INTO branchCodes (code, name) VALUES ?';

    // Data to be inserted
    const values = branch_codes.map(branch => [branch.code, branch.name]);

    // Execute the query
    connection.query(sql, [values], (err, results) => {
        if (err) {
            console.error('Error inserting data into the table:', err);
            return;
        }
       
        });
};

module.exports = {createBranchTable};
