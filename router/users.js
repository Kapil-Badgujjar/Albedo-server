import {} from 'dotenv/config'
import express from 'express';
import jwt from 'jsonwebtoken';
import { getUser, addUser, editMyProfile, getAllUsers, updateUserRole, getUserById, updateMyPassword } from '../services/userServices.js';
import authenticateUser from '../middlewares/authenticateMiddleware.js';
const router = express.Router();

router.route('/login').post(async (req, res)=>{
    console.log(req.body);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!emailPattern.test(req.body.email_id)||!pattern.test(req.body.password)) return res.status(400).send('Please enter proper values');
    try{
        const {status, user} = await getUser(req.body.email_id,req.body.password);
        if(status){
            user.password = undefined;
            const token= jwt.sign({...user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
            res.status(200).send({token, data:user, message: 'Successfully logged in!'});
        }
        else res.status(404).send({message: 'User Not found'});
    } catch(error){
        res.status(500).send({message: 'Internal Server Error'});
    }
})

router.route('/signup').post(async (req, res) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!emailPattern.test(req.body.email)||!pattern.test(req.body.password)) return res.status(400).send('Please enter proper values');
    try{
        addUser(req.body.email, req.body.password, req.body.username).then((response) => { sendSignupMail(req.body.email); res.status(200).send({ data: response, message: 'Successfully Signed Up!' })}).catch((error)=>{ res.status(400).send('User alredy exists');});
    } catch(error){
        res.status(500).send({message: 'Internal Server Error'});
    }
})

router.route('/editmyprofile').post(authenticateUser, async(req, res)=>{
    if(req.body.isPasswordUpdate){
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!pattern.test(req.body.password)) return res.status(400).send('Create strong password *(AZaz09!#$@)')
    }else {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!emailPattern.test(req.body.email)) return res.status(400).send("Invalid email");
    }
    try{
        const response = req.body.isPasswordUpdate ? updateMyPassword(req.user.id, req.body.password): editMyProfile(req.user.id, req.body.username, req.body.email);
        response.then(async data => {
            console.log(data);
            const result = await getUserById(req.user.id);
            const user = {...result[0]};
            const token = jwt.sign({...user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
            res.status(200).send({token, data: user, message: 'Successfuly edited the profile!'});
        }).catch(err => { throw err})
    } catch(error) {
        res.status(500).send({message: 'Internal server error!'});
    }
})

router.route('/fetchallusers').get(authenticateUser, async (req, res) => {
    if(req.user.role !== 'Admin'){
        res.status(401).send({message: 'You are not allowed to access this page.'});
        return;
    }
    try{
        const token = req.user.newToken||undefined;
        const {status, users} = await getAllUsers();
        if(status){
            res.status(200).send({token: req.user.newToken||undefined, data:users, message: 'Users fetched successfully'});
        }
        else res.status(404).send({message: 'Not Found'});
    } catch(error){
        res.status(500).send({message: 'Internal Server Error'});
    }
});

router.route('/updateuserrole').post(authenticateUser, async (req, res) => {
    if(req.user.id === req.body.id) {
        res.status(401).send({message: 'Unauthorized'});
        return;
    }
    try {
        await updateUserRole(req.body.id, req.body.role).then(data => { res.status(200).send({token: req.user.newToken||undefined, data: {id: req.body.id, role: req.body.role},message: 'Updated!'})}).catch(error => { throw error; });
    } catch(err) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});
export default router;