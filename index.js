import {} from 'dotenv/config'
import express from 'express';
import cors from 'cors';
import users from './router/users.js';
import tasks from './router/tasks.js';
import comments from './router/comments.js';
import authenticateUser from './middlewares/authenticateMiddleware.js';
const server = express();
const port = process.env.SERVER_ADDRESS || 7171;

const allowedOrigins = [process.env.CLIENT_ADDRESS];

server.use(cors({
    origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    optionsSuccessStatus: 204,
}));

server.use(express.json());
server.use('/users', users);
server.use('/tasks', tasks);
server.use('/comments', comments);

server.get('/getuserdetails', authenticateUser, (req, res)=>{
    const data = { id: req.user.id, username: req.user.username, email_id: req.user.email_id, role: req.user.role}
    res.status(200).send({token: req.user.newToken|| undefined, data, message: 'Already logged in'});
});

server.listen(port, (err)=>{
    if(!err) console.log("server started on port " + port);
})
