
import express from "express";
import appV1 from "./route/api.v1.js";
import fileUpload from "express-fileupload";

const app = express();
app.set('port', 3999);
app.set('space', 4);
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(fileUpload({
    useTempFiles:true
}));
app.use("/api/v1", appV1);
app.use("/",appV1);


if (process.env.NODE_ENV !== 'test'){
    app.listen (app.get('port'), () => console.log(`Listening on port - ${app.get('port')}`));
}

export default app;