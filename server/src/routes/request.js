const express = require('express');
const { userAuthorization } = require('../middlewares/auth'); // Import authorization middlewares
const ConnectionRequestModel = require('../models/connectionRequest'); // Import the ConnectionRequest model
const UserModel = require('../models/user');

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuthorization, async (req, res) => {
    try {
        const fromUserId = req.user._id; // Get the authenticated user's ID from the request
        const toUserId = req.params.toUserId; // Get the target user's ID from the route parameters
        const status = req.params.status; // Get the status from the route parameters

        const ALLOWED_STATUSES = ['ignored', 'interested'];
        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Allowed values are: ${ALLOWED_STATUSES.join(', ')}` });
        }

        // If there is an existing connection request from the same user to the same target user, update the status instead of creating a new request
        const existingRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if( existingRequest ) {
            return res.status(400).json({
                message: 'A connection request already exists between these users. Please update the existing request instead of creating a new one.'
            })
        }

        // Check whether the user is present in the database or not before sending the connection request
        // You can implement this check by querying the UserModel to see if the target user exists in the database. If the target user does not exist, return an error response.
        const targetUser = await UserModel.findById(toUserId);
        if( !targetUser ) {
            console.log(`User with ID ${toUserId} not found in the database.`);
            return res.status(404).json({
                message: 'The user is not found in the database. Please check the user ID and try again.'
            });
        }

        if (fromUserId.toString() === toUserId) {
            return res.status(400).json({ message: 'You cannot send a connection request to yourself' });
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save(); // Save the connection request to the database

        res.json({
            message: `${req.user.firstName} is ${status} in connection with ${targetUser.firstName} ${targetUser.lastName}. Request sent successfully`,
            data
        });
    } catch (error) {
        console.error('Error sending connection request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

 /*
    * validate the status
    * validate the requestId
    * loggedInuser should be the toUserId in the connection request
    * status should be interested
    * update the connection request status to accepted and save the connection in the database
*/
requestRouter.post("/request/review/:status/:requestId", userAuthorization, async (req, res) => {
    try {
        const loggedInUser = req.user; // Get the authenticated user's ID from the request
        const {requestId, status} = req.params;

        const ALLOWED_STATUSES = ['accepted', 'rejected'];
        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({ 
                message: `Invalid status. Allowed values are: ${ALLOWED_STATUSES.join(', ')}` 
            });
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested',
        });

        if( !connectionRequest ) {
            return res.status(404).json({
                message: 'Connection request not found or you are not authorized to review this request.'
            });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message: `Connection request has been ${status} successfully.`,
            data
        });
    } catch (error) {
        console.error('Error reviewing connection request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = requestRouter;