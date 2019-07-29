import app from '../src/index.js';
import {before,describe, it} from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import chaiAsPromised from "chai-as-promised";
import Property from "../src/entity/property.js";
import Db from '../src/db/db.js';
import "../test/index.user.specs.js";
import propertyTemplate from '../src/db/tables/properties.js';

const db = Db.getInstance();
const expect = chai.expect;
const responseBodyKeys = ["status","data"];
const propertyDataKeys = ["id","status","price","state","address","type","created_on","image_url"];
const errorkeys = ["status", "error"];
chai.use(chaiHttp);
chai.use(chaiAsPromised);


const createProperty = () =>{
    const property = new Property.Builder()
                        .setOwner(1)
                        .setPrice(50000.00)
                        .setState('GA')
                        .setCity('Austel')
                        .setAddress('4568 Maidison circle')
                        .setType('Duplex')
                        .setCreatedOn()
                        .setImageUrl('xxx-xx-xx-x-x')
                        .build();
    return property;
};

describe("api.v1 routes: Property", () =>{
    const property = createProperty();
    const {owner,price,state,city,address,type,created_on,image_url} = property;
    const values = [owner,price,state,city,address,type,created_on,image_url];
    const sqlStatement = "INSERT INTO PROPERTY(owner,price,state,city,address,type,created_on,image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;";
    before(() =>{
        return db.getConnectionPool()
                 .connect((err, client, cb) =>{
                    if (err) throw err;
                        client.query(sqlStatement, values)
                           .then(result => {
                                cb();
                                property.id = result.rows[0].id;
                           })
                           .catch(err => err);
                    });
        
    });

    describe("POST/property", () =>{
        it("Should create a new property", () =>{
                return chai.request(app)
                .post("/property")
                .send({
                    owner: property.owner,
                    price: 60000,
                    state: "Niger",
                    city: "Pkico",
                    address: "No.12 Ali road",
                    type: "Duplex",
                    image_url: "xxxxxxxxx"
                })
                .then(res =>{
                    expect(res).to.not.be.undefined;
                    expect(res).to.have.status(201);
                    expect(res.body).to.not.be.empty;
                    expect(res.body).to.include.keys(responseBodyKeys);
                    expect(res.body.data).to.not.be.empty;
                    expect(res.body.data).to.include.keys(propertyDataKeys);
                    Object.values(res.body.data)
                        .forEach(value => expect(value).to.not.be.undefined);
                })
                .catch(err => expect(err).to.be.rejected);    
        });

        it ("Should throw error 422 with invalid property input", () =>{
            return chai.request(app)
                    .post("/property")
                    .send({})
                    .then(res =>{
                        expect(res).to.have.status(422);
                    })
                    .catch(err => expect(err).to.be.rejected);
        });

    });

    describe("GET/property/<:propert_id>", () =>{
        it("Should get a specific property", () =>{
            return chai.request(app)
                .get(`/property/${property.id}`)
                .then((res) =>{
                    expect(res).to.not.be.undefined;
                    expect(res).to.have.status(200);
                    expect(res.body).to.not.be.empty;
                    expect(res.body).to.include.keys(responseBodyKeys);
                    expect(res.body.status).to.be.a("string");
                    expect(res.body.data).to.not.be.empty;
                    expect(res.body.data).to.be.a("object");
                    expect(res.body.data).to.include.keys([...propertyDataKeys, "owner_email", "owner_phone_number"]); 
                })
                .catch((err) => expect(err).to.be.rejected);
        });

        it ("Should throw error 404 for requests with wrong id", () =>{
            return chai.request(app)
                    .get(`/property/0`)
                    .then(res => expect(res).to.have.status(404))
                    .catch(err => expect(err).to.be.rejected);
        });
    });

    describe("GET/property/", () =>{
        it("Should get all properties", () =>{
            return chai.request(app)
                .get("/property")
                .then((res) =>{
                    expect(res).to.have.status(200);
                    expect(res.body).to.include.keys(responseBodyKeys);
                    expect(res.body.status).to.be.a("string");
                    expect(res.body.data).to.be.a("array");
                    res.body.data.forEach(datum => expect(datum).to.include
                    .keys([...propertyDataKeys, "owner_email", "owner_phone_number"]));
                })
                .catch((err) => expect(err).to.be.rejected);
        });
    });

    describe("GET/property/type?type=propertyType", ()=>{
        it("Should get all property of a specific type", () =>{
            return chai.request(app)
                .get("/property/type?type=Duplex")
                .then((res) => {
                    expect(res).to.not.be.undefined;
                    expect(res).to.have.status(200);
                    expect(res.body).to.include.keys(responseBodyKeys);
                    expect(res.body.status).to.be.a("string");
                    expect(res.body.data).to.be.a("array");
                    (res.body.data).forEach(datum => expect(datum).to.include
                    .keys([...propertyDataKeys, "owner_email", "owner_phone_number"]));
                    
                })
                .catch((err) => expect(err).to.be.rejected);
        });
    });

    describe("PATCH/property/<:property_id>", () =>{
        it("Should update a property", ()=>{
            const updatePrice = 45000.00; 
            return chai.request(app)
                    .patch(`/property/${property.id}`)
                    .send({
                        price:updatePrice
                    })
                    .then(res =>{
                            expect(res).to.not.be.undefined;
                            if (res.status > 399 && res.status <= 500){
                                expect(res.body).to.include.keys(errorkeys);
                                Object.values(res.body).forEach(val => expect(val).to.not.be.empty);
                            }else if (res.status ===200){
                                expect(res).to.have.status(200); 
                                expect(res.body).to.include.keys(responseBodyKeys);
                                expect(res.body.data).to.include.keys(propertyDataKeys);
                                expect(res.body.data.price).to.eql(updatePrice);
                            }
                    })
                    .catch(err => expect(err).to.be.rejected);
        });
    });

    describe("PATCH/property/<:property_id/<:sold>", () =>{
        it("Should mark a property as sold", () =>{
            return chai.request(app)
                .patch(`/property/${property.id}/${"sold"}`)
                .send({
                    status:"sold"
                })
                .then(res => {
                    expect(res).to.not.be.undefined;
                    if (res.status > 399 && res.status <= 500){
                        expect(res.body).to.include.keys(errorkeys);
                        Object.values(res.body).forEach(val => expect(val).to.not.be.empty);
                    }
                    else if (res.status === 200){
                        expect(res.body).to.include.keys(responseBodyKeys);
                        expect(res.body.data).to.include.keys(propertyDataKeys);
                        expect(res.body.data.status).to.eql("sold");
                    } 
                })
                .catch(err => expect(err).to.be.rejected);
        });
    });


    describe("DELETE/property/<:property_id>", () =>{
        it ("Should delete a property", () => {
            return chai.request(app)
                .delete(`/property/${property.id}`)
                .then((res) =>{
                    expect(res).to.not.be.undefined;
                    if (res.status > 399 && res.status <= 500){
                        expect(res.body).to.include.keys(errorkeys);
                        Object.values(res.body).forEach(val => expect(val).to.not.be.empty);
                    }else if (res.status === 200){
                        expect(res).to.have.status(200);
                        expect(res.body).include.keys(responseBodyKeys);
                        expect(res.body.data).to.have.property("message");
                    }
                })
                .catch((err) => expect(err).to.be.rejected);
        });
    });

});

