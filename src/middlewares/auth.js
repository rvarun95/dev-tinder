const jwt = require("jsonwebtoken");

const UserModel = require("../models/user");

const authorizeAdmin = (req, res, next) => {
    console.log('This is the first callback function for the /admin route');
    const token = "xyz";
    const isAuthorized = token === "xyz"; // Simulating authorization check
    if (isAuthorized) {
        next(); // User is authorized, proceed to the next middleware or route handler
    } else {
        res.status(403).send('Unauthorized access'); // User is not authorized, send a 403 response
    }
};

// const userAuthorization = (req, res, next) => {
//     console.log('This is the user authorization middleware');
//     const token = "abc111";
//     const isAuthorized = token === "abc";   // Simulating authorization check
//     if (isAuthorized) {
//         next(); // User is authorized, proceed to the next middleware or route handler
//     } else {
//         res.status(403).send('Unauthorized access'); // User is not authorized, send a 403 response
//     }
// };

const userAuthorization = async (req, res, next) => {
    try {
        // Read the token from the request header or cookie
        const { token } = req.cookies;
        if (!token) {
            throw new Error("No token provided");
        }
        const decodedObject = await jwt.verify(token, "your_jwt_secret_key");
                    
        // Validate the token and extract user information (e.g., user ID) from the token payload
        const { _id } = decodedObject;
        // Find the User in the database using the extracted user ID
        const loggedInUser = await UserModel.findById( _id );
        if (!loggedInUser) {
            throw new Error("User not found");
        }
        req.user = loggedInUser; // Attach the user information to the request object for use in subsequent route handlers
        next();
    } catch (error) {
        res.status(401).send("Unauthorized: " + error.message);
    }
};

module.exports = {
    authorizeAdmin,
    userAuthorization
};