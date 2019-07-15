import app from "../src/index.js";
import {describe, before, it} from "mocha";
import chai from "chai";
import User from "../src/entity/user.js";
import Db from "../src/db/db.js";
import bcrypt from "bcrypt";

const db = Db.getInstance();

const createUser = () =>{
    
    const user = new User.Builder()
        .setFirstName('Kong')
        .setLastName('Badass')
        .setEmail('kong@mail.net')
        .setAddress('No.5 Makspeson Avenue')
        .setPhoneNumber('0803737646')
        .setPassword('Kongass10')
        .build();
        
    return user;
};

const expect = chai.expect;

const resBodyKeys = ["status","data"];

const userResDataKeys = ["token","id","first_name","last_name","email"];

describe("api.v1 Route: user", () =>{
    const user = createUser();

    const sqlStatement = "INSERT INTO USERS(email, first_name, last_name,password, phone_number, address) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *";

    const {email, first_name, last_name, password, phone_number, address} = user;

    const saltRounds = 10;

    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const values = [email,first_name,last_name,hashedPassword,phone_number,address];

    before(() => {
       return db.query(sqlStatement, values)
                .then()
                .catch((err) => alert(err.message));
    });

    describe("POST/auth/signup", () =>{
        it("Should signup a new user", () =>{
            return chai.request(app)
                .post("/auth/signup")
                .send({
                    first_name:"Bong",
                    last_name:"Sallim",
                    email:"bong2@mail.net",
                    address:"No.2 RedVille circle",
                    phone_number:"0803737435",
                    password:"Bongzooki7",
                    is_admin:"false"
                })
                .then((res) =>{
                    expect(res).to.have.status(201);
                    expect(res.body).to.include.keys(resBodyKeys);
                    expect(res.body.data).to.include.keys(userResDataKeys);
                    expect(res.body.data.token).to.not.be.empty;
                })
                .catch((err) => expect(err).to.be.rejected);
        });
    });

    describe("POST/auth/signin", () =>{
        it("Should signin an existing user", () =>{
            const email = "bong2@mail.net";
            const password = "Bongzooki7";
            return chai.request(app)
                .post("/auth/signin")
                .send({
                    email:email,
                    password:password
                })
                .then((res) =>{
                    expect(res).to.have.status(200);
                    expect(res.body).to.include.keys(resBodyKeys);
                    expect(res.body.data).to.include.keys(userResDataKeys);
                    expect(res.body.data.token).to.not.be.empty;
                })
                .catch((err) => expect(err).to.be.rejected);
        });
    });
});

