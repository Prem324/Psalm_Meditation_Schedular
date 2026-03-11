const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const meditationRoutes = require('./routes/meditationRoutes');
const Admin = require('./models/Admin');

console.log('Starting server...');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check for Render
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/api/health', (req, res) => res.status(200).send('OK'));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/meditations', meditationRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ CRITICAL ERROR: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
}

console.log('Connecting to MongoDB...');
mongoose
    .connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ MongoDB Connected Successfully');

        // Seed Admin if not exists
        try {
            const adminExists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
            if (!adminExists) {
                await Admin.create({
                    username: process.env.ADMIN_USERNAME || 'Admin',
                    password: process.env.ADMIN_PASSWORD || 'Admin@123',
                });
                console.log('👤 Admin user seeded');
            }
        } catch (seedError) {
            console.error('⚠️ Admin seeding error:', seedError.message);
        }

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        // Don't exit immediately, let Render see the error log
        setTimeout(() => process.exit(1), 1000);
    });
