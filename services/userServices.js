import connection from '../utils/database.js';

async function getUser(email, password) {
    try {
        const query = 'SELECT * FROM users WHERE email_id = ? AND password = ?';
        return new Promise((resolve, reject) => {
            connection.connect();
            connection.query(query, [email, password], (error, results) => {
                connection.end();
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

async function addUser(email, password, username){
    try {
        const query = 'INSERT INTO users(email_id, password, username, role) VALUES(?, ?, ?, ?)';
            return new Promise((resolve, reject) => {
                connection.connect();
                connection.query(query, [email, password, username, "User"], (error, results) => {
                    connection.end();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
    } catch (error) {
        throw error;
    }
}

export { getUser, addUser };
