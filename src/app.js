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

// If we add this as a first route then all the rutes will match with this and prints Hello
app.use("/",(req, res)=> {
    res.send('Hello');
});

app.listen(7777);

/*
app.use will applicable for all the http methods get,post,put, patch and delete
if you want to specify the http method then we need to use predefuined methods like
app.get
app.post etc

Order of the route is very important, if we add app.use('/') at first then all the routes will match that
route and executes that function it is like
'/' = /*
'/test/ = /test/*
*/