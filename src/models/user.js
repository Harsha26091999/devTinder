const mongoose = require('mongoose');
const jwtToken = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [50, 'First name cannot exceed 50 characters'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [50, 'Last name cannot exceed 50 characters'],
        trim: true
    },
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [120, 'Age seems unrealistic'],
        required: [true, 'Age is required']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Gender is required']
    },
    emailId: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Email format is invalid']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            maxlength: [128, 'Password cannot exceed 128 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    skills:{
        type: [String],
        
    }
}, {
    timestamps: true
});

userSchema.methods.getJWToken = async function () {
    const user = this
    return await jwtToken.sign({ _id: user._id }, "Harshavardhan", { expiresIn: '1h' });
}

userSchema.methods.isValidUser = async function (userPassword) {
    const user = this;
    return await bcrypt.compare(userPassword, user.password);
}

userSchema.statics.verifyToken = function (token, secret = "Harshavardhan") {
    try {
      return jwtToken.verify(token, secret);
    } catch (err) {
      return null;
    }
  };

  userSchema.statics.findByToken = async function (token) {
    const decoded = this.verifyToken(token);
    if (!decoded) return null;
  
    const user = await this.findById(decoded._id);
    return user;
  };
  


module.exports = mongoose.model('User', userSchema);