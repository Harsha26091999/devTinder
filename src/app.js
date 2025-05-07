const express = require('express');

const app = express();

app.use("/test",(req,res)=> {
    res.send('Response from test');
});

app.use("/check",(req,res)=> {
    res.send('Response from check');
});

app.use("/hello",(req,res)=> {
    res.send('Response from hello');
});

app.use((req, res)=> {
    res.send('Hello');
});

app.listen(7777);