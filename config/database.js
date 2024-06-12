const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbURL = process.env.DB_URL;
        await mongoose.connect(dbURL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

module.exports = connectDB;