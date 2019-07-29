import dotenv from 'dotenv';
import Flag from '../entity/flag.js';
import {validationResult} from 'express-validator';
import Db from '../db/db.js';

dotenv.config();

const db = Db.getInstance();

const createFlag = (requestBody) =>{
    const flag = new Flag.Builder()
    .setCreatedOn().build();
    Object.keys(flag).forEach(key =>{
        if (Object.keys(requestBody).includes(key)){
            flag[key] = requestBody[key];
        }
    });
    return flag;
};

const flagProperty = (req, res) =>{
    const validatorError = validationResult(req);
    if (!validatorError.isEmpty()){
        return res.status(422).json({
            status:'error',
            error:validatorError.array()
        });
    }

    const flag = createFlag(req.body);
    const {property_id,created_on,reason,description} = flag;
    const values = [property_id, created_on, reason, description];
    const sqlStatement = `INSERT INTO FLAGS(property_id, created_on, 
        reason, description) VALUES ($1,$2,$3,$4) RETURNING *`;
    db.query(sqlStatement, values)
        .then(results =>{
            const record = results.rows[0];
            res.status(201).json({
                status:'success',
                data: record
            });
        })
};

export default flagProperty;