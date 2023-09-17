import pool from '../utils/database.js';

async function fetchTasksByuUser(id) {
    try{
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if(!error){
                    connection.connect();
                    const query = 'SELECT t.id, t.title, t.tags, t.description, t.deadline, t.status, u.username FROM tasks AS t INNER JOIN users AS u ON t.assigned_to = u.id WHERE assigned_to = ?';
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
                    const query = 'SELECT t.id, t.title, t.tags, t.description, t.deadline, t.status, u.username FROM tasks AS t INNER JOIN users AS u ON t.assigned_to = u.id';
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
                    const query = 'SELECT t.id, t.title, t.status, t.tags, t.description, t.deadline, u.username FROM tasks AS t INNER JOIN users AS u ON u.id = t.assigned_to ORDER BY id DESC LIMIT 1';
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
                    const query = 'INSERT INTO tasks(title, deadline, assigned_to, tags, description) VALUES(?,?,?,?,?)';
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

async function updateTask(task){
    try {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, connection){
                if(!err){
                    connection.connect();
                    connection.query( 'UPDATE tasks SET title = ?, deadline = ?, tags = ?, description = ?, status = ? WHERE id = ?', [task.title, task.deadline, task.tags, task.description, task.status, task.id], (error, result) => {
                        connection.release();
                        if(error){
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    throw err;
                }
            });
        });
    } catch (error) {
        console.log(error);
        throw error;
    };
}

async function updateStatus(id, status){
    try {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, connection){
                if(!err){
                    connection.connect();
                    connection.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id], (error, result)=>{
                        connection.release();
                        if(error){
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    })
                } else {
                    throw err;
                }
            });
        });
    } catch (error) {
        throw error;
    };
}

async function getStatsByUser(userid){
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(!err) {
                    connection.connect();
                    connection.query("SELECT SUM(CASE WHEN status = 'Assigned' THEN 1 ELSE 0 END) AS assigned, SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS inprogress, SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) AS done FROM tasks",[userid], (error, result) => {
                        connection.release();
                        if(error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    throw err;
                }
            });
        });
    } catch (error){
        throw error;
    }
}

async function getStatsAdmin(){
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(!err) {
                    connection.connect();
                    connection.query("SELECT SUM(CASE WHEN status = 'Assigned' THEN 1 ELSE 0 END) AS assigned, SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS inprogress, SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) AS done FROM tasks", (error, result) => {
                        connection.release();
                        if(error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    throw err;
                }
            });
        });
    } catch (error){
        throw error;
    }
}

export { fetchAllTasks, fetchTasksByuUser, fetchLastTasks, addNewTask, updateTask, updateStatus, getStatsByUser, getStatsAdmin };