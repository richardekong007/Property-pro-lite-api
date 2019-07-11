import {Pool} from 'pg';
import dotenv from 'dotenv';
import usersTableTemplate from './tables/users.js'
import propertyTemplate from './tables/properties.js';

dotenv.config();

const devConfig = {
    user: process.env.DB_USER,
    database: process.env.DB,
    password: process.env.DB_PSWD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    max: process.env.DB_MAX_CONN,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_MILLIS
};

const testConfig = {
    user: process.env.DB_USER_TEST,
    database: process.env.DB_TEST,
    password: process.env.DB_PSWD_TEST,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    max: process.env.DB_MAX_CONN,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_MILLIS
}

class Db {

    constructor (){

        if (process.env.NODE_ENV !== "test"){
            this._dbPool = new Pool(devConfig);
        }else{
            this._dbPool = new Pool(testConfig);
        }
        this.setupTables(); 
        console.log("Environment:",process.env.NODE_ENV);
    }

    static getInstance (){
        return new Db();
    }

    createTable (queryText){
        this._dbPool.query(queryText)
            .then(results => results.forEach(result=> console.log(`EXECUTED ${result.command} COMMAND`)))
            .catch(err => console.error(err));
    }

    setupTables (){
        this.createTable(usersTableTemplate);
        this.createTable(propertyTemplate);
    }

    dropTable (table){
        const stmt = `DROP TABLE IF EXISTS ${table} CASCADE;`;
        return this._dbPool.query(stmt);
            
    }

    clearTable (table){
        const stmt = `DELETE FROM ${table} CASCADE;`;
        return this._dbPool.query(stmt);
    }

    getConnectionPool (){
        return this._dbPool;
    }

    query (queryText, values){
        return this._dbPool.query(queryText, values);
    }

}

export default Db;

