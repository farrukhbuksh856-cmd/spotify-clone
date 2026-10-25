const mongoose = require('mongoose');

async function connectDB() {
    // 1: connected, 2: connecting. Reuse existing connection if active.
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            console.warn('Database warning: MONGO_URI is not defined in environment variables.');
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

module.exports = connectDB;