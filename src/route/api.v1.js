import Router from "express";
import cloudinary from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import StoreManager from "../store/storeManager.js";
import User from "../entity/user.js";
import Property from "../entity/property.js"; 
import {validationResult} from "express-validator"
import signupValidator from "../../middleware/validators/signupValidator.js";
import signinValidator from "../../middleware/validators/signinValidator.js";



dotenv.config();
const appV1 = Router();
const userStore = StoreManager.mount([]);
const propertyStore = StoreManager.mount([]);

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const storagePolicy = multer.diskStorage({
    destination : (req, file, callback) =>{
        callback(null, './uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
});

const fileFilter = (req, file, callback) =>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null, true);
    }else{
        callback(null,false);
    }
}

const upload = multer({storage:storagePolicy, limits:{
    fileSize: 1024 * 1024 * 20
},
    fileFilter: fileFilter
});

const createProperty = (requestBody) =>{
    const property = new Property.Builder()
        .setCreatedOn().build();
    Object.keys(property).forEach(key =>{
        if (Object.keys(requestBody).includes(key)){
            property[key] = requestBody[key];
        }
    });
    return property;
};

const createUser = (requestBody) =>{
    
    const user = new User.Builder().build();
    Object.keys(user).forEach(key=>{
        if (Object.keys(requestBody).includes(key)){
            user[key] = requestBody[key];
        }
    });
    return user;
};

const insertProperty = (db, property, response) =>{
    db.insert(property)
            .then(result =>{
                delete result.owner;
                response.status(201).json({
                    status:"success",
                    data:result});
            })
            .catch(err => response.status(412).json({
                status:"error", error:err.message
            }));
};

appV1.post("/auth/signup", signupValidator, (req,res) =>{
    const validationError = validationResult(req);
    if (!validationError.isEmpty()){
        return res.status(422).json({
            status:"Error",
            error:validationError.array()
        });
    }
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
            });
        })
        .catch(err => res.status(412).json({
            status:"error", error:err.message
        }));
        
});

appV1.post("/auth/signin", signinValidator , (req, res) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()){
        return res.status(422).json({
            status:"error", 
            error: validationError.array()
        });
    }
    const email = req.body.email;
    const password = req.body.password;
    userStore.findOne({email:email, password:password})
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
});

appV1.post("/property", upload.single('image_url'), (req, res) => {
    const property = createProperty(req.body);
    if (req.file){
        cloudinary.v2.uploader.upload(req.file.path, (err, feedback) => {
            property.image_url = feedback.secure_url;
            insertProperty(propertyStore, property,res);
        });
    }else{
        insertProperty(propertyStore,property,res);
    }
});

appV1.patch("/property/:id",(req, res) =>{
    propertyStore.update(req.params.id, req.body)
        .then((result)=>{
            res.status(200).json({status:"success", data:result})
        })
        .catch((err)=> res.status(400).json({status:"error", error:err.message}));
});

appV1.patch(`/property/:id/:${"sold"}`, (req, res) =>{
    propertyStore.update(req.params.id, {status:req.params.sold})
        .then(result => {
            delete result.owner;
            res.status(200).json({
                status:"success",
                data:result
            });
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
            });
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
                    status:200,
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
                status:200,
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
                status:200,
                data:result
            });
        })
        .catch(err=> res.status(412).json({
            status:"error", error:err.message
        }));
});

export default appV1;

export {propertyStore, userStore};

