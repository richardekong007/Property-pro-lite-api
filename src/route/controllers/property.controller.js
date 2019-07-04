import dotenv from "dotenv";
import Property from "../../entity/property.js";
import StoreManager from "../../store/storeManager.js";
import cloudinary from "cloudinary";
import {validationResult} from "express-validator";
import patchPropertyValidator from "../../../middleware/validators/patchPropertyValidator.js";


dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const propertyStore = StoreManager.mount([]);

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

const postPropertyAdvert = (req, res) =>{
    const validatorError = validationResult(req);
    if (!validatorError.isEmpty()){
        return res.status(422).json({
            status: "error",
            error: validatorError.array()
        });
    }
    const property = createProperty(req.body);
    if (req.file){
        cloudinary.v2.uploader.upload(req.file.path, (err, feedback) => {
            property.image_url = feedback.secure_url;
            insertProperty(propertyStore, property,res);
        });
    }else{
        insertProperty(propertyStore,property,res);
    }
};

const updateProperty = (req, res) =>{
    const patchValidation = patchPropertyValidator(req.body);
    if (!patchValidation.valid){
        return res.status(422).json({
            status: "error",
            error: patchValidation.error
        });
    }
    propertyStore.update(req.params.id, req.body)
        .then((result)=>{
            res.status(200).json({status:"success", data:result})
        })
        .catch((err)=> res.status(400).json({status:"error", error:err.message}));
};

const markAsSold = (req, res) =>{
    propertyStore.update(req.params.id, {status:req.params.sold})
        .then(result => {
            delete result.owner;
            res.status(200).json({
                status:"success",
                data:result
            });
        })
        .catch(err => res.status(400).json({
            status:"error", error:err.message
        }));
};

const deleteProperty = (req, res) =>{
    propertyStore.delete(req.params.id)
        .then(result =>{
            res.status(200).json({
                status:"success",
                data:{message: result}
            });
        })
        .catch(err => res.status(404).json({
            status:"error", error:err.message
        }));
}

const findAllProperties = (req, res) =>{
    propertyStore.findAll()
        .then(results => {
                results.forEach(result => delete result.owner);
                res.status(200).json({
                    status:200,
                    data:results
            });
        })
        .catch(err => res.status(404).json({
            status:"error", error:err.message
        }));
};

const findPropertyByType = (req, res) =>{
    propertyStore.findAll('type',req.query.type)
        .then(results => {
            results.forEach(result => delete result.owner);
            res.status(200).json({
                status:200,
                data:results
            });
        })
        .catch(err => res.status(404).json({
            status:"error", error:err.message
        }));
};

const findPropertyById = (req, res) => {
    propertyStore.findById(req.params.id)
        .then(result => {
            delete result.owner;
            res.status(200).json({
                status:200,
                data:result
            });
        })
        .catch(err=> res.status(404).json({
            status:"error", error:err.message
        }));
};

export default propertyStore;

export {
    postPropertyAdvert, updateProperty, markAsSold, 
    deleteProperty, findAllProperties, findPropertyByType,
    findPropertyById
};