const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();
app.use(express.json());

app.post('/signup', (req, res) => {
    const user = new User(req.body);
    const areSkillsPresent = Object.keys(req.body).includes('skills');

    try {
        if(areSkillsPresent && req.body.skills.length >3) {
            throw new Error('Skills cannot be more than 3');
        }
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
