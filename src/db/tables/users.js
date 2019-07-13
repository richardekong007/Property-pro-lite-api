import dotenv from 'dotenv';

dotenv.config();

const tableUser = (process.env.NODE_ENV !== 'test')? process.env.DB_USER : process.env.DB_USER_TEST;

const statements = [
        `CREATE TABLE IF NOT EXISTS USERS(`,
        `id SERIAL PRIMARY KEY,`,
        `email VARCHAR(30) NOT NULL UNIQUE,`,
        `first_name VARCHAR(30) NOT NULL,`,
        `last_name VARCHAR(30) NOT NULL,`,
        `password VARCHAR(100) NOT NULL,`,
        `phoneNumber VARCHAR(12) NOT NULL,`,
        `address VARCHAR(60) NOT NULL,`,
        `is_admin BOOLEAN NOT NULL);`,
        `ALTER TABLE IF EXISTS USERS OWNER TO ${tableUser};`
];

if (tableUser === process.env.DB_USER_TEST){
    statements.unshift(`DROP TABLE IF EXISTS USERS;`);
}

const usersTableTemplate = statements.join(' ');


export default usersTableTemplate;
