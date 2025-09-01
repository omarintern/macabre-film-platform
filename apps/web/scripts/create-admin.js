#!/usr/bin/env node
/**
 * Bootstrap script to create the first admin user
 * Run this script to create an initial admin account
 * 
 * Usage: node scripts/create-admin.js
 */

const bcrypt = require('bcrypt');
const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🚀 Creating admin user...\n');

    // Default admin credentials (you should change these!)
    const adminEmail = 'admin@filmplatform.com';
    const adminPassword = 'admin123'; // Change this!
    
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔐 Password: ${adminPassword}`);
    console.log('⚠️  IMPORTANT: Change these credentials after first login!\n');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        name: 'System Administrator',
        bio: 'Platform administrator account'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Created: ${adminUser.createdAt}\n`);

    console.log('🎯 Next steps:');
    console.log('1. Go to http://localhost:3000/login');
    console.log(`2. Login with: ${adminEmail} / ${adminPassword}`);
    console.log('3. Change your password after first login');
    console.log('4. You can now access /admin and /profile pages\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
    if (error.code === 'P2002') {
      console.log('   This email is already in use.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createAdminUser();
