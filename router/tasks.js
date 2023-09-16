import {} from 'dotenv/config'
import express from 'express';
import authenticateUser from '../middlewares/authenticateMiddleware.js';
import { fetchAllTasks, fetchTasksByuUser, fetchLastTasks, addNewTask, getStatsAdmin, getStatsByUser, updateTask, updateStatus } from '../services/taskServices.js';
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
    try{
        const result = await updateStatus(req.body.id, req.body.status);
        res.status(200).send({message: 'Updating status successfully'});
    } catch (error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});

router.route('/updatetask').post(authenticateUser, async (req, res) => {
    console.log(req.user.id, req.body);
    if(req.user.role !== 'Admin'){
        res.status(401).send({message: 'You are not allowed to update tasks.'});
        return;
    } 
    try{
        const result = await updateTask(req.body);
        res.status(200).send({message: 'Updating status successfully'});
    } catch (error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});

router.route('/getStats').get(authenticateUser, async(req, res)=>{
    try {
        const result = req.user.role === 'Admin' ? await getStatsAdmin() : await getStatsByUser(req.user.id);
        const data = [
            ["TaskStatus", "Count"],
            ["Assigned Tasks", result[0].assigned],
            ["In Progress", result[0].inprogress],
            ["Done", result[0].done],
        ]
        if(result.length > 0) res.status(200).send(data);
        else res.status(200).send([]);
    } catch(error) {
        res.status(500).send({message:'Internal Server Error'});
    }
});
export default router;