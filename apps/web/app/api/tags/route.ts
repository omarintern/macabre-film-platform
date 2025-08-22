import { NextResponse } from 'next/server';
import { userService } from '../../../lib/database';

export async function GET() {
  try {
    // Get all unique tags with counts
    const tags = await userService.getAllTags();

    return NextResponse.json({
      success: true,
      tags,
    });

  } catch (error) {
    console.error('Tags retrieval error:', error);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
