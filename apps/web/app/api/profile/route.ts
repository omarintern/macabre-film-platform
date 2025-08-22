import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { userService } from '../../../lib/database';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function PUT(request: NextRequest) {
  try {
    // Extract JWT token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    } catch {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Check if user has CREATOR role
    if (decoded.role !== 'CREATOR') {
      return NextResponse.json(
        { error: 'Only creators can edit profiles' },
        { status: 403 }
      );
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
    const updatedUser = await userService.updateUserProfile(decoded.userId, {
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
