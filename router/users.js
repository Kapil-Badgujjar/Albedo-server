import {} from 'dotenv/config'
import express from 'express';
import jwt from 'jsonwebtoken';
import { getUser, addUser, editMyProfile } from '../services/userServices.js';
import authenticateUser from '../middlewares/authenticateMiddleware.js';
const router = express.Router();

router.route('/login').post(async (req, res)=>{
    console.log(req.body);
    try{
        const {status, user} = await getUser(req.body.email_id,req.body.password);
        if(status){
            user.password = undefined;
            user.albedoAccessToken= jwt.sign({...user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
            res.status(200).send(user);
        }
        else res.status(404).send({message: 'User Not found'});
    } catch(error){
        res.status(500).send({message: 'Internal Server Error'});
    }
})

router.route('/signup').post(async (req, res) => {
    try{
        const response = await addUser(req.body.email_id, req.body.password, req.body.username);
        res.status(200).send(response);
    } catch(error){
        res.status(500);
    }
})

router.route('/editmyprofile').post(authenticateUser, async(req, res)=>{
    try{
        const response = await editMyProfile(req.body);
        if(response){
            const user = await getUser(req.body.email_id,req.body.password);
            const albedoAccessToken = jwt.sign({...user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
            res.status(200).send({response, albedoAccessToken});
        }
    } catch(error) {
        res.status(500);
    }
})


export default router;