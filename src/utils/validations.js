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

module.exports = {
    validateSignupData
}