import User from "../../entity/user.js";
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
    const sqlStatement = "INSERT INTO USERS(email, first_name, last_name, password, phoneNumber, address, is_admin) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *";
    const {email, first_name, last_name, password, phoneNumber, address, is_admin} = createUser(req.body);
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
};

const signinUser = (req, res) =>{
    const validationError = validationResult(req);
    if (!validationError.isEmpty()){
        return res.status(422).json({
            status:"error", 
            error: validationError.array()
        });
    }
  
    const sqlStatement = "SELECT * FROM USERS WHERE email = $1 AND password = $2";
    const values = Object.values(req.body);
    
    db.query(sqlStatement, values)
      .then(result => {
            const record = result.rows[0];
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
        .catch(err => res.status(401).json({
                status:"error",
                error:err.message
        }));
};


export {signupUser, signinUser};