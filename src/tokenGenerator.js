import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

class TokenGenerator{

    static generateToken (payload){
        return jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn:process.env.EXPIRES_IN}
        );
    }
}

export default TokenGenerator;