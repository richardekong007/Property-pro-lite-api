import app from "../src/index.js";
import {describe, before, it} from "mocha";
import chai from "chai";
import User from "../src/entity/user.js";
import Db from "../src/db/db.js";
import bcrypt from "bcrypt";
import TokenGenerator from "../src/tokenGenerator.js";

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

const errorResBodykeys = ["status", "error"];

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

        it("Should throw error 422 if credential fails validation check", () =>{
            return chai.request(app)
                .post("/auth/signup")
                .send({})
                .then(res => expect(res).to.have.status(422))
                .catch(err => expect(err).to.be.rejected);
        });

        it("should throw error 409 if email exists", () =>{
            return chai.request(app)
                         .post("/auth/signup")
                         .send(user)
                         .then(res =>{
                             expect(res).to.have.status(409);
                             expect(res.body).to.include.keys(errorResBodykeys);
                             expect(res.body.status).to.eqls("error");
                             expect(res.body.error).to.eqls("Email Already exist");
                         })
                         .catch(err => expect(err).to.be.rejected);
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

        it ("Should flag erro 422 for an invalid email", () =>{
            return chai.request(app)
                .post("/auth/signin")
                .send({})
                .then(res => expect(res).to.have.status(422))
                .catch(err => expect(err).to.rejected);
        });

        it ("Should flag error 400 for wrong credential", () =>{
            return chai.request(app)
                .post("/auth/signin")
                .send({
                    email:"vadim@mail.net",
                    password:"Bongzooki7"
                })
                .then(res => expect(res).to.have.status(400))
                .catch(err => expect(err).to.be.rejected);
        });

        it ("Should flag error 400 for wrong password", () =>{
            return chai.request(app)
                .post("/auth/signin")
                .send({
                    email:"bong2@mail.net",
                    password:"Vadim63434"
                })
                .then(res => expect(res).to.have.status(400))
                .catch(err => expect(err).to.be.rejected);
        });
    });

    describe("POST/auth/reset-password-step1", () =>{
        it("Should accept email and provide reset link with status 200", () =>{
            const req = chai.request(app);
            const email = "bong2@mail.net";
            return req.post("/auth/reset-password-step1")
                    .send({email:email})
                    .then(res =>{
                        expect(res).to.have.status(200);
                        expect(res.body).to.include.keys(resBodyKeys);
                        expect(res.body.status).to.be.eqls("success");
                        expect(res.body.data).to.not.be.undefined;
                    })
                    .catch(err => expect(err).to.be.rejected);
        });
        
        it("Should alert an error when email is not provided or undefined, with status 422", () =>{
            const req = chai.request(app);
            return req.post("/auth/reset-password-step1")
                        .send({})
                        .then(res =>{
                            expect(res).to.have.status(422);
                            expect(res.body).to.include.keys(errorResBodykeys);
                            expect(res.body.status).to.be.eqls("error");
                            expect(res.body.error).to.be.eqls("Failed to provide an email");
                        })
                        .catch(err => expect(err).to.be.rejected);
        });

        it("Should alert an error with invalid email and status 422", () => {
            const req = chai.request(app);
            return req.post("/auth/reset-password-step1")
                        .send({email:"bong.mail.net@"})
                        .then(res =>{
                            expect(res).to.have.status(422);
                            expect(res.body).to.include.keys(errorResBodykeys);
                            expect(res.body.status).to.be.eqls("error");
                            expect(res.body.error).to.be.eqls("Invalid email!");
                        })
                        .catch(err => expect(err).to.be.rejected);
        });

        it("shoud alert an error for an unrecognised email with status 400", () =>{
            const req = chai.request(app);
            return req.post("/auth/reset-password-step1")
                    .send({email:"dave@live.com"})
                    .then(res =>{
                        expect(res).to.have.status(400);
                        expect(res.body).to.include.keys(errorResBodykeys);
                        expect(res.body.status).to.be.eqls("error");
                        expect(res.body.error).to.be.eqls("Email not recognised, "
                        +"Please provide your email or Signup again!");
                    })
                    .catch(err => expect(err).to.be.rejected);
        });

    });

    describe("GET/auth/reset-password-step2/:id/:token", () =>{
        const id = 2;
        const email = "bong2@mail.net";
        const secret = process.env.JWT_SECRET;
        const token = TokenGenerator.generatePasswordResetToken({id:id, email:email},secret);
        it("Should provide user id and token with a status 200", () =>{
            const req = chai.request(app);
            return req.get(`/auth/reset-password-step2/${id}/${token}`)
                        .then(res =>{
                            expect(res).to.have.status(200);
                            expect(res.body).to.include.keys(resBodyKeys);
                            expect(res.body.status).to.eqls("success");
                            expect(res.body.data).to.not.be.undefined;
                        })
                        .catch(err => expect(err).to.be.rejected);
        });

        it ("should flag error 404 for wrong id", () => {
            const id = 0;
            const req = chai.request(app);
            return req.get(`/auth/reset-password-step2/${id}/${token}`)
                        .then(res =>{
                            expect(res).to.have.status(404);
                            expect(res.body).to.include.keys(errorResBodykeys);
                            expect(res.body.status).to.eqls("error");
                            expect(res.body.error).to.eqls("Account doesn't exist");
                        })
                        .catch(err => expect(err).to.be.rejected);

        });
    });

    describe("POST/auth/reset-password-step2", () =>{
        const id = 2;
        const email = "bong2@mail.net";
        const secret = process.env.JWT_SECRET;
        const token = TokenGenerator.generatePasswordResetToken({id:id, email:email},secret);
        const password = "Vlad008432";
        const body = {id:id, token:token, password:password};
        it ("Should reset user passowrd with a new one with status 200", () =>{
            const req = chai.request(app);
            return req.post("/auth/reset-password-step2")
                    .send(body)
                    .then(res =>{
                        expect(res).to.have.status(200);
                        expect(res.body).include.keys(resBodyKeys);
                        expect(res.body.status).to.eqls("success");
                        expect(res.body.data).to.eqls("Your password has been successfully reset");
                    })
                    .catch(err => expect(err).to.be.rejected);
        });

        it ("Should validate an invalid password with status 422", ()=>{
            const req = chai.request(app);
            const secret = process.env.JWT_SECRET;
            const token = TokenGenerator.generatePasswordResetToken({id:id, email:"bong2@mail.net"},secret);
            const body = {id:2, token:token, password:"vlad008432"};
            return req.post("/auth/reset-password-step2")
                    .send(body)
                    .then(res =>{
                        expect(res).to.have.status(422);
                        expect(res.body).include.keys(errorResBodykeys);
                        expect(res.body.status).to.eqls("error");
                        expect(res.body.error).to.be.a('string');
                    })
                    .catch(err => expect(err).to.be.rejected);
        });

        it ("Should flag error 404 if wrong id is provided", () =>{
            const req = chai.request(app);
            const secret = process.env.JWT_SECRET;
            const token = TokenGenerator.generatePasswordResetToken({id:id, email:"bong2@mail.net"},secret);
            const body = {id:5, token:token, password:"Vlad008432"};
            return req.post("/auth/reset-password-step2")
                    .send(body)
                    .then(res =>{
                        expect(res).to.have.status(404);
                        expect(res.body).include.keys(errorResBodykeys);
                        expect(res.body.status).to.eqls("error");
                        expect(res.body.error).to.eql("Account doesn't exist");
                    })
                    .catch(err => expect(err).to.be.rejected);
        });
    });

});

