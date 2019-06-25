
import express from "express";

const app = express();
app.set('port', 3999);
app.set('space', 4);
app.listen (app.get('port'), () => console.log(`Listening on port - ${app.get('port')}`));
