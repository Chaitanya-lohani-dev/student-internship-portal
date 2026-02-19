import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URL;

const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function initDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const {default: User} = await import('../models/User.js');

        const existingAdmin = await User.findOne({email: ADMIN_EMAIL});
        if (existingAdmin) {
            console.log('Admin user already exists. Skipping seed');
            process.exit(0);
        }

        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin',
        });

        console.log('Admin user created successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDB();