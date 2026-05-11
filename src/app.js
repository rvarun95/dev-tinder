const express = require('express');
const connectToDatabase = require('./config/database'); // Import the database connection

// Import User model
const UserModel = require('./models/user');

const app = express();

app.post("/signup", async (req, res) => {
    const userObject = {
        firstName: "Janani",
        lastName: "Varunkumar",
        email: "janani.varunkumar@myemail.com",
        password: "janani@123",
        age: 25,
        gender: "Female"
    };

    // Create a new user instance using the UserModel
    const user = new UserModel(userObject);
    // Save the user to database
    try {
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(500).send("Error creating user: " + error.message);
    }
});

// Connect to the database
connectToDatabase().then(() => {
    console.log('Connected to MongoDB successfully!');
    // Start the server after successful database connection
    app.listen(9999, () => {
        console.log('Server is running on port 9999');
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});