import Db from '../src/db/db.js';


const grantOrDeny = (req, res, next) =>{

    const sqlStatment = 'SELECT owner FROM PROPERTY WHERE id = $1;';
    const values = [parseInt(req.params.id)];
    const db = Db.getInstance()
        db.getConnectionPool()
            .connect((err, client, releaseClient) =>{
                if (err) {
                    return res.status(500).json({
                        status:"success",
                        error:"Server error!"
                    });
                }
                client.query(sqlStatment, values)
                    .then((result) =>{
                        releaseClient();
                        if (result.rowCount < 1){
                            return res.status(404).json({
                                status:"error",
                                error:"No such property!"
                            });
                        }
                        const {owner} = result.rows[0];
                        req.owner = owner;

                        if (req.decodedToken.id !== owner){
                            return res.status(403).json({
                                status:"error",
                                error:"No permission granted!"
                            });
                        }
                        next();
                    })
                    .catch(err =>{
                        return res.status(400).json({
                            status:"error",
                            error:err.stack
                        });
                    })
                    .then(() => db.getConnectionPool().end());
            });
            
};

export default grantOrDeny;
