import {} from 'dotenv/config'
import express from 'express';
import cors from 'cors';
import users from './router/users.js';
import tasks from './router/tasks.js';
import comments from './router/comments.js';
const server = express();
const port = 7171;
server.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
server.use(express.json());
server.use('/users', users);
server.use('/tasks', tasks);
server.use('/comments', comments);
server.listen(port, (err)=>{
    if(!err) console.log("server started on port " + port);
})
