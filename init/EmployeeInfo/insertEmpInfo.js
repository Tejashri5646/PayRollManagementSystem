const mysql = require('mysql2/promise');
const employee_info = require('./empInfo.js');

const createEmpInfoTable = async () => {
    try {
        // Create a connection using the promise-based API
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '#teju1357',
            database: 'payroll'
        });

        // Create the employeeInfo table if it doesn't exist
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS employeeInfo (
                eCode INT NOT NULL,
                eName VARCHAR(255) NOT NULL,
                Type VARCHAR(255) NOT NULL,
                gradCode INT NOT NULL,
                sectCode INT NOT NULL,
                branchCode INT NOT NULL,
                joiningDate DATE NOT NULL,
                permDate DATE NOT NULL,
                basic INT NOT NULL,
                ptDed VARCHAR(255) NOT NULL,
                corrAddress TEXT NOT NULL, -- Use TEXT type for longer text like addresses
                permAddress TEXT NOT NULL,
                FatherName VARCHAR(255) NOT NULL,
                Caste VARCHAR(255) NOT NULL,
                Gender VARCHAR(255) NOT NULL,
                bDay DATE NOT NULL,
                 IdentityMark VARCHAR(255) NOT NULL,
                KnownLang VARCHAR(255) NOT NULL,
                Education VARCHAR(255) NOT NULL,
                BloodGrp VARCHAR(255) NOT NULL,
                Mothertongue VARCHAR(255) NOT NULL,
                PRIMARY KEY (eCode)
            )
        `;
        await connection.execute(createTableSQL);

        // Truncate the table before inserting new data
        const removeDataSQL = 'TRUNCATE TABLE employeeInfo';
        await connection.execute(removeDataSQL);

        // Prepare the insert query
        const insertQuery = `
            INSERT INTO employeeInfo (
                eCode, eName, Type, gradCode, sectCode, branchCode, joiningDate,
                permDate, basic, ptDed, corrAddress, permAddress, FatherName, 
                Caste, Gender, bDay, IdentityMark, KnownLang, Education, BloodGrp, Mothertongue
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Insert data into the table
        for (const employee of employee_info) {
            await connection.execute(insertQuery, [
                employee.eCode, employee.eName, employee.Type, employee.gradCode, employee.sectCode,
                employee.branchCode, employee.joiningDate, employee.permDate, employee.basic,
                employee.ptDed ? 1 : 0, employee.corrAddress, employee.permAddress,
                employee.FatherName, employee.Caste, employee.Gender,
                employee.bDay, employee.IdentityMark, employee.KnownLang, employee.Education,
                employee.BloodGrp, employee.Mothertongue
            ]);
        }

        console.log('Table created and data inserted successfully');

        // Close the connection
        await connection.end();
    } catch (error) {
        console.error('Error creating table and inserting data:', error);
    }
};


// Export the insertquery function
module.exports = { createEmpInfoTable };