const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminName = process.env.ADMIN_NAME || 'Super Admin';

        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }

        if (!adminEmail || !adminPassword) {
            throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before running seed:admin');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully');

        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin user already exists');
            console.log('Email:', adminEmail);
            console.log('Role:', adminExists.role);
            await mongoose.connection.close();
            process.exit(0);
        }

        const admin = await User.create({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'super_admin'
        });

        console.log('\nAdmin user created successfully');
        console.log('Email:', admin.email);
        console.log('Role:', admin.role);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedAdmin();
