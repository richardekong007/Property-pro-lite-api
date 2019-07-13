import dotenv from 'dotenv';

dotenv.config();

const config = {
    test:{
        user: process.env.DB_USER_TEST,
        database: process.env.DB_TEST,
        password: process.env.DB_PSWD_TEST,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        max: process.env.DB_MAX_CONN,
        idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_MILLIS,
        ssl: !(process.env.DB_HOST === 'localhost')
    },
    dev:{
        user: process.env.DB_USER,
        database: process.env.DB,
        password: process.env.DB_PSWD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        max: process.env.DB_MAX_CONN,
        idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_MILLIS,
        ssl: !(process.env.DB_HOST === 'localhost')
    }
};

export default config;