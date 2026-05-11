const mongoose = require('mongoose');

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
    },
    password: {
        type: String,
        required: true,
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
        type: String
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