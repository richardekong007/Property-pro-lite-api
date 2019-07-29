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

    static generatePasswordResetToken (payload, secret){
        return jwt.sign(
            payload,
            secret,
            {expiresIn:Math.floor(Date.now()/1000)+30}
        );
    }
}

export default TokenGenerator;