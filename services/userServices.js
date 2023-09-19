import pool from '../utils/database.js';
import bcrypt from "bcrypt";

async function getAllUsers() {
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err,connection) => {
                if(!err){
                    connection.connect();
                    const query = "select u.id, u.email_id, u.username, u.role, sum(case when t.status = 'Assigned' then 1 else 0 end) as assigned, sum(case when t.status = 'In Progress' then 1 else 0 end) as inprogress, sum(case when t.status = 'Done' then 1 else 0 end) as done from users as u left join tasks as t on u.id = t.assigned_to group by u.id";
                    connection.query(query, (error, results) => {
                        connection.release();
                        if (error) {
                            reject(error);
                        } else {
                            if(results.length > 0)
                                resolve({status: true, users: results});
                            else
                                resolve({status: false, users: undefined});
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

async function getUser(email_id, password) {
    try {
        return new Promise(async (resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (!err) {
                    connection.connect();
                    const query = 'SELECT * FROM users WHERE email_id = ?';
                    connection.query(query, [email_id], async (error, results) => {
                        connection.release();
                        if (error) {
                            reject(error);
                        } else {
                            if (results.length > 0) {
                                const user = results[0];
                                const passwordMatch = await bcrypt.compare(password, user.password);
                                if (passwordMatch) {
                                    resolve({ status: true, user });
                                } else {
                                    resolve({ status: false, user: undefined });
                                }
                            } else {
                                resolve({ status: false, user: undefined });
                            }
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

async function getUserById(id){
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection)=>{
                if(!err) {
                    connection.connect();
                    const query = 'SELECT id, email_id, username, role FROM users WHERE id = ?';
                    connection.query(query, [id], (error,results) => {
                        connection.release();
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

async function addUser(email_id, password, username){

    const hashedPassword = await bcrypt.hash(password, 10); 
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) =>{
                if(!err){
                    connection.connect();
                    const query = 'INSERT INTO users(email_id, password, username, role) VALUES(?, ?, ?, ?)';
                    connection.query(query, [email_id, hashedPassword, username, "User"], (error, results) => {
                        connection.release();
                        if (error) {
                            // console.log(error);
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                } else {
                    throw err;
                }
            });
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function editMyProfile(id, username, email_id){
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection)=>{
                if(!err) {
                    connection.connect();
                    const query = 'UPDATE users SET email_id = ?, username = ? WHERE id = ?';
                    connection.query(query, [email_id, username, id], (error,results) => {
                        connection.release();
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

async function updateMyPassword(id, password) {
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection)=>{
                if(!err) {
                    connection.connect();
                    const query = 'UPDATE users SET password = ? WHERE id = ?';
                    connection.query(query, [password, id], (error,results) => {
                        connection.release();
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

async function updateUserRole(id, role){
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection)=>{
                if(!err) {
                    connection.connect();
                    const query = 'UPDATE users SET role = ? WHERE id = ?';
                    connection.query(query, [role,id], (error,results) => {
                        connection.release();
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

async function getEmail(id){
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection)=>{
                if(!err) {
                    connection.connect();
                    const query = 'SELECT email_id FROM users WHERE id = ?';
                    connection.query(query, [id], (error,results) => {
                        connection.release();
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
export { getAllUsers, getUser, getUserById, addUser, editMyProfile, updateMyPassword, updateUserRole, getEmail };
