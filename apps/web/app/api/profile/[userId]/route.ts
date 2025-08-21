import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../lib/database';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    const { userId } = params;

    // Basic validation
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'Valid user ID is required' },
        { status: 400 }
      );
    }

    // Get user profile
    const user = await userService.getUserProfile(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only show profiles for CREATOR users
    if (user.role !== 'CREATOR') {
      return NextResponse.json(
        { error: 'Profile not available' },
        { status: 404 }
      );
    }

    // Return public profile data (excluding sensitive information)
    const publicProfile = {
      id: user.id,
      name: user.name,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      // Note: email is excluded for privacy
    };

    return NextResponse.json({
      success: true,
      profile: publicProfile,
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
