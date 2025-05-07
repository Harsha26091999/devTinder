const express = require('express');
const {auth} = require('./middleware/auth');

const app = express();

/**
 * Added middleware seperate file and used it in app.js
 */

app.use("/user", auth);

app.get("/user", (req, res, next) => {
    res.send('List of Users');
});

app.post("/user", (req, res, next) => {
    res.send('Single user');
});


app.listen(7777);