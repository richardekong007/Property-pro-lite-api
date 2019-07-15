import dotenv from "dotenv";
import Property from "../../entity/property.js";
import cloudinary from "cloudinary";
import Db from "../../db/db.js";
import validator from "validator";
import {validationResult} from "express-validator";
import patchPropertyValidator from "../../../middleware/validators/patchPropertyValidator.js";


dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const db = Db.getInstance();

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

const insertProperty = (database, property, messageExchange) =>{
    property.owner = messageExchange.req.decodedToken.id;
    const sqlStatement = "INSERT INTO PROPERTY(owner,price,state,city,address,type,created_on,image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;"
    const {owner,price,state,city,address,type,created_on,image_url} = property;
    const values = [owner,price,state,city,address,type,created_on,image_url];

    database.query(sqlStatement, values)
            .then(result =>{
                if (result.rowCount < 1){
                    return messageExchange.res.status(404)
                        .json({
                            status:"error",
                            error:"No record inserted!"
                        })
                }
                const {id,status,type,state,city,address,price,created_on,image_url} = result.rows[0];
                const data = {id,status,type,state,city,address,price,created_on,image_url};
                messageExchange.res.status(201).json({
                    status:"success",
                    data:data
                });
            })
            // .catch(err => messageExchange.res.status(412).json({
            //     status:"error", error:err.detail
            // }));
};

const postPropertyAdvert = (req, res) =>{
    const validatorError = validationResult(req);
    console.log("body:",req.body);
    console.log("\nauth header:", req.headers.authorization);
    if (!validatorError.isEmpty()){
        console.log(validatorError.array());
        return res.status(422).json({
            status: "error",
            error: validatorError.array().join(' ')
        });
    }
    const messageExchange = {req:req, res:res};
    const property = createProperty(req.body);
    if (req.file){
        cloudinary.v2.uploader.upload(req.file.path, (err, feedback) => {
            property.image_url = feedback.secure_url;
            insertProperty(db, property,messageExchange);
        });
    }else{
        insertProperty(db,property,messageExchange);
    }
};

const prepareUpdateStatement = (table,reqestBody) =>{

    let statement = [`UPDATE ${table} SET`];
    const keys = Object.keys(reqestBody);
    console.log(reqestBody);
    keys.forEach((key,index) =>{
        statement.push(` ${key} = $${index+1}`);
        if ((index < keys.length-1)) statement.push(",");
    });
    statement.push(` WHERE id = $${keys.length+1} RETURNING id, status, type, state, city, address, price, created_on, image_url;`);
    return statement.join("");
};

const updateProperty = (req, res) =>{
    const patchValidation = patchPropertyValidator(req.body);
    
    console.log(req.body);
    if (!patchValidation.valid){
        console.log(patchValidation.error);
        return res.status(422).json({
            status: "error",
            error: patchValidation.error
        });
    }
    const table = "PROPERTY";
    const sqlStatement = prepareUpdateStatement(table, req.body);
    const values = [...Object.values(req.body), parseInt(req.params.id)];
    db.getConnectionPool().connect((err, client, done)=>{
        if (err) {
            return res.status(500).json({
                status:"error", 
                error:"Server error"
            });
        }
        client.query(sqlStatement, values)
        .then((result)=>{
            done();
            if (result.rowCount < 1){
                return res.status(400).json({
                    status:"error",
                    error:"No updates made"
                })
            }
            res.status(200).json({status:"success", data:result.rows[0]})
        })
        .catch((err)=> res.status(400).json({status:"error", error:err.detail}));
    });
    
};

const markAsSold = (req, res) =>{

    const sqlStatement = "UPDATE PROPERTY SET status = $1 WHERE id = $2 RETURNING id, status, type, state, city, address, price, created_on, image_url;"
    const values = [req.params.sold, parseInt(req.params.id)];
    if ((req.params.sold !== "sold") || !(parseInt(req.params.id))){
            return res.status(500).json({
                status:"error", 
                error:"Wrong data!"
            });
    }
    db.getConnectionPool().connect((err, client, done) =>{
        if (err) {
            return res.status(500).json({
                status:"error", 
                error:"Server error"
            });
        }
        client.query(sqlStatement, values)
        .then(result => {
            done();
            if (result.rowCount < 1){
                return res.status(400).json({
                    status:"error",
                    error:"No record updated!"
                });
            }
            res.status(200).json({
                status:"success",
                data:result.rows[0]
            });
        })
        // .catch(err => res.status(400).json({
        //     status:"error", error:err.detail
        // }));
    })
};

const deleteProperty = (req, res) =>{
    const sqlStatement = "DELETE FROM PROPERTY WHERE id = $1 RETURNING *;";
    const values = [parseInt(req.params.id)];
    db.getConnectionPool().connect((err, client, done)=>{
        if (err){
            return res.status(500).json({
                status:"error", 
                error:"Server error"
            });
        }
        client.query(sqlStatement, values)
            .then(result =>{
                done();
                if (!result || result.rowCount < 1) {
                    return res.status(400).json({
                        status:"error",
                        error:"No record deleted!"
                    })
                }
                let publicId;
                const {image_url} = result.rows[0];
                if (validator.isURL(image_url)){
                    publicId = image_url.substring(
                        image_url.lastIndexOf("/")+1,
                        image_url.length
                    );
                    cloudinary.v2.uploader.destroy(publicId, (err, feedback) =>{
                        if (err) console.log("Failed to delete",publicId);
                        else if(feedback) console.log("Deleted ",publicId, " from cloud");
                    });
                }
                res.status(200).json({
                    status:"success",
                    data:{message: "Operation successful"}
                });
            })
            .catch(err => res.status(404).json({
                status:"error", error:err.detail
            }));
    });

}

const findAllProperties = (req, res) =>{
    console.log(req.body);
    const sqlStatement = "SELECT PROPERTY.id, PROPERTY.status, PROPERTY.type, PROPERTY.state, PROPERTY.city, PROPERTY.address, PROPERTY.price, PROPERTY.created_on, PROPERTY.image_url, USERS.email as owner_email, USERS.phone_number as owner_phone_number FROM USERS INNER JOIN PROPERTY ON USERS.id = PROPERTY.owner ORDER BY id ASC;";
    db.getConnectionPool().connect((err, client, done) =>{
        if (err) {
            return res.status(500).json({
                status:"error", 
                error:"Server error"
            });
        }
        client.query(sqlStatement)
            .then(results => {
                    done();
                    if(!results || results.rowCount < 1){
                        return res.status(404).json({
                            status:"error", 
                            error:"No record found"
                        });
                    } 
                    
                    return res.status(200).json({
                            status:"success",
                            data:results.rows
                    });
            })
            // .catch(err => res.status(404).json({
            //     status:"error", error:err.detail
            // }));
    });
    
};

const findPropertyByType = (req, res) =>{
    const sqlStatement = "SELECT PROPERTY.id, PROPERTY.status, PROPERTY.type, PROPERTY.state, PROPERTY.city, PROPERTY.address, PROPERTY.price, PROPERTY.created_on, PROPERTY.image_url, USERS.email as owner_email, USERS.phone_number as owner_phone_number FROM USERS INNER JOIN PROPERTY ON USERS.id = PROPERTY.owner WHERE type = $1 ORDER BY id ASC;";
    const values = [req.query.type];
    db.getConnectionPool().connect((err, client, done) =>{
        if (err) {
            return res.status(500).json({
                status:"error", 
                error:"Server error"
            });
        }
        client.query(sqlStatement,values)
            .then(results => {
                done();
                if (results.rowCount < 1){
                    return res.status(404).json({
                         status:"error",
                         error:"No Record!"
                        });
                } 
            
                return res.status(200).json({
                    status:"success",
                    data:results.rows
                });
            })
            .catch(err => res.status(404).json({
                status:"error",
                error:err.detail
            }));
    });

};

const findPropertyById = (req, res) => {
    const sqlStatement = "SELECT PROPERTY.id, PROPERTY.status, PROPERTY.type, PROPERTY.state, PROPERTY.city, PROPERTY.address, PROPERTY.price, PROPERTY.created_on, PROPERTY.image_url, USERS.email as owner_email, USERS.phone_number as owner_phone_number FROM USERS INNER JOIN PROPERTY ON USERS.id = PROPERTY.owner WHERE PROPERTY.id = $1;";
    const values = [parseInt(req.params.id)];
    if (!req.params.id){
        return res.status(500).json({
            status:"error",
            error:"server error"
        });
    }
    db.getConnectionPool().connect((err, client, done) =>{
        if (err) {
                return res.status(500).json({
                    status:"error",
                    error:"Server error"
                });
        }
        client.query(sqlStatement, values)
            .then(results => {
                done();
                if (results.rowCount < 1){
                    return res.status(404).json({
                        status:"error",
                        error:"No record found"
                    });
                } 
                    return res.status(200).json({
                        status:"success",
                        data:results.rows[0]
                    });
            })
            .catch(err=> res.status(404).json({
                status:"error", error:err.detail
            }));
    });
};

export {
    postPropertyAdvert, updateProperty, markAsSold, 
    deleteProperty, findAllProperties, findPropertyByType,
    findPropertyById
};