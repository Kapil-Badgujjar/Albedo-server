import {} from 'dotenv/config'
import express from 'express';
import authenticateUser from '../middlewares/authenticateMiddleware.js';
import { fetchTasksByuUser } from '../services/taskServices.js';
const router = express.Router();

router.route('/fetchtasksbyuser').get(authenticateUser, async (req,res)=>{
    console.log(req.user);
    try{
        const tasks = await fetchTasksByuUser(req.user.id);
        if(tasks.length > 0) {
            res.status(200).send(tasks);
        }
        else {
            res.status(200).send([]);
        }
    } catch(error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
    // res.status(200).send([{id: 1, title: 'DSSSB', status: 'Assigned', deadline: '2023-09-15', assignedTo: 1, description: 'Complete your DSSSB form as soon as possible', tag: '#Job, #Govt Job'}]);
});

export default router;