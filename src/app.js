const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

app.post('/signup', (req, res) => {
    const user = new User({
        firstName: 'Harsha',
        lastName: "vardhan",
        age: 29,
        gender: "Male",
        emailId: "Harsha@gmail.com",
        password: "@1235"
    });
    try {
        user.save().then(() => {
            console.log('User Saved');
            res.send('User created succesfully');
        })
            .catch((err) => {
                console.log('Error');
                res.status(500).send('something went wrong');
            })
    } catch (err) {
        res.status(500).send('something went wrong');
    }

})

connectDB().then(()=>{
    console.log('connection success');
    app.listen(7777,()=> {
        console.log('Listening to 7777!!')
    });
})
.catch((err) => {
    console.log(err);
})
