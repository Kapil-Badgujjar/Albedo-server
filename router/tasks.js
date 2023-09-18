import {} from 'dotenv/config'
import express from 'express';
import authenticateUser from '../middlewares/authenticateMiddleware.js';
import { fetchAllTasks, fetchTasksByuUser, fetchLastTasks, addNewTask, getStatsAdmin, getStatsByUser, updateTask, updateStatus } from '../services/taskServices.js';
import { getEmail } from '../services/userServices.js';
import { sendTaskAssignedMail } from '../utils/sendGridEmail.js';
const router = express.Router();

router.route('/fetchtasks').get(authenticateUser, async (req,res)=>{
    try{
        const tasks = (req.user.role === 'Admin' ? await fetchAllTasks() :  await fetchTasksByuUser(req.user.id));
        if(tasks.length > 0) {
            res.status(200).send({token: req.user.newToken, data:tasks, message: 'Task fetched successfully'});
        }
        else {
            res.status(200).send({token: req.user.newToken, data:[], message:'Empty task list'});
        }
    } catch(error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});

router.route('/fetchlasttasks').get(authenticateUser, async (req,res)=>{
    try{
        const tasks = await fetchLastTasks();
        if(tasks.length > 0)res.status(200).send({token: req.user.newToken, data:tasks[0], message: 'Task fetched successfully'})
        else res.status(200).send({token: req.user.newToken, data:[], message:'No new task found!'});
    } catch(error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});

router.route('/addnewtask').post(authenticateUser, async (req, res) => {
    if(req.user.role !== 'Admin') return res.status(403).send({message: 'You are not allowed to add new tasks'});
    try{
        await addNewTask(req.body).then(async (response) =>{
            const result = await getEmail(req.body.assignedTo);
            if(result) sendTaskAssignedMail(result[0].email_id);
            return response;
        }).then(() => {res.status(200).send({token: req.user.newToken||undefined, data: {}, message: 'task added successfully'});}).catch(error => {throw error;});
    } catch(err){
        res.status(500).send({message: err.message});
    }
});

router.route('/updatetaskstatus').post(authenticateUser, async (req, res) => {
    try{
        await updateStatus(req.body.id, req.body.status).then(() => { res.status(200).send({token: req.user.newToken||undefined, data: {}, message: 'Updating status successfully'})}).catch(err => {throw err});
    } catch (error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});

router.route('/updatetask').post(authenticateUser, async (req, res) => {
    console.log(req.user.id, req.body);
    if(req.user.role !== 'Admin'){
        res.status(401).send({token: req.user.newToken||undefined, data: {}, message: 'You are not allowed to update tasks.'});
        return;
    } 
    try{
        await updateTask(req.body).then( data => {res.status(200).send({token: req.user.newToken||undefined, data: {}, message: 'Updating status successfully'})}).catch(err => { throw err; });
    } catch (error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});

router.route('/getstats').get(authenticateUser, async(req, res)=>{
    try {
        const result = req.user.role === 'Admin' ? await getStatsAdmin() : await getStatsByUser(req.user.id);
        const data = [
            ["TaskStatus", "Count"],
            ["Assigned Tasks", result[0].assigned],
            ["In Progress", result[0].inprogress],
            ["Done", result[0].done],
        ]
        if(result.length > 0) res.status(200).send({token: req.user.newToken||undefined ,data, message: 'Stats successfully fetched'});
        else res.status(200).send({token: req.user.newToken||undefined, data: [], message: 'Stats Empty'});
    } catch(error) {
        res.status(500).send({message:'Internal Server Error'});
    }
});
export default router;