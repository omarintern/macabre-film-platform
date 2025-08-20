import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/utils/jwt';

interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<LogoutResponse>> {
  try {
    // Get token from cookie or Authorization header
    const cookieToken = request.cookies.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    const token = cookieToken || bearerToken;
    
    if (token) {
      try {
        // Verify the token is valid before logout
        verifyToken(token);
        
        // In a production app, you might want to add the token to a blacklist
        // For now, we'll just clear the cookie and return success
        console.log('User logged out with token:', token.substring(0, 20) + '...');
      } catch {
        // Token is invalid, but we'll still proceed with logout
        console.log('Invalid token during logout, proceeding anyway');
      }
    }

    // Create response
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Logout successful' 
      },
      { status: 200 }
    );

    // Clear the httpOnly cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, we should clear the cookie and return success
    // because the user intention is to log out
    const response = NextResponse.json(
      { success: true, message: 'Logout completed' },
      { status: 200 }
    );

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;
  }
}
