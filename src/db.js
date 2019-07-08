import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    database: process.env.DB,
    password: process.env.PWSD,
    port: process.env.DB_PORT,
    max: process.env.DB_MAX_CONN,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_MILLIS
});

export default pool;
