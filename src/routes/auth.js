const express = require('express');
const { validateSignup, validateLogin } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');


const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {

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

authRouter.post("/login", async (req, res) => {
    try {
        validateLogin(req);
        const { emailId, password } = req.body;
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


module.exports = authRouter;