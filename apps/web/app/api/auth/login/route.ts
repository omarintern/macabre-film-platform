import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { userService } from '../../../../../api/src/services/database';
import { signToken } from '../../../lib/utils/jwt';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  token?: string;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  // TODO: Implement rate limiting for production to prevent brute force attacks
  // Consider using libraries like 'rate-limiter-flexible' or middleware-based solutions
  
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!password?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // Find user by email (normalize to match signup behavior)
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userService.findUserByEmail(normalizedEmail);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    let token: string;
    try {
      token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      console.error('JWT token generation failed:', error);
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please try again later.' },
        { status: 500 }
      );
    }

    // Prepare user data (exclude password)
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    // Create response with httpOnly cookie
    const response = NextResponse.json(
      { 
        success: true, 
        user: userData, 
        token,
        message: 'Login successful' 
      },
      { status: 200 }
    );

    // Set httpOnly cookie for security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
