import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../../lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Validate userId parameter
    if (!userId?.trim()) {
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    // Get works by creator, ordered by createdAt DESC (most recent first)
    const works = await userService.getWorksByCreator(userId);

    return NextResponse.json({
      success: true,
      works,
    });

  } catch (error) {
    console.error('Works retrieval by creator error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Creator not found') || error.message.includes('User not found')) {
        return NextResponse.json(
          { error: 'Creator not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
