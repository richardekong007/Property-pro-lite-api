import dotenv from 'dotenv';
dotenv.config();

const tableUser = (process.env.NODE_ENV !== 'test') ? process.env.DB_USER : process.env.DB_USER_TEST;

const statements = [
        `CREATE TABLE IF NOT EXISTS FLAGS (`,
        `id SERIAL primary key,`,
        `property_id INTEGER NOT NULL,`,
        `created_on TIMESTAMPTZ NOT NULL,`,
        `reason VARCHAR(200) NOT NULL,`,
        `description VARCHAR(200) NOT NULL );`,
        
];

if (tableUser === process.env.DB_USER_TEST){
    statements.unshift(`DROP TABLE IF EXISTS FLAGS CASCADE;`);
}

if (tableUser === process.env.DB_USER){
    statements.push(
        `ALTER TABLE FLAGS DROP CONSTRAINT IF EXISTS flag_const_fkey;`,
        `ALTER TABLE FLAGS ADD CONSTRAINT flag_const_fkey`,
        `FOREIGN KEY(property_id) REFERENCES PROPERTY (id) ON DELETE CASCADE ON UPDATE CASCADE;`
    );
}

statements.push(`ALTER TABLE IF EXISTS FLAGS OWNER TO ${tableUser};`);

const flagsTemplate = statements.join(' ');

export default flagsTemplate;