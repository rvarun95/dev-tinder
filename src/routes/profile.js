const express = require('express');
const { userAuthorization } = require('../middlewares/auth'); // Import authorization middlewares

const profileRouter = express.Router();

profileRouter.get("/profile", userAuthorization, async (req, res) => {
    try {
        let loggedInUser = req.user; // Access the user information attached to the request object by the userAuthorization middleware

        // For simplicity, we are not verifying the token here. In a real application, you would verify the token and extract user information from it.
        res.send(loggedInUser);
    } catch (error) {
        res.status(500).send("Error fetching profile: " + error.message);
    }
});

module.exports = profileRouter;