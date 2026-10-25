const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");

const app = express();

// Path normalization for Netlify Functions (supports both direct /.netlify/functions/api and rewritten /api)
app.use((req, res, next) => {
    if (req.url.startsWith('/.netlify/functions/api')) {
        const stripped = req.url.replace('/.netlify/functions/api', '');
        req.url = stripped.startsWith('/api') ? stripped : `/api${stripped}`;
    }
    next();
});

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. same-origin requests or local tools)
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith('.netlify.app') ||
            process.env.NODE_ENV !== 'production'
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Health check endpoint for deployment verification
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;