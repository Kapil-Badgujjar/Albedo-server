import pool from '../utils/database.js';

async function getUser(email_id, password) {
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err,connection) => {
                if(!err){
                    connection.connect();
                    const query = 'SELECT * FROM users WHERE email_id = ? AND password = ?';
                    connection.query(query, [email_id, password], (error, results) => {
                        connection.release();
                        if (error) {
                            reject(error);
                        } else {
                            if(results.length > 0)
                                resolve({status: true, user: results[0]});
                            else
                                resolve({status: false, user: undefined});
                        }
                    });
                } else {
                    throw err;
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

async function addUser(email_id, password, username){
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) =>{
                if(!err){
                    connection.connect();
                    const query = 'INSERT INTO users(email_id, password, username, role) VALUES(?, ?, ?, ?)';
                        connection.query(query, [email_id, password, username, "User"], (error, results) => {
                            connection.end();
                            if (error) {
                                reject(error);
                            } else {
                                resolve(results);
                            }
                        });
                    } else {
                        throw err;
                    }
                });
            });
    } catch (error) {
        throw error;
    }
}

async function editMyProfile(details){
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection)=>{
                if(!err) {
                    connection.connect();
                    const query = 'UPDATE users SET email_id = ?, password = ?, username = ? WHERE id = ?';
                    connection.query(query, [details.email_id, details.password, details.username, details.id], (error,results) => {
                        connection.end();
                        if(error){
                            console.log(error);
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                } else {
                    throw err;
                }
            });
        });
    } catch(error) {
        throw error;
    }
}

export { getUser, addUser, editMyProfile };
