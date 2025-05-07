const express = require('express');

const app = express();


app.get('/test',(req, res)=> {
    res.send('Get Request from test');
});

app.post('/test',(req, res)=> {
    res.send('Post Request from test');
});

app.put('/test',(req, res)=> {
    res.send('Put Request from test');
});

app.patch('/test',(req, res)=> {
    res.send('Patch Request from test');
});

app.delete('/test',(req, res)=> {
    res.send('Delete Request from test');
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