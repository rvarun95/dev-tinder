const validator = require("validator");

const validateSignupData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        throw new Error("All fields (firstName, lastName, email, password) are required");
    } else if (firstName.length < 3 || firstName.length > 50) {
        throw new Error("First name must be between 3 and 50 characters");
    } else if(!validator.isEmail(email)) {
        throw new Error("Invalid email address");
    } else if(!validator.isStrongPassword(password, { 
        minLength: 8, 
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        throw new Error("Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol");
    }
}

const validateUpdateProfileData = (req) => {
    const reqBody = req.body;

    const ALLOWED_UPDATE_FIELDS  = ['firstName', 'lastName', 'photoUrl', 'gender', 'age', 'skills', 'about'];

    const isUpdateAllowed = Object.keys(reqBody).every((field) => 
        ALLOWED_UPDATE_FIELDS.includes(field)
    );

    // if (!isUpdateAllowed) {
    //     throw new Error("Invalid updates!");
    // }

    // Object.keys(reqBody).forEach((key) => {
    //     loggedInUser[key] = reqBody[key];
    // });

    // if(reqBody?.skills?.length > 10) {
    //     throw new Error("You can only add up to 10 skills!");
    // }

    return isUpdateAllowed;
}

module.exports = {
    validateSignupData,
    validateUpdateProfileData
}