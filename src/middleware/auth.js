const jwtToken = require('jsonwebtoken');
const User = require('../models/user');


const auth = async(req,res,next) => {
    const { token } = req.cookies;
    if (!token) {
        res.status(500).send('Invalid token');
    } else {
        const decodedMessage = jwtToken.verify(token, "Harshavardhan");
        const user = await User.findById({ _id: decodedMessage._id });
        if (!user) {
            res.status(500).send('User not found');
        } else {
            req.user = user;
            next();
        }
    }
}

module.exports = {auth};