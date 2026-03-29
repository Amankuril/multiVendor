
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './services/db.service.js';

// Configure Environment Variables
dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 8000;

// Initialize 
connectDB()
    .then(() => {
        // Listen for server-level errors
        app.on('error', (error) => {
            console.error('Server encountered an error: ', error);
        });

        app.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed, server not started.', err);
    });