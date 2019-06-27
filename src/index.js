
import express from "express";
import bodyParser from "body-parser";
import appV1 from "./route/api.v1.js";

const app = express();
app.set('port', 3999);
app.set('space', 4);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use("/api/v1", appV1);
app.use("/",appV1);


if (process.env.NODE_ENV !== 'test'){
    app.listen (app.get('port'), () => console.log(`Listening on port - ${app.get('port')}`));
}

export default app;