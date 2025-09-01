'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserSessionStore } from '../../../../stores/userSessionStore';
import ProfileEditForm from '../../../../components/features/ProfileEditForm';
import { profileService } from '../../../../lib/services/profileService';

interface User {
  id: string;
  email: string;
  name: string;
  bio: string;
  role: string;
}

interface ProfileEditClientProps {
  user: User;
}

export default function ProfileEditClient({ user }: ProfileEditClientProps) {
  const router = useRouter();
  const { setUserSession } = useUserSessionStore();

  const handleSave = async (data: { name: string; bio: string }) => {
    try {
      const updatedUser = await profileService.updateProfile(data);
      
      // Update the user session with new profile data
      setUserSession(
        { ...user, name: updatedUser.name, bio: updatedUser.bio },
        useUserSessionStore.getState().token || ''
      );
      
      // Redirect to public profile or show success message
      router.push(`/profile/${user.id}`);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error; // Let the form handle the error display
    }
  };

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
          initialName={user.name}
          initialBio={user.bio}
          onSave={handleSave}
          isLoading={false}
        />
      </div>
    </div>
  );
}
