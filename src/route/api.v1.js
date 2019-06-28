import Router from "express";
import StoreManager from "../store/storeManager.js";
import users from "../store/users.js";
import properties from "../store/properties.js";
import Property from "../entity/property.js";

const appV1 = Router();
const userStore = StoreManager.mount(users);
const propertyStore = StoreManager.mount(properties);

const createProperty = (requestBody) =>{
    const property = new Property.Builder()
        .build();
    requestBody.id = "";
    Object.keys(property).forEach(key =>{
        if (Object.keys(requestBody).includes(key)){
            property[key] = requestBody[key];
        }
    });
    return property;
};

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
    const property = createProperty(req.body);
    propertyStore.insert(property)
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






export default appV1;