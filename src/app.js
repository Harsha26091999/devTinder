const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();
app.use(express.json());

app.post('/signup', (req, res) => {
    const user = new User(req.body);
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

});

app.get('/getUser', (req, res) => {
    try {
        const userEmail = req.body.emailId;
        console.log('userEmail', req.body);
        User.find({ emailId: userEmail }).then((response) => {
            console.log('Response', response);
            if (response.length === 0) {
                res.status(404).send("User not found");
            } else {
                res.send(response);
            }
        })
    } catch (error) {
        res.status(500).send("Error", error);
    }
});

app.get('/getAllUsers', (req, res) => {
    try {
        User.find({}).then((response) => {
            if (response.length === 0) {
                res.status(404).send("No Users");
            } else {
                res.send(response);
            }
        });
    } catch (err) {
        res.status(500).send("Error", error);
    }
})

connectDB().then(() => {
    console.log('connection success');
    app.listen(7777, () => {
        console.log('Listening to 7777!!')
    });
})
    .catch((err) => {
        console.log(err);
    })
