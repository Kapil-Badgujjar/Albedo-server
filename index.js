import {} from 'dotenv/config'
import express from 'express';
import cors from 'cors';
import users from './router/users.js';
const server = express();
const port = 7171;

server.use(cors({
    origin: '*',
    credentials: true,
}))
server.use(express.json());
server.use('/users', users);
server.get('/', function(req, res){
    console.log('Server called');
    res.status(200).send({message: 'Server returned'});
})

server.listen(port, (err)=>{
    if(!err) console.log("server started on port " + port);
})
