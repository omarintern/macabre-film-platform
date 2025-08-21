import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { userService } from '../../../lib/database';

// Constants
const VALID_CLASSIFICATIONS = ['Synopsis', 'Scene Description', 'Other'] as const;
const MAX_BODY_LENGTH = 1000;

// Types
interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

interface WorkRequestBody {
  title: string;
  body: string;
  classification: string;
  tags?: string | string[];
}

// Helper functions
function getJWTSecret(): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET not configured');
    throw new Error('Server configuration error');
  }
  return jwtSecret;
}

/**
 * Authenticates request and verifies CREATOR role
 * Returns authenticated user data or error response
 */
async function authenticateCreator(request: NextRequest): Promise<AuthenticatedUser | NextResponse> {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const jwtSecret = getJWTSecret();
    const decoded = jwt.verify(token, jwtSecret) as AuthenticatedUser;
    
    if (decoded.role !== 'CREATOR') {
      return NextResponse.json(
        { error: 'Access denied. CREATOR role required.' },
        { status: 403 }
      );
    }

    return decoded;
  } catch {
    return NextResponse.json(
      { error: 'Invalid authentication token' },
      { status: 401 }
    );
  }
}

/**
 * Validates work submission data
 * Returns validation errors or null if valid
 */
function validateWorkData(data: WorkRequestBody): NextResponse | null {
  if (!data.title?.trim()) {
    return NextResponse.json(
      { error: 'Title is required' },
      { status: 400 }
    );
  }

  if (!data.body?.trim()) {
    return NextResponse.json(
      { error: 'Body is required' },
      { status: 400 }
    );
  }

  if (data.body.length > MAX_BODY_LENGTH) {
    return NextResponse.json(
      { error: `Body must be ${MAX_BODY_LENGTH} characters or less` },
      { status: 400 }
    );
  }

  if (!data.classification?.trim()) {
    return NextResponse.json(
      { error: 'Classification is required' },
      { status: 400 }
    );
  }

  if (!VALID_CLASSIFICATIONS.includes(data.classification as typeof VALID_CLASSIFICATIONS[number])) {
    return NextResponse.json(
      { error: 'Classification must be Synopsis, Scene Description, or Other' },
      { status: 400 }
    );
  }

  return null;
}

/**
 * Parses and sanitizes tags from various input formats
 */
function parseTags(tags?: string | string[]): string[] {
  if (!tags) return [];
  
  if (Array.isArray(tags)) {
    return tags.filter(tag => typeof tag === 'string' && tag.trim()).map(tag => tag.trim());
  }
  
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  }
  
  return [];
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user and verify CREATOR role
    const authResult = await authenticateCreator(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    // Parse and validate request body
    const requestBody: WorkRequestBody = await request.json();
    const validationError = validateWorkData(requestBody);
    if (validationError) {
      return validationError;
    }

    // Parse tags and create work
    const parsedTags = parseTags(requestBody.tags);
    const newWork = await userService.createWork({
      title: requestBody.title.trim(),
      body: requestBody.body.trim(),
      classification: requestBody.classification.trim(),
      tags: parsedTags,
      creatorId: authResult.userId,
    });

    return NextResponse.json(
      {
        success: true,
        work: newWork,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Work creation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Creator not found')) {
        return NextResponse.json(
          { error: 'Creator not found' },
          { status: 404 }
        );
      }
      
      // Return validation errors directly
      if (error.message.includes('required') || 
          error.message.includes('must be') || 
          error.message.includes('Classification')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve works (for future use)
export async function GET(request: NextRequest) {
  try {
    // Authenticate user and verify CREATOR role
    const authResult = await authenticateCreator(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    // Get works by creator
    const works = await userService.getWorksByCreator(authResult.userId);

    return NextResponse.json({
      success: true,
      works,
    });

  } catch (error) {
    console.error('Works retrieval error:', error);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
