import {} from 'dotenv/config'
import express from 'express';
import authenticateUser from '../middlewares/authenticateMiddleware.js';
import { fetchComments, saveComment } from '../services/commentServices.js';
const router = express.Router();

router.route('/getcomments/:id').get(authenticateUser, async (req,res)=>{
    try{
        const result = await fetchComments(req.params.id);
        if(result.length > 0) {
            res.status(200).send({token: req.user.newToken, data:result, message: 'Fetched comments'});
            return;
        }
        else {
            res.status(200).send({token: req.user.newToken, data:[], message: 'No comments found!'});
            return;
        }
    } catch(error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});

router.route('/savecomment').post(authenticateUser, async (req, res) => {
    if(!req.body.id||!req.body.comment) return res.status(200).send({message: 'Success'});
    try {
        await saveComment(req.body.id, req.body.comment, req.user.id).then(data => {
            res.status(200).send({token: req.user.newToken, data: {}, message: 'Success'});
        }).catch( error => { throw error});
    } catch(error) {
        console.log(error);
        res.status(500).send({message: 'Internal Server Error'});   
    }
});

export default router;