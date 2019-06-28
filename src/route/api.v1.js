import Router from "express";
import StoreManager from "../store/storeManager.js";
import User from "../entity/user.js";
import users from "../store/users.js";
import properties from "../store/properties.js";

const appV1 = Router();
const userStore = StoreManager.mount(users);
const propertyStore = StoreManager.mount(properties);

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

appV1.patch(`/property/:id/:${"sold"}`, (req, res) =>{
    propertyStore.update(req.params.id, {status:req.params.sold})
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

appV1.delete("/property/:id", (req,res) =>{
    propertyStore.delete(req.params.id)
        .then(result =>{
            res.status(200).json({
                status:"success",
                data:{message: result}
            })
        })
        .catch(err => res.status(412).json({
            status:"error", error:err.message
        }));
});

appV1.get("/property", (req,res) =>{
    propertyStore.findAll()
        .then(results => {
            results.forEach(result => delete result.owner);
            res.status(200).json({
                status:"success",
                data:results
            });
        })
        .catch(err => res.status(412).json({
            status:"error", error:err.message
        }));
});

appV1.get("/property/type", (req, res) =>{
    propertyStore.findAll('type',req.query.type)
        .then(results => {
            results.forEach(result => delete result.owner);
            res.status(200).json({
                status:"success",
                data:results
            });
        })
        .catch(err => res.status(412).json({
            status:"error", error:err.message
        }));
});

appV1.get("/property/:id", (req, res) =>{
    propertyStore.findById(req.params.id)
        .then(result => {
            delete result.owner;
            res.status(200).json({
                status:"success",
                data:result
            })
        })
        .catch(err=> res.status(412).json({
            status:"error", error:err.message
        }))
});

export default appV1;