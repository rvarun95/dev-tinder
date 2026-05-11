const express = require('express');
const connectToDatabase = require('./config/database'); // Import the database connection
const { validateSignupData } = require('./utils/validations'); // Import validation function
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Import User model
const UserModel = require('./models/user');

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

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

app.post("/signup", async (req, res) => {
    // Validate the request body to ensure all required fields are present

    // Encrypt the password before saving to the database (you can use bcrypt library for this)

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
// Dont allow the user to update email through this endpoint
app.patch("/user", async (req, res) => {
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