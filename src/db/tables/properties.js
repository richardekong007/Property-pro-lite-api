import dotenv from 'dotenv';

dotenv.config();

const tableUser = (process.env.NODE_ENV !== 'test')? process.env.DB_USER : process.env.DB_USER_TEST;


const propertyTemplate = `
    CREATE TABLE IF NOT EXISTS PROPERTY (
        id SERIAL PRIMARY KEY,
        owner INTEGER NOT NULL,
        status VARCHAR(30) NOT NULL,
        price FLOAT NOT NULL,
        state VARCHAR(30) NOT NULL,
        city VARCHAR(30) NOT NULL,
        address VARCHAR(30) NOT NULL,
        type VARCHAR(30) NOT NULL,
        created_on TIMESTAMPTZ NOT NULL,
        image_url VARCHAR(120) NOT NULL,
        FOREIGN KEY (owner) REFERENCES USERS(id)
    );

    ALTER TABLE IF EXISTS PROPERTY OWNER TO ${tableUser};
`;


export default propertyTemplate;
