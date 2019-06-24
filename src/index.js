<<<<<<< HEAD
const app = {};
//awaiting TDD
module.exports = app;
=======
import express from "express";

const app = express();
app.set('port', 3999);
app.set('space', 4);
app.listen (app.get('port'), () => console.log(`Listening on port - ${app.get('port')}`));
>>>>>>> 064d93f0990955bb3b537cfc05c4f4b671c99a27
