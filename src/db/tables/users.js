const usersTableTemplate =`
    CREATE TABLE IF NOT EXISTS USERS(
        id SERIAL PRIMARY KEY,
        email VARCHAR(30) NOT NULL UNIQUE,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        password VARCHAR(30) NOT NULL,
        phoneNumber VARCHAR(12) NOT NULL,
        address VARCHAR(60) NOT NULL,
        is_admin BOOLEAN NOT NULL
    );
    ALTER TABLE IF EXISTS USERS OWNER TO RICHARD;
`;

const usersTestTableTemplate = `
    CREATE TABLE IF NOT EXISTS USERSTEST(
        id SERIAL PRIMARY KEY,
        email VARCHAR(30) NOT NULL UNIQUE,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        password VARCHAR(30) NOT NULL,
        phoneNumber VARCHAR(12) NOT NULL,
        address VARCHAR(60) NOT NULL,
        is_admin BOOLEAN NOT NULL
    );
    ALTER TABLE IF EXISTS USERSTEST OWNER TO RICHARD;
    `;

export default usersTableTemplate;

export {usersTestTableTemplate};