import {Pool} from 'pg';
import dotenv from 'dotenv';
import usersTableTemplate, {usersTestTableTemplate} from './tables/users.js'
import propertyTemplate, {propertyTestTemplate} from './tables/properties.js';

dotenv.config();

class Db {

    constructor (){
        this._dbPool = new Pool({
            user: process.env.DB_USER,
            database: process.env.DB,
            password: process.env.DB_PSWD,
            port: process.env.DB_PORT,
            max: process.env.DB_MAX_CONN,
            idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_MILLIS
        });
        this.setupTables();
    }

    static getInstance (){
        return new Db();
    }

    createTable (queryText){
        this._dbPool.query(queryText)
            .then(result => console.log(result))
            .catch(err => console.error(err));
    }

    setupTables (){
        this.createTable(usersTableTemplate);
        this.createTable(usersTestTableTemplate);
        this.createTable(propertyTemplate);
        this.createTable(propertyTestTemplate);
    }

    dropTable (table){
        const stmt = `DROP TABLE IF EXISTS ${table};`;
        console.log(stmt);
        this._dbPool.query(stmt)
            .then(result => console.log(result))
            .catch(err => console.error(err));
    }

    query (queryText, values){
        return this._dbPool.query(queryText, values);
    }

}

export default Db;

