try {
    require('dotenv').config();
} catch (e) {
    // In production or environments without dotenv in root, env vars are provided directly by process.env
}
const serverless = require('serverless-http');
const app = require('../../Backend/src/app');
const connectDB = require('../../Backend/src/db/db');

let isDbConnected = false;

const serverlessHandler = serverless(app, {
    binary: [
        'application/octet-stream',
        'image/*',
        'audio/*',
        'video/*',
        'multipart/form-data'
    ]
});

exports.handler = async (event, context) => {
    // Prevent AWS Lambda / Netlify from holding open the event loop due to Mongoose connection pool
    context.callbackWaitsForEmptyEventLoop = false;

    // Connect to database if not already connected
    if (!isDbConnected) {
        try {
            await connectDB();
            isDbConnected = true;
        } catch (dbErr) {
            console.error('Serverless database connection error:', dbErr);
        }
    }

    return await serverlessHandler(event, context);
};
