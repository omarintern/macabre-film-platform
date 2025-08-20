import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../lib/database';
import { verifyToken } from '../../../../lib/utils/jwt';
import { UserRole } from '../../../../src/generated/prisma';

interface PromoteUserRequest {
  userIdentifier: string; // email or ID
  targetRole: 'CREATOR' | 'ADMIN';
}

interface PromoteUserResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<PromoteUserResponse>> {
  // TODO: Implement rate limiting for admin actions to prevent abuse
  try {
    // Extract and verify JWT token
    const cookieToken = request.cookies.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user has ADMIN role
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body: PromoteUserRequest = await request.json();
    const { userIdentifier, targetRole } = body;

    // Validate request data with enhanced validation
    if (!userIdentifier?.trim() || !targetRole) {
      return NextResponse.json(
        { success: false, error: 'User identifier and target role are required' },
        { status: 400 }
      );
    }

    // Additional validation for user identifier format
    const trimmedIdentifier = userIdentifier.trim();
    if (trimmedIdentifier.length < 3) {
      return NextResponse.json(
        { success: false, error: 'User identifier must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (!['CREATOR', 'ADMIN'].includes(targetRole)) {
      return NextResponse.json(
        { success: false, error: 'Invalid target role. Must be CREATOR or ADMIN' },
        { status: 400 }
      );
    }

    // Find user by email or ID with improved email validation
    let targetUser;
    const isEmail = trimmedIdentifier.includes('@') && trimmedIdentifier.includes('.');
    
    if (isEmail) {
      targetUser = await userService.findUserByEmail(trimmedIdentifier);
    } else {
      targetUser = await userService.findUserById(trimmedIdentifier);
    }

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has the target role
    if (targetUser.role === targetRole) {
      return NextResponse.json(
        { success: false, error: `User already has ${targetRole} role` },
        { status: 400 }
      );
    }

    // Update user role
    const updatedUser = await userService.updateUserRole(targetUser.id, targetRole as UserRole);

    // Audit log for admin actions (security best practice)
    console.log(`[ADMIN_ACTION] User ${payload.email} (${payload.userId}) promoted user ${updatedUser.email} (${updatedUser.id}) from ${targetUser.role} to ${targetRole} at ${new Date().toISOString()}`);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
        },
        message: `User successfully promoted to ${targetRole}`,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Admin promote user error:', error);

    // Handle known errors from userService
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { success: false, error: 'Unable to promote user. Please try again.' },
      { status: 500 }
    );
  }
}
