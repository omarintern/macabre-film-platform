import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../../lib/database';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    const { userId } = params;
    
    // Validate userId
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Get works by creator
    const works = await userService.getWorksByCreator(userId);

    return NextResponse.json({
      success: true,
      works,
    });

  } catch (error) {
    console.error('Error fetching works by creator:', error);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
