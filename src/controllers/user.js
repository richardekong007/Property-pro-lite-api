import User from "../entity/user.js";
import bcrypt from "bcrypt";
import TokenGenerator from '../tokenGenerator.js';
import Db from "../db/db.js";
import {validationResult} from "express-validator"; 

const db = Db.getInstance();

const createUser = (requestBody) =>{

    const user = new User.Builder().build();
    Object.keys(user).forEach(key=>{
        if (Object.keys(requestBody).includes(key)){
            user[key] = requestBody[key];
        }
    });
    return user;
};

const signupUser = (req, res) =>{
    const table = "USERS";
    const saltRounds = 10;
    const user = createUser(req.body);
    const sqlStatement = `INSERT INTO USERS(email, first_name, last_name, password,
         phone_number, address) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    const validationError = validationResult(req);
    
    if (!validationError.isEmpty()){
        console.log(req.body);
        return res.status(422).json({
            status:"Error",
            error:validationError.array()[0].msg
        });
    }

    db.getConnectionPool().connect((err, client, release) =>{
        if (err) {
            return res.status(500)
            .send({status:"error", error:"Server error"});
        }

        bcrypt.hash(user.password, saltRounds)
        .then(hash =>{

            user.password = hash;
            const {email, first_name, last_name,password,phone_number, address} = user;
            const values = [email, first_name, last_name, password, phone_number, address];

            if (!hash){
                return Promise.reject(res.status(400)
                .send({status:"error", error:"Failed to sign in!"}));
            }

            db.findOne(table, {email:email})
            .then(result =>{
                if (result.rowCount > 0){
                    return Promise.reject(res.status(409)
                    .send({status:"error", error:"Email Already exist"}));
                }

                client.query(sqlStatement, values)
                .then(result =>{
                    const record = result.rows[0];
                    const payload = {id:record.id, email:record.email };
                    const token = TokenGenerator.generateToken(payload);
                    process.env.TEMP_TOKEN = token;
                    release();
                    return res.status(201).json({
                        status: "success",
                        data:{
                            token:token,
                            id: record.id,
                            first_name:record.first_name, 
                            last_name:record.last_name,
                            email:record.email
                        }
                    });
                })
            })
            .catch(err => err);
        })
        .catch(err => err);
    });
};

const signinUser = (req, res) =>{
    const validationError = validationResult(req);
    if (!validationError.isEmpty()){
        return res.status(422).json({
            status:"error", 
            error: validationError.array()
        });
    }
    const plainTextPassword = req.body.password;
    db.findOne("Users", {email:req.body.email})
        .then(results =>{
            if (results.rowCount < 1){
                return Promise.reject(res.status(400)
                .send({status:"error", error:"Wrong Email or Password!"}));
            } 
            const record = results.rows[0];
            const hash = record.password;
            bcrypt.compare(plainTextPassword, hash)
                .then(positive =>{
                    if (!positive){ 
                        return Promise.reject(res.status(400)
                        .send({status:"error",error:"Wrong Email or Password!"}));
                    }
                    const payload = {id:record.id, email:record.emial};
                    const token = TokenGenerator.generateToken(payload);
                    process.env.TEMP_TOKEN = token;
                    return res.status(200)
                    .json({
                        status:"success",
                        data:{
                            token:token,
                            id:record.id,
                            first_name:record.first_name,
                            last_name:record.last_name,
                            email:record.email
                        }
                    });
                })
                .catch(err => err);
        })
        .catch(err => err);
};

export {signupUser, signinUser};
