import app from '../src/index.js';
import {beforeEach, describe, it} from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import chaiAsPromised from "chai-as-promised";
import Property from "../src/entity/property.js";
import {propertyStore} from "../src/route/api.v1.js";


const expect = chai.expect;
const responseBodyKeys = ["status","data"];
const propertyDataKeys = ["id","status","price","state","address","type","created_on","image_url"];
chai.use(chaiHttp);
chai.use(chaiAsPromised);

const createProperty = () =>{
    const property = new Property.Builder()
                        .setOwner("2")
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

describe("api.v1 routes: Property", () =>{

    const property = createProperty();
    
    beforeEach(() =>{
        return propertyStore.erase()
            .then(()=> propertyStore.insert(property));
    });

    describe("POST/property", () =>{
        it("Should create a new property", () =>{
            return chai.request(app)
                .post("/property")
                .send({
                    owner: "1",
                    status: "available",
                    price: 60000,
                    state: "Niger",
                    city: "Pkico",
                    address: "No.12 Ali road",
                    type: "Duplex",
                    image_url: "xxxx-xxxx-xxxx"
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
    });

    describe("PATCH/property/<:property_id>", () =>{
        it("Should update a property", ()=>{
            const updatePrice = 45000.00;
            const updatePath = 'cdn.cloud/property/images'; 
            return chai.request(app)
                    .patch(`/property/${property.id}`)
                    .send({
                        price:updatePrice,
                        image_url:updatePath
                    })
                    .then(res =>{
                            expect(res).to.not.be.undefined;
                            expect(res).to.have.status(200); 
                            expect(res.body).to.include.keys(responseBodyKeys);
                            expect(res.body.data).to.include.keys(propertyDataKeys);
                            expect(res.body.data.price).to.eql(updatePrice);
                            expect(res.body.data.image_url).to.eql(updatePath);
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
                    expect(res).to.have.status(200)
                    expect(res.body).to.include.keys(responseBodyKeys);
                    expect(res.body.data).to.include.keys(propertyDataKeys);
                    expect(res.body.data.status).to.eql("sold");
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
                    expect(res).to.have.status(200);
                    expect(res.body).include.keys(responseBodyKeys);
                    expect(res.body.data).to.have.property("message");
                })
                .catch((err) => expect(err).to.be.rejected);
        });
    });

    describe("GET/property/", () =>{
        it("Should get all properties", () =>{
            return chai.request(app)
                .get("/property")
                .then((res) =>{
                    expect(res.body).to.include.keys(responseBodyKeys);
                    expect(res.body.status).to.be.a("number");
                    expect(res.body.data).to.be.a("array");
                    res.body.data.forEach(datum => expect(datum).to.include.keys(propertyDataKeys));
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
                    expect(res.body).to.have.status(200);
                    expect(res.body).to.include.keys(responseBodyKeys);
                    expect(res.body.status).to.be.a("number");
                    expect(res.body.data).to.be.a("array");
                    (res.body.data).forEach(datum => expect(datum).to.include
                    .keys(propertyDataKeys));
                    
                })
                .catch((err) => expect(err).to.be.rejected);
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
                    expect(res.body.status).to.be.a("number");
                    expect(res.body.data).to.not.be.empty;
                    expect(res.body.data).to.be.a("object");
                    expect(res.body.data).to.include.keys(propertyDataKeys); 
                })
                .catch((err) => expect(err).to.be.rejected);
        });
    });
});

