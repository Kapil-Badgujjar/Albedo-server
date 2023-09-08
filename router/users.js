import express from 'express';
import { getUser, addUser } from '../services/userServices.js';
const router = express.Router();

router.route('/fetch-user').post(async (req, res)=>{
    try{
        const user = await getUser(req.body.email,req.body.password);
        if(user) res.status(200).send(user);
        else res.status(404);
    } catch(error){
        res.status(500);
    }
})

router.route('/signup').post(async (req, res) => {
    try{
        const result = await addUser(req.body.email, req.body.password, req.body.username);
        res.status(200).send(result);
    } catch(error){
        res.status(500);
    }
})


export default router;