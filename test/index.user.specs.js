import app from "../src/index.js";
import {describe, beforeEach, it, afterEach} from "mocha";
import chai from "chai";
import User from "../src/entity/user.js";
import userStore from "../src/route/controllers/user.controller.js";




const createUser = () =>{
    const user = new User.Builder()
        .setFirstName('Kong')
        .setLastName('Badass')
        .setEmail('kong@mail.net')
        .setAddress('No.5 Makspeson Avenue')
        .setPhoneNumber('0803737646')
        .setPassword('Kongass10')
        .setIsAdmin(true)
        .build();
        
        return user;
};

const expect = chai.expect;
const resBodyKeys = ["status","data"];
const userResDataKeys = ["token","id","first_name","last_name","email"];

describe("api.v1 Route: user", () =>{
    const user = createUser();

    beforeEach(() => {
        return userStore.erase()
            .then(()=> userStore.insert(user));
    });

    afterEach(done =>{
        userStore.restore();
        done();
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
                    phoneNumber:"0803737435",
                    password:"Bongzooki7",
                    is_admin:"false"
                })
                .then((res) =>{
                    expect(res).to.have.status(201);
                    expect(res.body).to.include.keys(resBodyKeys);
                    expect(res.body.data).to.include.keys(userResDataKeys);
                })
                .catch((err) => expect(err).to.be.rejected);
        });
    });

    describe("POST/auth/signin", () =>{
        it("Should signin an existing user", () =>{
            const email = user.email;
            const password = user.password;
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
                })
                .catch((err) => expect(err).to.be.rejected);
        });
    });
});


