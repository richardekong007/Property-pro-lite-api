import User from "../../entity/user.js";
import StoreManager from "../../store/storeManager";
import {validationResult} from "express-validator"; 
import Db from "../../db/db.js";

const userStore = StoreManager.mount(__dirname+'/users.json');
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
    userStore.insert(createUser(req.body))
        .then(result => {
            res.status(201).json({
                status: "success",
                data:{
                    token:"", id: result.id,
                    first_name:result.first_name, 
                    last_name:result.last_name,
                    email:result.email
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
  
    const sqlStatement = "SELECT * FROM USER WHERE email = $1 AND password = $2 RETURNING *";
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

export default userStore;
export {signupUser, signinUser};
