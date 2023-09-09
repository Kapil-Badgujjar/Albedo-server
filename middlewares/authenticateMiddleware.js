import {} from 'dotenv/config';
import jwt from 'jsonwebtoken';

function authenticateUser(req, res, next){
    const token = req.headers['authorization'].split(' ')[1];
    if(token) {
        try{
            const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            verifyToken.iat = undefined;
            verifyToken.exp = undefined;
            console.log({...verifyToken});
            req.user={...verifyToken};
            next();
        } catch(error) {
            console.log(error);
            res.status(500);
        }
    }
}

export default authenticateUser;