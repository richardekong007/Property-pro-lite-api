import express from "express";
import cors from "cors";
import router from "./route/route.js";

const app = express();

app.set('port', process.env.PORT || 3999);
app.set('json spaces', 4);
app.use(cors({
    origin:"*",
    methods:["GET","POST","PATCH","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/api/v1", router);
app.use("/",router);
app.use(express.static("public"));


if (process.env.NODE_ENV !== 'test'){
    app.listen (app.get('port'), () => console.log(`Listening on port - ${app.get('port')}`));
}

export default app;