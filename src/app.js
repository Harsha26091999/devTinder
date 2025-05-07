const express = require('express');

const app = express();

/**
 * We can have multiple route handlers for a single route
 * In order to call next route handler after executing  we use to call a function next()
 * next(): This function is a parameter of the route handler along with req and res
 * Next route handler will call only if we call next() in the before route handler
 * ##Example 1 if we send res.send() in the first route handler and dont call next then only 1st rout handler will execute 
 * ##Example 2 If we call next() in the 1st route without clling res.send() then 2nd route handler will call and executed
 * ##Example 3 If we send res in rh1 and call next() then res will sent to client and then 2nd rh will executes and gets error in server
 * ##Example 4 If we call next() first and then calls res.send() in rh1 then there are 2 scenarios 
 *         4.1 Sync code: If we have only synchronous code(which doent take time) in rh2 then res will send from rh2
 *         4.2 Async code: If we have some code which takes time to executed in rh2 then res will send from rh1
 * 
 */

// Example 1
// app.get("/test",
//     (req, res, next) => {
//         console.log('Route 1')
//         res.send('Rout handler 1'); // Here with calling next() I sent res to the client so 2nd route is not executed
//     },
//     (req, res, next) => {
//         console.log('Route 2')
//         res.send('Rout handler 2');
//     });

// Example 2
// app.get("/test",
//     (req, res, next) => {
//         console.log('Route 1')
//         next() // As we are calling next() here 2nd route handler is calling and res is sent from send
//     },
//     (req, res, next) => {
//         console.log('Route 2')
//         res.send('Rout handler 2');
//     });

// Example 3
// app.get("/test",
//     (req, res, next) => {
//         console.log('Route 1');
//         res.send('Route handler 1'); // res is sent here and tps connection is closed
//         next(); // calls next() rh2 will executes but failed to send res as connection is already closed
//     },
//     (req, res, next) => {
//         console.log('Route 2')
//         res.send('Rout handler 2');
//     });

//Example 4.1
// app.get("/test",
//     (req, res, next) => {
//         console.log('Route 1');
//         next(); // called and executed
//         res.send('Route handler 1'); // from this we will get errorbecause res is already sent from rh2
//     },
//     (req, res, next) => {
//         console.log('Route 2')
//         res.send('Rout handler 2');// In this scenario there is only sync code so response will sent from rh 2 
//     });

//Example 4.2
app.get("/test",
    (req, res, next) => {
        console.log('Route 1');
        next(); // called and executed
        res.send('Route handler 1'); // we will send res from rh1 because we will have async code in rh2
    },
    (req, res, next) => {
        console.log('Route 2');
        setTimeout(()=> {// In this scenario there is async code so response will sent from rh1
            res.send('Rout handler 2')
        },100);
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