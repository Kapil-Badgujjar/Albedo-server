import pool from '../utils/database.js';

async function fetchTasksByuUser(id) {
    try{
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if(!error){
                    connection.connect();
                    const query = 'SELECT * FROM tasks WHERE assigned_to = ?';
                    connection.query(query, [id], (err, result) => {
                        connection.release();
                        if(err){
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    console.log(error);
                    resolve([]);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

async function fetchAllTasks(){
    try{
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if(!error){
                    connection.connect();
                    const query = 'SELECT * FROM tasks';
                    connection.query(query, (err, result) => {
                        connection.release();
                        if(err){
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    console.log(error);
                    resolve([]);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

async function fetchLastTasks(){
    try{
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if(!error){
                    connection.connect();
                    const query = 'SELECT * FROM tasks ORDER BY id DESC LIMIT 1';
                    connection.query(query, (err, result) => {
                        connection.release();
                        if(err){
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    console.log(error);
                    resolve([]);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

async function addNewTask(task) {
    try{
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if(!error){
                    connection.connect();
                    const query = 'INSERT INTO tasks(title, deadline, assigned_to, tag, description) VALUES(?,?,?,?,?)';
                    connection.query(query, [task.title, task.deadline, task.assignedTo, task.tags, task.description], (err, result) => {
                        connection.release();
                        if(err){
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    console.log(error);
                    resolve([]);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}
export { fetchAllTasks, fetchTasksByuUser, fetchLastTasks, addNewTask };