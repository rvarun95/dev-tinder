const express = require('express');
const { userAuthorization } = require('../middlewares/auth');
const UserModel = require('../models/user');
const ConnectionRequestModel = require('../models/connectionRequest');

const userRouter = express.Router();

/* 
    Get all the PENDING connection requests for the authenticated user. 
    This route should return a list of all the users who have sent a 
    connection request to the authenticated user with the status "pending". 
    The response should include the details of the users who have sent the connection requests, 
    such as their first name, last name, and email address. 
    You can implement this by querying the ConnectionRequestModel to 
    find all connection requests where the toUserId matches the authenticated user's ID and the status is "pending". 
    Then, you can populate the fromUserId field to get the details of the users who sent the requests and return this information in the response.
*/
userRouter.get("/user/requests/received", userAuthorization, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', ['firstName', 'lastName', 'photoUrl', 'about', 'skills', 'age']);

        res.json({
            message: 'Pending Interested connection requests fetched successfully',
            data: connectionRequests
        })
    
    } catch (err) {
        console.error('Error fetching pending connection requests:', err);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
});

userRouter.get("/user/connections", userAuthorization, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate('fromUserId toUserId', ['firstName', 'lastName', 'photoUrl', 'about', 'skills', 'age']);

        const data = connections.map(connection => {
            if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return connection.toUserId;
            }
            return connection.fromUserId;
        });
        res.json({
            message: 'Connections fetched successfully',
            data
        });
    } catch (err) {
        console.error('Error fetching connections:', err);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
});

module.exports = userRouter;