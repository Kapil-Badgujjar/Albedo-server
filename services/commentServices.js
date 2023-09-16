import pool from '../utils/database.js';

async function fetchComments(taskid) {
    console.log(taskid);
    try{
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if(!error){
                    connection.connect();
                    const query = 'SELECT c.id, c.comment, u.username FROM comments AS c INNER JOIN users AS u ON c.user_id = u.id WHERE task_id = ?';
                    connection.query(query, [taskid], (err, result) => {
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

async function saveComment(taskid, comment, userid) {
    console.log(taskid, comment, userid);
    try{
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(!err){
                    connection.connect();
                    connection.query("INSERT INTO comments(comment, task_id, user_id) VALUES (?, ?, ?)", [comment, taskid, userid], (error, result) => {
                        connection.release();
                        if(error) reject(error);
                        else resolve(result);
                    });
                } else {
                    reject(err);
                }
            });
        });
    }catch(error) {
        reject(error);
    }
}


export { fetchComments, saveComment };