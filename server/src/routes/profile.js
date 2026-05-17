const express = require('express');
const { userAuthorization } = require('../middlewares/auth'); // Import authorization middlewares
const { validateUpdateProfileData } = require('../utils/validations');

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuthorization, async (req, res) => {
    try {
        let loggedInUser = req.user; // Access the user information attached to the request object by the userAuthorization middleware

        // For simplicity, we are not verifying the token here. In a real application, you would verify the token and extract user information from it.
        res.send(loggedInUser);
    } catch (error) {
        res.status(500).send("Error fetching profile: " + error.message);
    }
});

profileRouter.patch("/profile/update", userAuthorization, async (req,res) => {
    try {
        if(!validateUpdateProfileData(req)) {
            throw new Error("Invalid updates!");
        }

        let loggedInUser = req.user; // Access the user information attached to the request object by the userAuthorization middleware
        
        console.log("Logged in user before update: ", loggedInUser);
        
        // loggedInUser.firstName = req.body.firstName || loggedInUser.firstName;
        // loggedInUser.lastName = req.body.lastName || loggedInUser.lastName;
        // loggedInUser.age = req.body.age || loggedInUser.age; 

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save(); // Save the updated user profile to the database

        console.log("Logged in user after update: ", loggedInUser);
        res.json({
            message: `${loggedInUser.firstName}, your profile has been successfully updated: `,
            data: loggedInUser
        });
    } catch (error) {
        res.status(500).send("Error updating profile: " + error.message);
    }
});

module.exports = profileRouter;