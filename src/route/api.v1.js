import Router from "express";
import StoreManager from "../store/storeManager.js";
import users from "../store/users.js";
import properties from "../store/properties.js";

const appV1 = Router();
const userStore = StoreManager.mount(users);
const propertyStore = StoreManager.mount(properties);

appV1.post("/auth/signup", (req,res)=>{
    userStore.insert(req.body)
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

appV1.post("/auth/signin", (req, res) => {
    
});

appV1.post("/property", (req, res) => {
    propertyStore.insert(req.body)
        .then(result =>{
            res.status(201).json({
                status:"success",
                data:result
            })
        })
        .catch(err => res.status(412).json({
            status:"error", error:err.message
        }));
});

appV1.patch("/property/:id", (req,res) =>{
    propertyStore.update(req.params.id, req.body)
        .then(result => {
            delete result.owner;
            res.status(201).json({
                status:"success",
                data:result
            })
        })
        .catch(err => res.status(412).json({
            status:"error", error:err.message
        }));
});




export default appV1;