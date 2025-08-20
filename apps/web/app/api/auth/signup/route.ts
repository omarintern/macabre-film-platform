import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { userService } from '../../../../lib/database';

interface SignupRequest {
  email: string;
  password: string;
}

interface SignupResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SignupResponse>> {
  try {
    // Parse request body
    const body: SignupRequest = await request.json();
    const { email, password } = body;

    // Server-side validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Additional password complexity check
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' 
        },
        { status: 400 }
      );
    }

    // Hash password with bcrypt (salt rounds: 12)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user using existing userService
    await userService.createUser({
      email,
      password: hashedPassword,
      // Default role is CLIENT (handled by userService)
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Account created successfully! You can now log in.' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);

    // Handle known errors from userService
    if (error instanceof Error) {
      if (error.message === 'User with this email already exists') {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists' },
          { status: 409 }
        );
      }
      
      if (error.message === 'Email is required' || error.message === 'Password is required') {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      }
    }

    // Generic error response (don't leak internal details)
    return NextResponse.json(
      { success: false, error: 'Unable to create account. Please try again.' },
      { status: 500 }
    );
  }
}
