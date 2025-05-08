const express = require('express');
const bcrypt = require('bcrypt');
const connectDB = require('./config/database');
const User = require('./models/user');
const {validateSignup, validateLogin} = require('./utils/validation');

const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
    
    try {
        validateSignup(req);
        const {firstName, lastName, emailId, age, skills, gender, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
            age,
            skills,
            gender
        });
        user.save().then(() => {
            console.log('User Saved');
            res.send('User created succesfully');
        })
            .catch((err) => {
                console.log('Error');
                res.status(500).send("Error"+err);
            })
    } catch (err) {
        res.status(500).send("Error"+err);
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
        res.status(500).send(error);
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
        res.status(500).send(error);
    }
})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        await User.findByIdAndDelete({ _id: userId });
        res.send('user deleted succesfully');
    } catch (error) {
        res.status(500).send(error);
    }
})

app.patch('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    const ALLOWED_UPDATES = ['password', 'skills'];
    const isUpdateAllowed = Object.keys(req.body).every((key)=>ALLOWED_UPDATES.includes(key));
    try{
        if(!isUpdateAllowed) throw new Error('Update is not allowed');
        await User.findOneAndUpdate({emailId: userEmail}, req.body,{runValidators:true});
        res.send('user updated succesfully');
    } catch(error) {
        res.status(500).send(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        // check validation
        validateLogin(req);
        userEmailId = req.body.emailId;
        console.log('userEmailId', userEmailId);
         // Check for email
         const user = await User.find({emailId:userEmailId});
         console.log('Usr', user);
         if(!user.length) {
            res.status(500).send("User not found");
         } else {
            const {password} =  req.body;
            console.log('password', password);
            const match = await bcrypt.compare(password, user[0].password);
            console.log('match', match);
            if(match) {
                res.send('Login succesful');
            } else {
                res.status(500).send("Invalid Credentials");
            }
         }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


connectDB().then(() => {
    console.log('connection success');
    app.listen(7777, () => {
        console.log('Listening to 7777!!')
    });
})
    .catch((err) => {
        console.log(err);
    })
