import User from "../../entity/user.js";
import bcrypt from "bcrypt";
import Db from "../../db/db.js";
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
    const validationError = validationResult(req);
    if (!validationError.isEmpty()){
        return res.status(422).json({
            status:"Error",
            error:validationError.array()
        });
    }
    const saltRounds = 10;
    const user = createUser(req.body);
    const sqlStatement = "INSERT INTO USERS(email, first_name, last_name, password, phoneNumber, address, is_admin) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *";
    bcrypt.hash(user.password, saltRounds)
        .then(hash =>{
            if (!hash){
                console.log("failed to hash password");
                return;
            } 
            user.password = hash;
            const {email, first_name, last_name,password,phoneNumber, address, is_admin} = user;
            const values = [email, first_name, last_name, password, phoneNumber, address, is_admin];
            db.query(sqlStatement, values)
                .then(result => {
                    const record = result.rows[0];
                    res.status(201).json({
                        status: "success",
                        data:{
                            token:"", id: record.id,
                            first_name:record.first_name, 
                            last_name:record.last_name,
                            email:record.email
                        }
                    });
                })
                .catch(err => res.status(412).json({
                    status:"error", error:err.message
                }));
        })
        .catch(err => {
            alert(err);
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
            if (results.rowCount < 1 ){
                console.log("Wrong email!");
                return;
            } 
            const record = results.rows[0];
            const hash = record.password;
            bcrypt.compare(plainTextPassword, hash)
                .then(positive =>{
                    if (!positive) 
                    console.log("Wrong password");
                    res.status(200)
                    .json({
                        status:"success",
                        data:{
                            token:"",
                            id:record.id,
                            first_name:record.first_name,
                            last_name:record.last_name,
                            email:record.email
                        }
                    });
                })
                .catch(err =>{
                    alert(err);
                })
        })
        .catch(err => {
            alert(err);
        });
};

export {signupUser, signinUser};
