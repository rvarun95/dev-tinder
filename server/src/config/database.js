const mongoose = require('mongoose');

const connectToDatabase = async () => {
        await mongoose.connect(
            'mongodb+srv://rvarun95usa_db_user:s9MCeMcyFaCkSFr9@learnnodejscluster.xf052q3.mongodb.net/devtinder?retryWrites=true&w=majority',
        );
};

// connectToDatabase().then(() => {
//     console.log('Connected to MongoDB successfully!');
// }).catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
// });

module.exports = connectToDatabase;
