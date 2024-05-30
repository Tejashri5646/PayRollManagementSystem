async function getNextCode(connection, tableName) {
    return new Promise((resolve, reject) => {
        const query = `SELECT MAX(code) AS maxCode FROM ${tableName}`;
        connection.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            const maxCode = results[0].maxCode || 0;
            const nextCode = maxCode + 1;
            resolve(nextCode);
        });
    });
}

module.exports = { getNextCode };
