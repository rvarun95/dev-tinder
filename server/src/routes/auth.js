const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const { validateSignupData } = require('../utils/validations'); // Import validation function
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation and verification

const UserModel = require('../models/user');

const authRouter = express.Router();

// app.post("/signup", async (req, res) => {
//     // const userObject = {
//     //     firstName: "Janani",
//     //     lastName: "Varunkumar",
//     //     email: "janani.varunkumar@myemail.com",
//     //     password: "janani@123",
//     //     age: 25,
//     //     gender: "Female"
//     // };

//     // // Create a new user instance using the UserModel
//     // const user = new UserModel(userObject);
//     // // Save the user to database
//     // try {
//     //     await user.save();
//     //     res.send("User created successfully");
//     // } catch (error) {
//     //     res.status(500).send("Error creating user: " + error.message);
//     // }

//     console.log(req.body);
//     // const { firstName, lastName, email, password, age, gender } = req.body;

//     try {
//         // const user = new UserModel({ firstName, lastName, email, password, age, gender });
//         const user = new UserModel(req.body);
//         await user.save();
//         res.send("User created successfully");
//     } catch (error) {
//         res.status(500).send("Error creating user: " + error.message);
//     }
// });
authRouter.post("/signup", async (req, res) => {
    // Validate the request body to ensure all required fields are present

    // Encrypt the password before saving to the database (you can use bcrypt library for this)
    console.log("Received signup data:", req.body);
    try {
        validateSignupData(req);

        const { firstName, lastName, email, password, age, gender, photoUrl, skills } = req.body;

        // Hash the password using bcrypt before saving to the database
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
        console.log("Hashed password:", passwordHash);
        
        // Create a new user instance using the UserModel with the hashed password
        const user = new UserModel({
            firstName,
            lastName,
            email,
            password: passwordHash, // Save the hashed password to the database
            age,
            gender,
            photoUrl,
            skills
        });

        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(500).send("ERR: Error creating user: " + error.message);
    }
});

// Login endpoint to authenticate user and return a token (for simplicity, we are not implementing JWT here)
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send("Invalid email address");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            // Create JWT token from user schema method and send it in the response
            const token = await user.getJWT();
            
            res.cookie("token", token, {
                expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // Set the cookie to expire in 1 hour
                httpOnly: true
            }); // Set the JWT token in the cookie for authentication
            res.status(200).json(user);
        } else {
            return res.status(401).send("Invalid password");
        }
    } catch (error) {
        res.status(500).send("Error logging in: " + error.message);
    }
});

authRouter.post("/logout", (req, res) => {
    // res.clearCookie("token"); // Clear the token cookie to log out the user
    res.cookie("token", null, {
        expires: new Date(Date.now()), // Set the cookie to expire immediately
        httpOnly: true
    });
    res.send("Logout successful");
});

module.exports = authRouter;