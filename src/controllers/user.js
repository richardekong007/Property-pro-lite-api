import User from "../entity/user.js";
import bcrypt from "bcrypt";
import TokenGenerator from '../tokenGenerator.js';
import Db from "../db/db.js";
import {validationResult} from "express-validator"; 
import validator from "validator";
import Authenticator from "../../middleware/authenticator.js";

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
        return res.status(422).json({
            status:"Error",
            error:validationError.array()[0].msg
        });
    }

    db.getConnectionPool().connect((err, client, release) =>{
        if (err) {
             res.status(500)
            .send({status:"error", error:"Server error"});
        }

        bcrypt.hash(user.password, saltRounds)
        .then(hash =>{

            user.password = hash;
            const {email, first_name, last_name,password,phone_number, address} = user;
            const values = [email, first_name, last_name, password, phone_number, address];

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
        });
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

const sendResetLink = (req, res) => {

    const table = "USERS";
    const email = req.body.email;
    if (!(req.body.hasOwnProperty("email")) || !(req.body.email)){
        return res.status(422).json({status:"error", error:"Failed to provide an email"});
    }

    if (!validator.isEmail(email)){
        return res.status(422).json({status:"error", error:"Invalid email!"});
    }

    db.findOne(table, {email:email})
        .then(result => {
            if (result.rowCount < 1){
                return Promise.reject(res.status(400)
                .send({status:"error", error:"Email not recognised, "
                +"Please provide your email or"
                +" Signup again!"}));
            }
            const {id, password} = result.rows[0];
            const payload = {id:id, email:email};
            const secret = `${password}-${process.env.JWT_SECRET}`;
            const token = TokenGenerator.generatePasswordResetToken(payload,secret);
            const resetLink = `<a id = 'reset-link' href = '${req.protocol}:`
                             +`//${req.hostname}:${process.env.PORT || 3999}`
                             +`${req.baseUrl}/auth/reset-password-step2/${payload.id}`
                             +`/${token}'>Please click here to reset  your password</a>`;
            res.status(200).json({status:"success", data:resetLink});

        })
        .catch(err => err);
};

const receiveResetParams = (req, res) => {
    const id = parseInt(req.params.id);
    const token = req.params.token;
    const table = "USERS";
    db.findOne(table, {id:id})
    .then(result =>{
        if (result.rowCount < 1){
            return Promise.reject(res.status(404)
            .json({status:"error", error:"Account doesn't exist"}));
        }
        const {password} = result.rows[0];
        const secret = `${password}-${process.env.JWT_SECRET}`;
        const {id} = Authenticator.getPayload(token,secret);
        return res.status(200).json({status:"success", data:{id:id, token:token}});
    })
    .catch(err => err);
};

const resetPassword = (req, res) =>{
    const table = "USERS";
    const sql = `UPDATE ${table} SET password = $1 WHERE id = $2 RETURNING *;`;
    const {id, token, password} = req.body;
    const validationError = validationResult(req);
    if (!validationError.isEmpty()){
        return res.status(422).json({
            status:"error", 
            error: validationError.array()[0].msg
        });
    }

    db.findOne(table, {id:id})
    .then(result =>{
        if (result.rowCount < 1){
            return Promise.reject(res.status(404)
            .json({status:"error", error:"Account doesn't exist"}))
        }
        const {oldPassword} = result.rows[0];
        const secret = `${oldPassword}-${process.env.JWT_SECRET}`;
        const payload = Authenticator.getPayload(token,secret);
        if (!payload) return Promise.reject(res.status(400)
            .json({status:"error", error:"Token expired, restart proecess."}));
        const hash = bcrypt.hashSync(password,10);
        db.getConnectionPool().connect((err, client, releaseClient) =>{
            if (err) {
                return Promise.reject(res.status(500)
                .json({status:"error", error:"Sever error!"}));
            }
            client.query(sql,[hash,id])
            .then(result =>{
                releaseClient();
                if (result.rowCount < 1) return Promise.reject(res.status(400)
                    .json({status:"error", error:"Password reset Failed!"}));

                return res.status(200).json({status:"success", 
                    data:"Your password has been successfully reset"});  
            })
            .catch(err => err);
        });

    })
    .catch(err => err);
};

export {signupUser, signinUser, sendResetLink, receiveResetParams, resetPassword};
