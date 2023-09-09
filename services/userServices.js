import connection from '../utils/database.js';

async function getUser(email_id, password) {
    try {
        const query = 'SELECT * FROM users WHERE email_id = ? AND password = ?';
        return new Promise((resolve, reject) => {
            connection.connect();
            connection.query(query, [email_id, password], (error, results) => {
                connection.end();
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

async function addUser(email_id, password, username){
    try {
        const query = 'INSERT INTO users(email_id, password, username, role) VALUES(?, ?, ?, ?)';
            return new Promise((resolve, reject) => {
                connection.connect();
                connection.query(query, [email_id, password, username, "User"], (error, results) => {
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

async function editMyProfile(details){
    try {
        const query = 'UPDATE users SET email_id = ?, password = ?, username = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            connection.connect();
            connection.query(query, [details.email_id, details.password, details.username, details.id], (error,results) => {
                connection.end();
                if(error){
                    console.log(error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    } catch(error) {
        throw error;
    }
}

export { getUser, addUser, editMyProfile };
