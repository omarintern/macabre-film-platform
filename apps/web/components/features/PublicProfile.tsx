import React from 'react';
import { PublicProfile as PublicProfileType } from '../../lib/services/profileService';

interface PublicProfileProps {
  profile: PublicProfileType;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ profile }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            {/* Avatar placeholder */}
            <div className="h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold">
                {profile.name || 'Anonymous Creator'}
              </h1>
              <p className="text-gray-200 text-lg capitalize">
                {profile.role.toLowerCase()}
              </p>
              <p className="text-gray-300 text-sm">
                Member since {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 py-8">
          {/* Bio Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
            {profile.bio ? (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                This creator hasn&apos;t added a bio yet.
              </p>
            )}
          </div>

          {/* Works Section - Placeholder for future implementation */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Works</h2>
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <div className="text-gray-400">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No works yet
                </h3>
                <p className="text-gray-500">
                  This creator hasn&apos;t submitted any works yet. Check back later!
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section - Placeholder for future implementation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Works Published</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Collaborations</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
