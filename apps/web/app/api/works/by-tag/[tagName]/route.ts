import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../../lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { tagName: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50.' },
        { status: 400 }
      );
    }

    // Decode and validate the tag name from URL
    const tagName = decodeURIComponent(params.tagName);
    
    if (!tagName || tagName.trim() === '') {
      return NextResponse.json(
        { error: 'Tag name is required and cannot be empty.' },
        { status: 400 }
      );
    }

    // Sanitize tag name to prevent potential injection
    const sanitizedTagName = tagName.trim();

    // Get works filtered by tag with pagination
    const result = await userService.getWorksByTag(sanitizedTagName, page, limit);

    return NextResponse.json({
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
      tagName: sanitizedTagName,
    });

  } catch (error) {
    console.error('Tag works retrieval error:', error);
    
    // Provide more specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('Database')) {
        return NextResponse.json(
          { error: 'Database connection error. Please try again later.' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
