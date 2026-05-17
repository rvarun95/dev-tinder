const mongoose = require('mongoose');
const validator = require('validator'); // Import validator library for email validation
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation and verification

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        index: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email address');
            }
        }        
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value, { 
                minLength: 8, 
                minLowercase: 1, 
                minUppercase: 1, 
                minNumbers: 1, 
                minSymbols: 1 
            })) {
                throw new Error('Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols');
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if(!['Male', 'Female', 'Other'].includes(value)) {
                throw new Error('Invalid gender');
            }
        },
        enum: ['Male', 'Female', 'Other']
    },
    photoUrl: {
        type: String,
        validate(value) {
            if(value && !validator.isURL(value)) {
                throw new Error('Invalid URL for photo');
            }
        }
    },
    about: {
        type: String,
        default: "This is the default about section. Please update it to tell us more about yourself!"
    },
    skills: {
        type: [String]
    }
        
}, {
    timestamps: true
});

// Create an index on firstName, lastName, and email for faster search
// userSchema.find({ firstName: 1, lastName: 1, email: 1 });

userSchema.index({ firstName: 1, lastName: 1 });

// Instance method to generate JWT token for the user
userSchema.methods.getJWT = async function() {
    const user = this;

    const token = await jwt.sign({ _id: this._id }, "your_jwt_secret_key", { expiresIn: "1h" });
    return token;
};

// Validate the password
userSchema.methods.validatePassword = async function(inputPassword) {
    const user = this;

    const passwordHash = this.password;
    const isPasswordValid = await bcrypt.compare(inputPassword, passwordHash);
    return isPasswordValid;
};

const UserModel = new mongoose.model('User', userSchema);
module.exports = UserModel;