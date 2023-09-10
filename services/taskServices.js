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

export { fetchTasksByuUser };