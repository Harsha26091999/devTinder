const mongoose = require('mongoose');
mongoose.set('strictQuery', true); 

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://harshavardhanmallimala:Iamalone%4072@cluster0.epkaupr.mongodb.net/devTinder");
  };
  

module.exports = connectDB;