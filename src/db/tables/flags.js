import dotenv from 'dotenv';
dotenv.config();

const tableUser = (process.env.NODE_ENV !== 'test') ? process.env.DB_USER : process.env.DB_USER_TEST;

const testTemplate = `CREATE TABLE IF NOT EXISTS FLAGS (
                        id SERIAL primary key,
                        property_id INTEGER NOT NULL,
                        created_on TIMESTAMPTZ NOT NULL,
                        reason VARCHAR(200) NOT NULL,
                        description VARCHAR(200) NOT NULL );
                        ALTER TABLE IF EXISTS FLAGS OWNER TO ${tableUser};
                        `;

const devTemplate = `CREATE TABLE IF NOT EXISTS FLAGS (
                        id SERIAL primary key,
                        property_id INTEGER NOT NULL,
                        created_on TIMESTAMPTZ NOT NULL,
                        reason VARCHAR(200) NOT NULL,
                        description VARCHAR(200) NOT NULL,
                        FOREIGN KEY(property_id) REFERENCES PROPERTY(id)
                        ON DELETE CASCADE ON UPDATE CASCADE );
                        ALTER TABLE IF EXISTS FLAGS OWNER TO ${tableUser}
                        `;

const flagsTemplate = (process.env.NODE_ENV === process.env.DB_USER_TEST)? testTemplate : devTemplate;

export default flagsTemplate;