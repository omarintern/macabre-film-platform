import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PublicProfile from '../../../../components/features/PublicProfile';
import { profileService } from '../../../../lib/services/profileService';

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  
  // Validate userId parameter
  if (!userId || typeof userId !== 'string') {
    notFound();
  }

  try {
    // Fetch the public profile
    const profile = await profileService.getPublicProfile(userId);
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">
                    Creator Profile
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Public Profile Component */}
          <PublicProfile profile={profile} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to load profile:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('User not found') || 
          error.message.includes('Profile not available')) {
        notFound();
      }
    }
    
    // For other errors, show a generic error page
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t load this profile. Please try again later.
          </p>
          <Link
            href="/"
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: ProfilePageProps) {
  try {
    const { userId } = await params;
    const profile = await profileService.getPublicProfile(userId);
    
    return {
      title: `${profile.name || 'Creator'} - Macabre`,
      description: profile.bio ? 
        profile.bio.substring(0, 160) + '...' : 
        `View ${profile.name || 'this creator'}'s profile and works on Macabre.`,
    };
  } catch {
    return {
      title: 'Profile - Macabre',
      description: 'Creator profile on Macabre',
    };
  }
}
