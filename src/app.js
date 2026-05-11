const express = require('express');
const connectToDatabase = require('./config/database'); // Import the database connection

// Import User model
const UserModel = require('./models/user');

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

app.post("/signup", async (req, res) => {
    // const userObject = {
    //     firstName: "Janani",
    //     lastName: "Varunkumar",
    //     email: "janani.varunkumar@myemail.com",
    //     password: "janani@123",
    //     age: 25,
    //     gender: "Female"
    // };

    // // Create a new user instance using the UserModel
    // const user = new UserModel(userObject);
    // // Save the user to database
    // try {
    //     await user.save();
    //     res.send("User created successfully");
    // } catch (error) {
    //     res.status(500).send("Error creating user: " + error.message);
    // }

    console.log(req.body);
    // const { firstName, lastName, email, password, age, gender } = req.body;

    try {
        // const user = new UserModel({ firstName, lastName, email, password, age, gender });
        const user = new UserModel(req.body);
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(500).send("Error creating user: " + error.message);
    }
});

// Read Data from Database - GET Request
app.get("/user", async (req, res) => {
    const email = req.body.email;
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
app.get("/feed", async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send("Error fetching users: " + error.message);
    }
});

// Delete a user from the database by ID
app.delete("/user", async (req, res) => {
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
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const updatedUser = await UserModel.findByIdAndUpdate({ _id: userId }, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send("User not found with ID: " + userId);
        }
        res.send(updatedUser);
    } catch (error) {
        res.status(500).send("Error updating user: " + error.message);
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