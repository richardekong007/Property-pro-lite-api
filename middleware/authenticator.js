import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
class Authenticator{

    static authenticate(req, res, next){
        try{
            const token = process.env.TEMP_TOKEN;
            req.decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            next();
        }catch(error){
            console.log(error);
            return res.status(401).send({
               status:'error',
               error:"Authentication failed!"
            });
        }
    }
}

export default Authenticator;