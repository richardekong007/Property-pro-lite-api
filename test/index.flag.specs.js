import app from '../src/index.js';
import {after, before, describe, it} from 'mocha';
import DB from '../src/db/db.js';
import chai from "chai";
import chaiHttp from "chai-http";
import chaiAsPromised from "chai-as-promised";
import Flag from '../src/entity/flag.js';
import '../test/index.user.specs';

const db = DB.getInstance();

const responseBodyKeys = ['status','data'];
const flagResponseKey = ['property_id','reason','description','created_on'];
const expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiAsPromised);

const createFlag = () =>{
    const flag = new Flag.Builder()
                         .setPropertyId(1)
                         .setReason('Weird price')
                         .setDescription('Location not good enough')
                         .setCreatedOn()
                         .build();
    return flag; 
};


describe('api.v1 routes: Flag', () =>{
    const flag = createFlag();

    const sqlStatement = 'INSERT INTO FLAGS(property_id, created_on, reason, description) VALUES ($1,$2,$3,$4) RETURNING *';

    const {property_id, created_on, reason, description} = flag;

    const values = [property_id,created_on, reason, description];

    before(done =>{
        db.getConnectionPool()
            .connect((err,client,cb) =>{
                if (err) console.log(err.message); 
                client.query(sqlStatement,values)
                    .then(results =>{
                        cb();
                        if (results.rowCount < 1) 
                            console.log('No property flaged') 
                        flag.id = results.rows[0].id
                    })
                    .catch(err => alert(err));
            });
        done();
    });

    after(done =>{
        const table = "FLAGS";
        db.clearTable(table);
        done();
    });

    describe('POST/flag', () =>{
        it('should flag/report a posted Ad', () =>{
            return chai.request(app)
                    .post('/flag')
                    .send({
                        property_id:1,
                        created_on: new Date(),
                        reason:'Low property maintance',
                        description:'Poor housing facility'
                    })
                    .then(res =>{
                        expect(res).to.not.be.undefined;
                        expect(res).to.have.status(201);
                        expect(res.body).to.not.be.empty;
                        expect(res.body).to.include.keys(responseBodyKeys);
                        expect(res.body.data).to.not.be.empty;
                        expect(res.body.data).to.include.keys(flagResponseKey);
                        Object.values(res.body.data)
                            .forEach(value => expect(value).to.not.be.undefined);
                    })
                    .catch(err => expect(err).to.be.rejected);

        });
    });
});

