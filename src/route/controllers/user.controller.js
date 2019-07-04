import User from "../../entity/user.js";
import StoreManager from "../../store/storeManager";
import {validationResult} from "express-validator";

const userStore = StoreManager.mount([]);

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
  
    userStore.findOne({
        email:req.body.email,
        password:req.body.password
    })
    .then(result => {
        res.status(200)
            .json({
                status:"success",
                data:{
                    token:"",
                    id:result.id,
                    first_name:result.first_name,
                    last_name:result.last_name,
                    email:result.email
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
