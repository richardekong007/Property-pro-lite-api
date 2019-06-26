import app from '../src/index.js';
import {beforeEach, describe, it} from "mocha";
import chai from "chai";
import supertest from "supertest";
import Property from "../src/entity/property.js";
import properties from "../src/store/properties.js";
import StoreManager from "../src/store/storeManager.js";


const request = supertest(app);
const expect = chai.expect;
const responseBodyKeys = ["status","data"];
let aProperty;

const createProperty = () =>{
    const property = new Property.Builder()
                        .setId('001')
                        .setOwner('002')
                        .setStatus('Available')
                        .setPrice(50000.00)
                        .setState('GA')
                        .setCity('Austel')
                        .setAddress('4568 Maidison circle')
                        .setType('Duplex')
                        .setCreatedOn()
                        .setImageUrl('')
                        .build();
    return property;
};

beforeEach(done =>{
    aProperty = createProperty();
    const storeMngr = StoreManager.mount(properties);
    storeMngr.erase()
        .then(() => storeMngr.insert(aProperty))
        .then(() => done());
});

describe("POST/property", () =>{
    it("should create a property", done =>{
        Object.keys(aProperty).forEach(key => expect(aProperty[key]).to.not.be.undefined);
        request.post("/property")
        .send(aProperty)
        .expect(200)
        .end((err, res) =>{
            expect(res.body).to.include.keys(responseBodyKeys);
            expect(res.body.data).to.to.include.keys(Object.keys(aProperty));
            done(err);
        });
    });
});

describe("PATCH/property/<:property-id>", () =>{
    it("should update property", done =>{
        const updatePrice = 45000.00;
        const updatePath = 'cdn.cloud/property/images';
        expect(aProperty).to.include.keys("price","image_url");
        request.patch(`/property/${aProperty.id}`)
            .send({
                price: updatePrice,
                image_url: updatePath
            })
            .expect(204)
            .end((err,res) =>{
                expect(res.body).to.include.keys(responseBodyKeys);
                expect(res.body.data).to.include.keys(Object.keys(aProperty));
                expect(res.body.data.price).to.eql(updatePrice);
                expect(res.body.data.image_url).to.eql(updatePath);
                done(err);
            });
    });
});

describe("PATCH/property/<:property-id>/sold", () =>{
    it("should mark a property as sold", done =>{

        expect(aProperty).to.include.keys("status");
        request.patch(`/property/${aProperty.id}/sold`)
            .send({
                status:"sold"
            })
            .expect(204)
            .end((err, res) =>{
                expect(res.body).to.include.keys(responseBodyKeys);
                expect(res.body.data).to.include.keys(Object.keys(aProperty));
                expect(res.body.data.status).to.eql("sold");
                done(err);
            });
    });
});

describe("DELETE/property/<:property-id>", () =>{
    it("should delete a property advert", done => {
        request.delete(`/property/${aProperty.id}`)
            .expect(204)
            .end((err, res) =>{
                expect(res.body).include.keys(responseBodyKeys);
                expect(res.body.data).to.have.property("message");
                done(err);
            });
    });
});

describe("GET/property", () => {
    it("should get all property advert", done =>{
        request.get("/property")
            .expect(200)
            .end((err,res) =>{
                expect(res.body).to.include.keys(responseBodyKeys);
                expect(res.body.data).to.be.a(Array);
                expect(res.body.data[0]).to.include.keys(Object.keys(aProperty));
                done(err);
            });
    });
});

describe("GET/property?type=propertyType", () =>{
    it("should get all property of a specific type", done =>{
        const propertyType = "Duplex"
        request.get(`/property?type=${propertyType}`)
                .expect(200)
                .end((err,res) => {
                    expect(res.body).to.include.keys(responseBodyKeys);
                    expect(res.body.data).to.be.a(Array);
                    expect(res.body.data[0]).to.include.keys(Object.keys(aProperty));
                    expect(res.body.data[0].type).to.eql(propertyType);
                    done(err);
                });
    });
});

describe("GET/property/<:property-id>", ()=>{
    it("should get a specific property", done =>{
        request.get(`/property/${aProperty.id}`)
            .expect(200)
            .end((err, res) =>{
                expect(res.body).to.include.keys(responseBodyKeys);
                expect(res.body.data).to.include.keys(Object.keys(aProperty));
                done(err);
            });
    });
});
