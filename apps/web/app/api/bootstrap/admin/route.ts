import { NextResponse } from 'next/server';
import { userService } from '../../../../lib/database';
import bcrypt from 'bcrypt';
import { UserRole } from '../../../../src/generated/prisma';

/**
 * Bootstrap endpoint to create the first admin user
 * Only works when no admin users exist in the system
 * This is a one-time setup endpoint for initial deployment
 */
export async function POST() {
  try {
    // Check if any admin users already exist
    const existingAdmins = await userService.findUsersByRole('ADMIN');
    
    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Admin users already exist. This endpoint is only for initial setup.',
          existingAdmins: existingAdmins.length
        },
        { status: 409 } // Conflict
      );
    }

    // Default admin credentials
    const adminEmail = 'admin@filmplatform.com';
    const adminPassword = 'admin123'; // Should be changed after first login
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create the admin user
    const adminUser = await userService.createUser({
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN
    });

    // Update with additional profile info
    const updatedAdmin = await userService.updateUserProfile(adminUser.id, {
      name: 'System Administrator',
      bio: 'Initial admin account - please update your profile'
    });

    console.log(`[BOOTSTRAP] Admin user created: ${adminUser.email} (${adminUser.id})`);

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      credentials: {
        email: adminEmail,
        password: adminPassword,
        warning: 'Please change these credentials after first login!'
      },
      user: {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        createdAt: updatedAdmin.createdAt.toISOString()
      },
      nextSteps: [
        'Go to /login',
        `Login with: ${adminEmail} / ${adminPassword}`,
        'Change your password immediately',
        'Access admin features at /admin'
      ]
    });

  } catch (error) {
    console.error('Bootstrap admin creation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create admin user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check bootstrap status
 */
export async function GET() {
  try {
    const existingAdmins = await userService.findUsersByRole('ADMIN');
    const adminCount = existingAdmins ? existingAdmins.length : 0;
    
    return NextResponse.json({
      success: true,
      adminExists: adminCount > 0,
      adminCount,
      canBootstrap: adminCount === 0,
      message: adminCount > 0 
        ? 'Admin users already exist' 
        : 'No admin users found - bootstrap available'
    });

  } catch (error) {
    console.error('Bootstrap status check error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check bootstrap status' 
      },
      { status: 500 }
    );
  }
}
