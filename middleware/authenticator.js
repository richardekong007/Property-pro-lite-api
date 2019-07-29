import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
class Authenticator{

    static authenticate(req, res, next){
        try{
            const token = process.env.TEMP_TOKEN;
            req.body.token = token;
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

    static getPayload (token, secret){
        try{
            const payload = jwt.decode(token, secret);
            const {exp} = payload;
            return (Date.now() >= exp * 1000) ? undefined : payload;
        } catch(error){
            console.log("Error Decoding token:", error);
            throw error;
        }
    }
}

export default Authenticator;