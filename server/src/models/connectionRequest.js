const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // reference to the User schema
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'rejected', 'accepted'],
            message: `{VALUE} is not a valid status`
        },
    },
}, {
    timestamps: true
});

connectionRequestSchema.index({
    fromUserId: 1,
    toUserId: 1
}, {
})

connectionRequestSchema.pre('save', function() {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        throw new Error('You cannot send a connection request to yourself');
    }
    console.log(`Saving connection request from user ${connectionRequest.fromUserId} to user ${connectionRequest.toUserId} with status ${connectionRequest.status}`);
});

const ConnectionRequestModel = new mongoose.model(
    'ConnectionRequest', 
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;