// createEmpInfo.js
const mysql = require('mysql2/promise');

const createEmpInfoTable = async () => {
    try {
        // Create a connection using the promise-based API
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '#teju1357',
            database: 'payroll'
        });

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
                corrAddress VARCHAR(255) NOT NULL,
                permAddress VARCHAR(255) NOT NULL,
                FatherName VARCHAR(255) NOT NULL,
                FAddress VARCHAR(255) NOT NULL,
                Caste VARCHAR(255) NOT NULL,
                Gender VARCHAR(255) NOT NULL,
                bDay DATE NOT NULL,
                IdentityMark VARCHAR(255) NOT NULL,
                KnownLang VARCHAR(255) NOT NULL,
                Education VARCHAR(255) NOT NULL,
                BloodGrp VARCHAR(255) NOT NULL,
                Mothertongue VARCHAR(255) NOT NULL
            )
        `;

        // Execute the create table query using the promise-based API
        await connection.execute(createTableSQL);

        // Call the insertquery function
        await insertquery(connection,employee_info);

        // Close the connection
        await connection.end();
    } catch (error) {
        console.error('Error creating table and inserting data:', error);
        throw error;
    }
}
// Export the createEmpInfoTable function

// insertEmployeeInfo.js



// const insertquery = async (connection) => {
//     try {
//         // SQL query to truncate table before inserting new data
//         const remove = 'TRUNCATE TABLE employeeInfo';
//         await connection.execute(remove);

//         // SQL query to insert data into the table
//         const sql = 'INSERT INTO employeeInfo (eCode, eName, Type, gradCode, sectCode, branchCode, joiningDate, permDate, basic, ptDed, corrAddress, permAddress, FatherName, FAddress, Caste, Gender, bDay, IdentityMark, KnownLang, Education, BloodGrp, Mothertongue) VALUES ?';

//         // Data to be inserted
//         const values = employee_info.map(employee => [
//             employee.eCode, employee.eName, employee.Type, employee.gradCode, employee.sectCode,
//             employee.branchCode, employee.joiningDate, employee.permDate, employee.basic, employee.ptDed,
//             employee.corrAddress, employee.permAddress, employee.FatherName, employee.FAddress,
//             employee.Caste, employee.Gender, employee.bDay, employee.IdentityMark, employee.KnownLang,
//             employee.Education, employee.BloodGrp, employee.Mothertongue
//         ]);

//         // Execute the insert query using the promise-based API
//         await connection.execute(sql, [values]);

//         console.log('Data inserted successfully');
//     } catch (error) {
//         console.error('Error inserting data into the table:', error);
//         throw error;
//     }
// };

const employee_info = require('./empInfo.js');
const insertquery = async (connection, employee_info) => {
    if (!employee_info || !employee_info.length) {
        console.error('No data provided to insert');
        return;
    }

    const remove = 'TRUNCATE TABLE employeeInfo';
    await connection.execute(remove);

    
    const columns = [
        'eCode', 'eName', 'Type', 'gradCode', 'sectCode', 'branchCode', 'joiningDate',
        'permDate', 'basic', 'ptDed', 'corrAddress', 'permAddress', 'FatherName', 'FAddress',
        'Caste', 'Gender', 'bDay', 'IdentityMark', 'KnownLang', 'Education', 'BloodGrp', 'Mothertongue'
    ];

    const placeholders = employee_info.map(() => `(${columns.map(() => '?').join(', ')})`).join(', ');

    const sql = `INSERT INTO employeeInfo (${columns.join(', ')}) VALUES ${placeholders}`;

    const values = employee_info.flatMap(employee => [
        employee.eCode, employee.eName, employee.Type, employee.gradCode, employee.sectCode,
        employee.branchCode, employee.joiningDate, employee.permDate, employee.basic, employee.ptDed,
        employee.corrAddress, employee.permAddress, employee.FatherName, employee.FAddress,
        employee.Caste, employee.Gender, employee.bDay, employee.IdentityMark, employee.KnownLang,
        employee.Education, employee.BloodGrp, employee.Mothertongue
    ]);
    
    try {
        const [results] = await connection.execute(sql, values);
        
    } catch (error) {
        console.error('Error inserting data into the table:', error);
    }
};

// Export the insertquery function
module.exports = { createEmpInfoTable };