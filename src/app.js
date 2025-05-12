const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);

connectDB().then(() => {
    console.log('connection success');
    app.listen(7777, () => {
        console.log('Listening to 7777!!')
    });
})
    .catch((err) => {
        console.log(err);
    });
