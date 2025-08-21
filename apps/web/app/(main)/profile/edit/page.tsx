'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserSessionStore } from '../../../../stores/userSessionStore';
import ProfileEditForm from '../../../../components/features/ProfileEditForm';
import { profileService } from '../../../../lib/services/profileService';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, isAuthenticated, setUserSession } = useUserSessionStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated) {
      router.push('/login?redirect=/profile/edit');
      return;
    }

    if (user?.role !== 'CREATOR') {
      router.push('/');
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, user, router]);

  const handleSave = async (data: { name: string; bio: string }) => {
    try {
      const updatedUser = await profileService.updateProfile(data);
      
      // Update the user session with new profile data
      if (user) {
        setUserSession(
          { ...user, name: updatedUser.name, bio: updatedUser.bio },
          useUserSessionStore.getState().token || ''
        );
      }
      
      // Redirect to public profile or show success message
      router.push(`/profile/${user?.id}`);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error; // Let the form handle the error display
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'CREATOR') {
    return null; // This shouldn't happen due to useEffect redirect, but just in case
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Home
                </button>
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
                  <span className="ml-4 text-sm font-medium text-gray-500">Edit Profile</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <ProfileEditForm
          initialName={user.name || ''}
          initialBio={user.bio || ''}
          onSave={handleSave}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
