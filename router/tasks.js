import {} from 'dotenv/config'
import express from 'express';
import authenticateUser from '../middlewares/authenticateMiddleware.js';
import { fetchAllTasks, fetchTasksByuUser, fetchLastTasks, addNewTask } from '../services/taskServices.js';
const router = express.Router();

router.route('/fetchtasks').get(authenticateUser, async (req,res)=>{
    try{
        const tasks = (req.user.role === 'Admin' ? await fetchAllTasks() :  await fetchTasksByuUser(req.user.id));
        if(tasks.length > 0) {
            res.status(200).send(tasks);
        }
        else {
            res.status(200).send([]);
        }
    } catch(error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});

router.route('/fetchlasttasks').get(authenticateUser, async (req,res)=>{
    try{
        const tasks = await fetchLastTasks();
        if(tasks.length > 0) {
            res.status(200).send(tasks);
        }
        else {
            res.status(200).send([]);
        }
    } catch(error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});

router.route('/addnewtask').post(authenticateUser, async (req, res) => {
    if(req.user.role !== 'Admin') return res.status(403).send({message: 'You are not allowed to add new tasks'});
    try{
        const response = await addNewTask(req.body);
        console.log(response)
        res.status(200).send({message: 'task added successfully'});
    } catch(err){
        console.log(err);
        res.status(500).send({message: err.message});
    }
});

router.route('/updatetaskstatus').post(authenticateUser, async (req, res) => {
    console.log(req.body);
    if(req.user.role === 'Admin'){
        //full update
    } else if(req.user.role === 'User'){
        //status update
    } else {
        res
    }
});

router.route('/updatetask').post(authenticateUser, async (req, res) => {
    console.log(req.body);
    if(req.user.role === 'Admin'){
        //full update
    } else if(req.user.role === 'User'){
        //status update
    } else {
        res
    }
});
export default router;