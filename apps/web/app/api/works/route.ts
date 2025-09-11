import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/utils/jwt';
import { userService } from '../../../lib/database';

// Constants
const VALID_CLASSIFICATIONS = ['Synopsis', 'Scene Description', 'Other'] as const;
const MAX_BODY_LENGTH = 1000;
const MAX_ITEMS_PER_PAGE = 50;
const DEFAULT_PAGE_SIZE = 20;

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

// Cache configuration for serverless optimization
const CACHE_CONFIG = {
  works: {
    maxAge: 60, // 1 minute for works list
    staleWhileRevalidate: 300, // 5 minutes stale-while-revalidate
  },
  work: {
    maxAge: 300, // 5 minutes for individual work
    staleWhileRevalidate: 600, // 10 minutes stale-while-revalidate
  },
};

// Helper functions are now imported from jwt utils

/**
 * Performance monitoring helper
 */
function logPerformance(operation: string, startTime: number) {
  const duration = Date.now() - startTime;
  console.log(`[PERFORMANCE] ${operation} completed in ${duration}ms`);
  
  // Log slow operations for optimization
  if (duration > 1000) {
    console.warn(`[PERFORMANCE] Slow operation detected: ${operation} took ${duration}ms`);
  }
}

/**
 * Sets appropriate cache headers for serverless optimization
 */
function setCacheHeaders(response: NextResponse, cacheType: keyof typeof CACHE_CONFIG) {
  const config = CACHE_CONFIG[cacheType];
  response.headers.set('Cache-Control', `public, max-age=${config.maxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`);
  response.headers.set('CDN-Cache-Control', `public, max-age=${config.maxAge}`);
  response.headers.set('Vercel-CDN-Cache-Control', `public, max-age=${config.maxAge}`);
}

/**
 * Authenticates request and verifies CREATOR role
 * Returns authenticated user data or error response
 */
async function authenticateCreator(request: NextRequest): Promise<AuthenticatedUser | NextResponse> {
  const authStart = Date.now();
  
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }
    
    if (decoded.role !== 'CREATOR' && decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. CREATOR or ADMIN role required.' },
        { status: 403 }
      );
    }

    logPerformance('Authentication', authStart);
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Invalid authentication token' },
      { status: 401 }
    );
  }
}

/**
 * Validates work submission data with enhanced error handling
 * Returns validation errors or null if valid
 */
function validateWorkData(data: WorkRequestBody): NextResponse | null {
  // Input sanitization
  const sanitizedData = {
    title: data.title?.trim(),
    body: data.body?.trim(),
    classification: data.classification?.trim(),
  };

  if (!sanitizedData.title) {
    return NextResponse.json(
      { error: 'Title is required' },
      { status: 400 }
    );
  }

  if (!sanitizedData.body) {
    return NextResponse.json(
      { error: 'Body is required' },
      { status: 400 }
    );
  }

  if (sanitizedData.body.length > MAX_BODY_LENGTH) {
    return NextResponse.json(
      { error: `Body must be ${MAX_BODY_LENGTH} characters or less` },
      { status: 400 }
    );
  }

  if (!sanitizedData.classification) {
    return NextResponse.json(
      { error: 'Classification is required' },
      { status: 400 }
    );
  }

  if (!VALID_CLASSIFICATIONS.includes(sanitizedData.classification as typeof VALID_CLASSIFICATIONS[number])) {
    return NextResponse.json(
      { error: 'Classification must be Synopsis, Scene Description, or Other' },
      { status: 400 }
    );
  }

  return null;
}

/**
 * Parses and sanitizes tags from various input formats with validation
 */
function parseTags(tags?: string | string[]): string[] {
  if (!tags) return [];
  
  let parsedTags: string[] = [];
  
  if (Array.isArray(tags)) {
    parsedTags = tags
      .filter(tag => typeof tag === 'string' && tag.trim())
      .map(tag => tag.trim())
      .filter(tag => tag.length <= 50); // Limit tag length
  } else if (typeof tags === 'string') {
    parsedTags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && tag.length <= 50);
  }
  
  // Limit number of tags
  return parsedTags.slice(0, 10);
}

/**
 * Optimized POST endpoint for work creation
 */
export async function POST(request: NextRequest) {
  const operationStart = Date.now();
  
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

    const response = NextResponse.json(
      {
        success: true,
        work: newWork,
      },
      { status: 201 }
    );

    // Set cache headers for the new work
    setCacheHeaders(response, 'work');
    
    logPerformance('Work creation', operationStart);
    return response;

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

/**
 * Optimized GET endpoint for work retrieval with caching and pagination
 */
export async function GET(request: NextRequest) {
  const operationStart = Date.now();
  
  try {
    // Parse pagination parameters from query string with validation
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    
    // Validate and parse pagination parameters
    const page = Math.max(1, parseInt(pageParam || '1', 10));
    const limit = Math.min(
      Math.max(1, parseInt(limitParam || String(DEFAULT_PAGE_SIZE), 10)),
      MAX_ITEMS_PER_PAGE
    );

    // Get all works with pagination
    const result = await userService.getAllWorks(page, limit);

    const response = NextResponse.json({
      success: true,
      works: result.works,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrev: result.hasPrev,
      },
    });

    // Set cache headers for works list
    setCacheHeaders(response, 'works');
    
    logPerformance('Works retrieval', operationStart);
    return response;

  } catch (error) {
    console.error('Works retrieval error:', error);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
