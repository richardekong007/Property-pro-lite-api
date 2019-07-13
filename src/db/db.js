import {Pool} from 'pg';
import dotenv from 'dotenv';
import usersTableTemplate from './tables/users.js'
import propertyTemplate from './tables/properties.js';
import flagsTemplate from './tables/flags.js';

dotenv.config();

const devConfig = {
    user: process.env.DB_USER,
    database: process.env.DB,
    password: process.env.DB_PSWD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    max: process.env.DB_MAX_CONN,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_MILLIS,
    ssl: !(process.env.DB_HOST === 'localhost')
};

const testConfig = {
    user: process.env.DB_USER_TEST,
    database: process.env.DB_TEST,
    password: process.env.DB_PSWD_TEST,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    max: process.env.DB_MAX_CONN,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_MILLIS,
    ssl: !(process.env.DB_HOST === 'localhost')
    
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

