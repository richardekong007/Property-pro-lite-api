import {Pool} from 'pg';
import dotenv from 'dotenv';
import usersTableTemplate from './tables/users.js'
import propertyTemplate from './tables/properties.js';
import flagsTemplate from './tables/flags.js';
import config from '../db/config.js';

dotenv.config();

class Db {

    constructor (){

        if (process.env.NODE_ENV !== "test"){
            this._dbPool = new Pool(config.dev);
        }else{
            this._dbPool = new Pool(config.test);
        }
        this.setupTables();  
        console.log("Environment:",process.env.NODE_ENV);
    }

    static getInstance (){
        return new Db();
    }

    createTable (queryText){
        this._dbPool.connect((err, client, done) =>{
             if (err) console.log(err);
             client.query(queryText)
                    .then(results => {
                        done();
                        results.forEach(result=> console.log(`EXECUTED ${result.command} COMMAND`));
                    })
                    .catch(err => console.error(err));
        });

    }

    setupTables (){
        this.createTable(usersTableTemplate);
        this.createTable(propertyTemplate);
        this.createTable(flagsTemplate);
    }

    dropTable (table){
        const stmt = `DROP TABLE IF EXISTS ${table} CASCADE;`;
        this._dbPool.connect((err, client, done)=> {
            if (err) console.log(err);
            client.query(stmt)
                .then(() => done())
                .catch(err => {
                    throw err;
                });
        });
            
    }

    clearTable (table){
        const stmt = `DELETE FROM ${table} CASCADE;`;
        this._dbPool.connect((err, client, done) =>{
            if (err) console.log(err);
            client.query(stmt)
                .then(()=> done())
                .catch(err => console.log(err));
        });
    }

    getConnectionPool (){
        return this._dbPool;
    }

    query (queryText, values){
        return this._dbPool.query(queryText, values);
    }

    findOne (table, data){
        const column = Object.keys(data)[0];
        const values = [Object.values(data)[0]];
        const sqlStatement = `SELECT * FROM ${table} WHERE ${column} = $1`;
        return this._dbPool.query(sqlStatement, values);
    }

}

export default Db;

