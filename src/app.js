const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignup, validateLogin } = require('./utils/validation');
const { auth } = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {

    try {
        validateSignup(req);
        const { firstName, lastName, emailId, age, skills, gender, password } = req.body;
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(400).send('Email is already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
            age,
            skills,
            gender
        });
        await user.save();
        res.send('User created succesfully');

    } catch (err) {
        res.status(500).send("Error" + err);
    }

});

app.post("/login", async (req, res) => {
    try {
        validateLogin(req);
        const {emailId, password} = req.body;
        const user = await User.findOne({ emailId });
        
        if (!user) {
            res.status(500).send("User not found");
        } else {
            const isValidUser = user.isValidUser(password);
            if (isValidUser) {
                const token = await user.getJWToken();
                res.cookie('token ', token);
                res.send('Login succesful');
            } else {
                res.status(500).send("Invalid Credentials");
            }
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post("/profile", auth, async (req, res) => {
    const { token } = req.cookies;
  
    if (!token) return res.status(401).send("Token missing");
  
    const user = await User.findByToken(token);
  
    if (!user) return res.status(404).send("User not found");
  
    res.send(user);
  });
  

app.get('/getUser', auth, async (req, res) => {
    try {
        const {emailId} = req.body;
        const user = await User.findOne({ emailId });
        if (!user) return res.status(404).send("User not found");
        res.send(response);

    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/getAllUsers', auth, async (req, res) => {
    try {
        const users = await User.find({});
        if(users.length === 0) return res.status(500).send('No Users');
        res.send(users)
    } catch (err) {
        res.status(500).send(error);
    }
})

app.delete('/user', auth, async (req, res) => {
    const {userId} = req.body;
    try {
        await User.findByIdAndDelete({ _id: userId });
        res.send('user deleted succesfully');
    } catch (error) {
        res.status(500).send(error);
    }
})

app.patch('/user', auth, async (req, res) => {
    const {emailId} = req.body;
    const ALLOWED_UPDATES = ['password', 'skills'];
    const isUpdateAllowed = Object.keys(req.body).every((key) => ALLOWED_UPDATES.includes(key));
    try {
        if (!isUpdateAllowed) throw new Error('Update is not allowed');
        await User.findOneAndUpdate({ emailId }, req.body, { runValidators: true });
        res.send('user updated succesfully');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.patch("/changePassword", auth, async (req, res) => {
    const { emailId, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ emailId: emailId });
    console.log('user', user);
    if (!user) {
        res.status(500).send('User not found');
    } else {
        const isValidUser = await user.isValidUser(oldPassword);
        if (!isValidUser) {
            res.status(500).send('Old password is wrong');
        } else {
            const newHashPassword = await bcrypt.hash(newPassword, 10);
            await User.findOneAndUpdate({ emailId }, { password: newHashPassword }, { runValidators: true });
            res.send("Password changes success");
        }
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
    });
