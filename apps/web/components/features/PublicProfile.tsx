'use client';

import React from 'react';
import { PublicProfile as PublicProfileType } from '../../lib/services/profileService';
import CreatorWorksList from './CreatorWorksList';
import { useWorksByCreator } from '../../hooks/useWorksByCreator';

interface PublicProfileProps {
  profile: PublicProfileType;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ profile }) => {
  const { works, isLoading, error } = useWorksByCreator(profile.id);
  
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
              <p className="text-gray-600 italic">
                This creator hasn&apos;t added a bio yet.
              </p>
            )}
          </div>

          {/* Works Section */}
          <div className="mb-8">
            <CreatorWorksList 
              creatorId={profile.id}
              works={works}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : works.length}
              </div>
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
