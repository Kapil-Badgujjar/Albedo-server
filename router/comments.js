import {} from 'dotenv/config'
import express from 'express';
import authenticateUser from '../middlewares/authenticateMiddleware.js';
import { fetchComments, saveComment } from '../services/commentServices.js';
const router = express.Router();

router.route('/getcomments/:id').get(authenticateUser, async (req,res)=>{
    try{
        const result = await fetchComments(req.params.id);
        if(result.length > 0) {
            res.status(200).send(result);
            return;
        }
        else {
            res.status(200).send([]);
            return;
        }
    } catch(error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
});

router.route('/savecomment').post(authenticateUser, async (req, res) => {
    if(!req.body.id||!req.body.comment) return res.status(200).send({message: 'Success'});
    try {
        const result = await saveComment(req.body.id, req.body.comment, req.user.id)
        res.status(200).send({message: 'Success'});
    } catch(error) {
        console.log(error);
        res.status(500).send({message: 'Internal Server Error'});   
    }
});

export default router;