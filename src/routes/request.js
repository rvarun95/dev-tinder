const express = require('express');
const { userAuthorization } = require('../middlewares/auth'); // Import authorization middlewares

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuthorization, (req, res) => {
    const user = req.user; // Access the user information attached to the request object by the userAuthorization middleware
    console.log("Connection request sent successfully!", user);
    res.send(user);
});

module.exports = requestRouter;