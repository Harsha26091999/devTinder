const express =  require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const profileRouter = express.Router();



profileRouter.post("/getOwnProfile", auth, async (req, res) => {
    const { token } = req.cookies;
  
    if (!token) return res.status(401).send("Token missing");
  
    const user = await User.findByToken(token);
  
    if (!user) return res.status(404).send("User not found");
  
    res.send(user);
  });

profileRouter.get('/getProfileByEmail', auth, async (req, res) => {
    try {
        const {emailId} = req.body;
        console.log('emailId', emailId);
        const user = await User.findOne({ emailId });
        console.log('user', user);
        if (!user) return res.status(404).send("User not found");
        res.send(user);

    } catch (error) {
        res.status(500).send(error);
    }
});

profileRouter.get('/getAllProfiles', auth, async (req, res) => {
    try {
        const users = await User.find({});
        if(users.length === 0) return res.status(500).send('No Users');
        res.send(users)
    } catch (err) {
        res.status(500).send(error);
    }
})

profileRouter.delete('/deleteProfile', auth, async (req, res) => {
    const {userId} = req.body;
    try {
        await User.findByIdAndDelete({ _id: userId });
        res.send('user deleted succesfully');
    } catch (error) {
        res.status(500).send(error);
    }
})

profileRouter.patch('/updateProfile', auth, async (req, res) => {
    const {emailId} = req.body;
    const ALLOWED_UPDATES = ['password', 'skills', "emailId"];
    const isUpdateAllowed = Object.keys(req.body).every((key) => ALLOWED_UPDATES.includes(key));
    console.log('isUpdateAllowed', isUpdateAllowed);
    try {
        if (!isUpdateAllowed) throw new Error('Update is not allowed');
        await User.findOneAndUpdate({ emailId }, req.body, { runValidators: true });
        res.send('user updated succesfully');
    } catch (error) {
        res.status(500).send(error);
    }
});

profileRouter.patch("/changePassword", auth, async (req, res) => {
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

module.exports = profileRouter;