import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import config from '../config';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const args = process.argv.slice(2);
    const email = args[0] || 'admin@example.com';
    const password = args[1] || 'admin123';
    const name = args[2] || 'Admin User';

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      if (existingAdmin.role === 'admin') {
        console.log('Admin user already exists with this email:', email);
        process.exit(0);
      } else {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('User updated to admin:', email);
        process.exit(0);
      }
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('\nYou can now login with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

