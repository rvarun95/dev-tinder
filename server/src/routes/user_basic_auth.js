const express = require('express');

const UserModel = require('../models/user');

const userRouter = express.Router();

// Read Data from Database - GET Request
userRouter.get("/user", async (req, res) => {
    const email = req.query.email;
    console.log("Email received in query params:", email);
    try {
        const users = await UserModel.find({ email: email });
        if(users.length === 0) {
            return res.status(404).send("User not found with email: " + email);
        }
        res.send(users);
    } catch (error) {
        res.status(500).send("Error fetching user: " + error.message);
    }
});

// Get all users from the database
userRouter.get("/feed", async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send("Error fetching users: " + error.message);
    }
});

// Delete a user from the database by ID
userRouter.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    console.log("User ID received in request body:", userId);
    try {
        const deletedUser = await UserModel.findByIdAndDelete({ _id: userId });
        if (!deletedUser) {
            return res.status(404).send("User not found with ID: " + userId);
        }
        res.send("User deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting user: " + error.message);
    }
});

// Update a user in the database by ID
// Dont allow the user to update email through this endpoint
userRouter.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const reqBody = req.body;

    try {
        const ALLOWED_UPDATES = ['userId', 'photoUrl', 'gender', 'password', 'age'];

        const isUpdateAllowed = Object.keys(reqBody).every((keys) => ALLOWED_UPDATES.includes(keys));

        if(!isUpdateAllowed) {
            // return res.status(400).send("Invalid updates! You can only update the following fields: " + ALLOWED_UPDATES.join(", "));
            throw new Error("Invalid updates! You can only update the following fields: " + ALLOWED_UPDATES.join(", "));
        }

        if(reqBody?.skills?.length > 10) {
            throw new Error("You can only add up to 10 skills");
        }

        const updatedUser = await UserModel.findByIdAndUpdate({ _id: userId }, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send("User not found with ID: " + userId);
        }
        res.send(updatedUser);
    } catch (error) {
        res.status(500).send("Error updating user: " + error.message);
    }
});

module.exports = userRouter;