import {} from 'dotenv/config';
import jwt from 'jsonwebtoken';

function authenticateUser(req, res, next){
    const token = req.headers['authorization'].split(' ')[1];
    if(token) {
        try{
            const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const userDetails = { id: verifyToken.id, username: verifyToken.username, email_id: verifyToken.email_id, role: verifyToken.role}
            

            // Smart token refresh using expiry time check
            const currentTime = Number(new Date().getTime().toString().slice(0,10));
            const newToken = verifyToken.exp - currentTime < 600 ? jwt.sign({...userDetails}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'}) : undefined;

            req.user={...userDetails, newToken};
            next();
        } catch(error) {
            res.status(401).send({message: 'Unauthorized'});
        }
    }
}

export default authenticateUser;