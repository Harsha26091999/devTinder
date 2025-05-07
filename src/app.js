const express = require('express');

const app = express();

/*
Here we have used "tes?t" from this the system came to know that s is an optional character here
so it will work as same for both /test and /tet
*/
app.get("/tes?t", (req, res)=> {
    res.send('? Optional character');
});

/*
Here it is a wild card it will accept "/test/abc",  "/test/123",  "/test/1s3" but not  "/test" because
it expects something after test
*/
app.get("/test/*", (req, res)=> {
    res.send('* matches all the cases');
});

/*
Here when we use + it will accept n number of charaxcters which is beffore + like  "/test", "/tesst", "/tesssst"
*/
app.get('/tes+t', (req, res) => {
    res.send('+ can add n number of character which is before +');
});

/**
 * Hereit is a dynamic route where we can send dynamic data in the url
 */
app.get('/test/:id', (req, res) => {
    res.send('route paramenters');
});

/**
 * Hereit is a dynamic multiple  route where we can send dynamic data in the url
 */
app.get('/test/:userId/book/:bookId', (req, res) => {
    res.send(req.params);
  });



/**
 * Next we can use regex too as a route for more dynamic endpoints
 */
app.get(/\/test\/(\d+)/, (req, res) => {
    res.send('regex route route');
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

/**
 * Pattern	       Meaning	                          Example Route	       Matches
?	         Optional character	                      /colou?r	            /color, /colour
*	         Matches any string (wildcard)	          /file/*	            /file/a/b/c
+	         One or more repetitions (regex only)	  /^\/ab+c$/	        /abc, /abbc
:	         Named route parameter	                  /user/:id	            /user/123
()	         Grouping (in regex)	                  `/^/(foo	            bar)$/`
 */