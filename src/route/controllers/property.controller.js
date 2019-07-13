import dotenv from "dotenv";
import Property from "../../entity/property.js";
import cloudinary from "cloudinary";
import Db from "../../db/db.js";
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

const insertProperty = (database, property, response) =>{
    const sqlStatement = "INSERT INTO PROPERTY(owner,status,price,state,city,address,type,created_on,image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;"
    const {owner,status,price,state,city,address,type,created_on,image_url} = property;
    const values = [owner,status,price,state,city,address,type,created_on,image_url];

    database.query(sqlStatement, values)
            .then(result =>{
                if (result.rowCount < 1){
                    response.status(400)
                        .send({
                            status:"error",
                            error:"No record updated!"
                        })
                }
                const {id,status,type,state,city,address,price,created_on,image_url} = result.rows[0];
                const data = {id,status,type,state,city,address,price,created_on,image_url};
                response.status(201).json({
                    status:"success",
                    data:data
                });
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
            insertProperty(db, property,res);
        });
    }else{
        insertProperty(db,property,res);
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
    if (!patchValidation.valid){
        return res.status(422).json({
            status: "error",
            error: patchValidation.error
        });
    }
    const table = "PROPERTY";
    const sqlStatement = prepareUpdateStatement(table, req.body);
    const values = [...Object.values(req.body), parseInt(req.params.id)];
    db.getConnectionPool().connect((err, client, done)=>{
        if (err) throw err;
        client.query(sqlStatement, values)
        .then((result)=>{
            done();
            res.status(200).json({status:"success", data:result.rows[0]})
        })
        .catch((err)=> res.status(400).json({status:"error", error:err.message}));
    });
    
};

const markAsSold = (req, res) =>{

    const sqlStatement = "UPDATE PROPERTY SET status = $1 WHERE id = $2 RETURNING id, status, type, state, city, address, price, created_on, image_url;"
    const values = [req.params.sold, parseInt(req.params.id)];
    db.getConnectionPool().connect((err, client, done) =>{
        if (err) throw err;
        client.query(sqlStatement, values)
        .then(result => {
            done();
            res.status(200).json({
                status:"success",
                data:result.rows[0]
            });
        })
        .catch(err => res.status(400).json({
            status:"error", error:err.message
        }));
    })
};

const deleteProperty = (req, res) =>{
    const sqlStatement = "DELETE FROM PROPERTY WHERE id = $1 RETURNING *;";
    const values = [parseInt(req.params.id)];
    db.getConnectionPool().connect((err, client, done)=>{
        if (err) throw err;
        client.query(sqlStatement, values)
            .then(result =>{
                done();
                if (!result || result.rowCount < 1) throw new Error("No record deleted");
                res.status(200).json({
                    status:"success",
                    data:{message: "Operation successful"}
                });
            })
            .catch(err => res.status(404).json({
                status:"error", error:err.message
            }));
    });

}

const findAllProperties = (req, res) =>{
    const sqlStatement = "SELECT id, status, type, state, city, address, price, created_on, image_url FROM PROPERTY ORDER BY id ASC;";
    db.getConnectionPool().connect((err, client, done) =>{
        if (err) throw err;
        client.query(sqlStatement)
            .then(results => {
                    done();
                    if(!results || results.rowCount < 1) throw new Error("No record found");
                    res.status(200).json({
                        status:200,
                        data:results.rows
                });
            })
            .catch(err => res.status(404).json({
                status:"error", error:err.message
            }));
    });
    
};

const findPropertyByType = (req, res) =>{
    const sqlStatement = "SELECT id, status, type, state, city, address, price, created_on, image_url FROM PROPERTY WHERE type = $1 ORDER BY id ASC;";
    const values = [req.query.type];
    db.getConnectionPool().connect((err, client, done) =>{
        if (err) throw err;
        client.query(sqlStatement,values)
            .then(results => {
                done();
                if (!results || results.rowCount < 1) throw new Error("No Records!");
                res.status(200).json({
                    status:200,
                    data:results.rows
                });
            })
            .catch(err => res.status(404).json({
                status:"error", error:err.message
            }));
    });

};

const findPropertyById = (req, res) => {
    const sqlStatement = "SELECT id, status, type, state, city, address, price, created_on, image_url FROM PROPERTY WHERE id = $1;";
    const values = [parseInt(req.params.id)];
    db.getConnectionPool().connect((err, client, done) =>{
        if (err) throw err;
        client.query(sqlStatement, values)
            .then(results => {
                done();
                if (results.rowCount < 1) throw new Error("No record found");
                res.status(200).json({
                    status:200,
                    data:results.rows[0]
                });
            })
            .catch(err=> res.status(404).json({
                status:"error", error:err.message
            }));
    });
};

export {
    postPropertyAdvert, updateProperty, markAsSold, 
    deleteProperty, findAllProperties, findPropertyByType,
    findPropertyById
};