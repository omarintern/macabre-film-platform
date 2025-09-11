'use client';

import React from 'react';
import CreatorWorksList from './CreatorWorksList';
import { useWorksByCreator } from '../../hooks/useWorksByCreator';

interface PublicProfileType {
  id: string;
  name?: string | null;
  bio?: string | null;
  role: 'CREATOR' | 'ADMIN';
  createdAt: string;
}

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
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {profile.name || 'Anonymous Creator'}
              </h1>
              <p className="text-gray-300 text-lg capitalize">
                {profile.role.toLowerCase()}
              </p>
              <p className="text-gray-400 text-sm">
                Member since {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 py-8">
          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            {profile.bio ? (
              <div className="prose max-w-none">
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

          {/* Works Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Works</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <span className="ml-2 text-gray-600">Loading works...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600">Failed to load works. Please try again later.</p>
              </div>
            ) : works && works.length > 0 ? (
              <CreatorWorksList works={works} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No works submitted yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;