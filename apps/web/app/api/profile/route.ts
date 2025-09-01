import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../lib/database';
import { requireRoleAPI } from '../../../lib/auth/api';

export async function PUT(request: NextRequest) {
  try {
    // Require CREATOR role
    const userAuth = requireRoleAPI(request, 'CREATOR');
    if (userAuth instanceof NextResponse) {
      return userAuth; // Return the error response
    }

    // Parse request body
    const body = await request.json();
    const { name, bio } = body;

    // Basic validation
    if (name !== undefined && typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name must be a string' },
        { status: 400 }
      );
    }

    if (bio !== undefined && typeof bio !== 'string') {
      return NextResponse.json(
        { error: 'Bio must be a string' },
        { status: 400 }
      );
    }

    // Optional length validation
    if (name && name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be 100 characters or less' },
        { status: 400 }
      );
    }

    if (bio && bio.length > 1000) {
      return NextResponse.json(
        { error: 'Bio must be 1000 characters or less' },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await userService.updateUserProfile(userAuth.userId, {
      name,
      bio,
    });

    // Return updated profile
    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
