const mongoose = require('mongoose');
const validator = require('validator'); // Import validator library for email validation

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
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

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;