import app from "../src/index.js";
import {describe, beforeEach, it} from "mocha";
import chai from "chai";
import supertest from "supertest";
import User from "../src/entity/user.js";
import users from "../src/store/users.js"
import StoreManager from "../src/store/storeManager.js";

const createUser = () =>{
    const user = new User.Builder()
        .setId('001')
        .setFirstName('Kong')
        .setLastName('Badass')
        .setEmail('kong@mail.net')
        .setAddress('No.5 Makspeson Avenue')
        .setPhoneNumber('0803737646')
        .setPassword('@#%^@$*')
        .setIsAdmin(true)
        .build();
        
        return user;
};


const request = supertest(app);
const expect = chai.expect;
const aUser = createUser();
const resBodyKeys = ["status","data"];
const userResDataKeys = ["token","id","first_name","last_name","email","password","phoneNumber","address","is_admin"];


beforeEach((done) =>{
    const storeMgnr = StoreManager.mount(users);
    storeMgnr.erase()
        .then(() => storeMgnr.insert(aUser))
        .then(() => done());
});

describe("POST/auth/signup", ()=>{
    it("should signup a new user", done =>{
        Object.keys(aUser).forEach(key => expect(aUser[key]).to.not.be.undefined);
        request.post("/auth/signup")
            .send(aUser)
            .expect(200)
            .end((err,res)=>{
                expect(res.body).to.include.keys(resBodyKeys);
                expect(res.body.data).to.include.keys(userResDataKeys);
                done(err);
            });
    })
});

describe("POST/auth/signin", ()=>{
    it("should signin user", done =>{
        
        request.post("/auth/signin")
            .send({email:aUser.email, password:aUser.password})
            .expect(200)
            .end((err,res) =>{
                expect(res.body).to.include.keys(resBodyKeys);
                expect(res.body.data).to.include.keys(userResDataKeys);
                done(err);
            });
    });
});

