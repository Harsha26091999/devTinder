const express = require('express');

const app = express();

/**
 * Added middleware seperate file and used it in app.js
 */


app.get("/user", (req, res, next) => {
    throw Error('Erorr');
    // res.send('List of Users');
});

app.post("/user", (req, res, next) => {
    res.send('Single user');
});

// This is a wild card error handling before this always use try catch block
app.use('/', (err, req, res, next) => {
    res.status(500).send('Something went wrong');
})


app.listen(7777);