const express = require('express');
const connectToDatabase = require('./config/database'); // Import the database connection
const cookieParser = require('cookie-parser'); // Import cookie-parser to handle cookies

// Import User model
const UserModel = require('./models/user');

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies


// Import and use route handlers
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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