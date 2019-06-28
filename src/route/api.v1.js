import Router from "express";
import StoreManager from "../store/storeManager.js";
import User from "../entity/user.js";
import users from "../store/users.js";

const appV1 = Router();
const userStore = StoreManager.mount(users);

const createUser = (requestBody) =>{
    const user = new User.Builder()
        .build();
    requestBody.id = "";
    Object.keys(user).forEach(key=>{
        if (Object.keys(requestBody).includes(key)){
            user[key] = requestBody[key];
        }
    });
    return user;
};

appV1.post("/auth/signup", (req,res)=>{
    const user = createUser(req.body);
    userStore.insert(user)
        .then(result => {
            res.status(201).json({
                status: "success",
                data:{
                    token:"",
                    id: result.id,
                    first_name:result.first_name,
                    last_name:result.last_name,
                    email:result.email
                }
            })
        })
        .catch(err => res.status(412).json({
            status:"error", error:err.message
        }));
});


export default appV1;