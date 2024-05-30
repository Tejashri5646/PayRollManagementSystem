const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    { username: 'user3', password: 'password3' },
    { username: 'user4', password: 'password4' }
];

const createUsersTableAndInsertUsers = async () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '#teju1357',
        database: 'payroll'
    });

    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `;

    connection.query(createTableSQL, async (err, results) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }

        console.log('Users table created or already exists.');

        const hashedUsers = await Promise.all(users.map(async user => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return [user.username, hashedPassword];
        }));

        const insertSQL = 'INSERT INTO Users (username, password) VALUES ?';
        
        connection.query('TRUNCATE TABLE Users', (err, results) => {
            if (err) {
                console.error('Error truncating table:', err);
                return;
            }

            connection.query(insertSQL, [hashedUsers], (err, results) => {
                if (err) {
                    console.error('Error inserting data into the table:', err);
                    return;
                }

                console.log('Users inserted successfully.');
                connection.end();
            });
        });
    });
};

module.exports = createUsersTableAndInsertUsers;
