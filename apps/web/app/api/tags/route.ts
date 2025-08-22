import { NextResponse } from 'next/server';
import { userService } from '../../../lib/database';

// Enable edge runtime for global performance
export const runtime = 'edge';

// Cache configuration for edge function optimization
const CACHE_CONFIG = {
  maxAge: 300, // 5 minutes
  staleWhileRevalidate: 600, // 10 minutes
};

/**
 * Sets appropriate cache headers for edge function optimization
 */
function setEdgeCacheHeaders(response: NextResponse) {
  response.headers.set('Cache-Control', `public, max-age=${CACHE_CONFIG.maxAge}, stale-while-revalidate=${CACHE_CONFIG.staleWhileRevalidate}`);
  response.headers.set('CDN-Cache-Control', `public, max-age=${CACHE_CONFIG.maxAge}`);
  response.headers.set('Vercel-CDN-Cache-Control', `public, max-age=${CACHE_CONFIG.maxAge}`);
}

export async function GET() {
  try {
    // Get all unique tags with counts
    const tags = await userService.getAllTags();

    const response = NextResponse.json({
      success: true,
      tags,
    });

    // Set cache headers for edge function optimization
    setEdgeCacheHeaders(response);

    return response;

  } catch (error) {
    console.error('Tags retrieval error:', error);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
