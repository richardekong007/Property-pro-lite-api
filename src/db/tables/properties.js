import dotenv from 'dotenv';

dotenv.config();

const tableUser = (process.env.NODE_ENV !== 'test')? process.env.DB_USER : process.env.DB_USER_TEST;

const statements = [
    `CREATE TABLE IF NOT EXISTS PROPERTY(`,
    `id SERIAL PRIMARY KEY,`,
    `owner INTEGER NOT NULL,`,
    `status VARCHAR(30) NOT NULL,`,
    `price FLOAT NOT NULL,`,
    `state VARCHAR(30) NOT NULL,`,
    `city VARCHAR(30) NOT NULL,`,
    `address VARCHAR(30) NOT NULL,`,
    `type VARCHAR(30) NOT NULL,`,
    `created_on TIMESTAMPTZ NOT NULL,`,
    `image_url VARCHAR(120) NOT NULL );`,
];

if (tableUser === process.env.DB_USER_TEST){ 
    statements.unshift(`DROP TABLE IF EXISTS PROPERTY CASCADE;`);
}

if (tableUser === process.env.DB_USER){
    statements.push(
        `ALTER TABLE PROPERTY DROP CONSTRAINT IF EXISTS prop_const_fkey;`,
        `ALTER TABLE PROPERTY ADD CONSTRAINT prop_const_fkey`,
        `FOREIGN KEY(owner) REFERENCES USERS (id) ON DELETE CASCADE ON UPDATE CASCADE;`
    );
}

statements.push(`ALTER TABLE IF EXISTS PROPERTY OWNER TO ${tableUser};`);    

const propertyTemplate = statements.join(' ');

export default propertyTemplate;
