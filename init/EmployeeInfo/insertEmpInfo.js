// createEmpInfo.js
const mysql = require('mysql2');

const createEmpInfoTable = () => {
    const connection = mysql.createConnection({
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

    connection.query(createTableSQL, (err, results) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        
        insertEmpInfo(connection); // Assuming insertEmpInfoData is defined and exported properly
    });
}

// insertEmployeeInfo.js

const employee_info = require('./empInfo');

async function insertEmpInfo(connection) {
    try {
        const remove = 'truncate table employeeInfo';
        connection.query(remove,(err,results) => {
            if (err) {
                console.error('Error inserting data into the table:', err);
                return;
            }
        })

        const sql = 'INSERT INTO employeeInfo (eCode, eName, Type, gradCode, sectCode, branchCode, joiningDate, permDate, basic, ptDed, corrAddress, permAddress, FatherName, FAddress, Caste, Gender, bDay, IdentityMark, KnownLang, Education, BloodGrp, Mothertongue) VALUES ?';

        const values = employee_info.map(employee => [
            employee.eCode, employee.eName, employee.Type, employee.gradCode, employee.sectCode,
            employee.branchCode, employee.joiningDate, employee.permDate, employee.basic, employee.ptDed,
            employee.corrAddress, employee.permAddress, employee.FatherName, employee.FAddress,
            employee.Caste, employee.Gender, employee.bDay, employee.IdentityMark, employee.KnownLang,
            employee.Education, employee.BloodGrp, employee.Mothertongue
        ]);

        await connection.query(sql, [values]);
        console.log('Employee data inserted successfully');
    } catch (error) {
        console.error('Error inserting employee data:', error);
        throw error;
    }
}

module.exports = createEmpInfoTable;

