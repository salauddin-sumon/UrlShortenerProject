const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully');

        const adminExists = await User.findOne({ email: 'admin@urlshortener.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            console.log('Email: admin@urlshortener.com');
            console.log('Role:', adminExists.role);
            await mongoose.connection.close();
            process.exit(0);
        }

        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@urlshortener.com',
            password: 'Admin@123456',
            role: 'super_admin'
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('----------------------------');
        console.log('Email:', admin.email);
        console.log('Password: Admin@123456');
        console.log('Role:', admin.role);
        console.log('----------------------------');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedAdmin();