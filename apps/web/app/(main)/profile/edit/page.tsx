'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../stores/userSessionStore';
import { firebaseDataService } from '../../../../lib/firebase/dataService';
import ProfileEditForm from '../../../../components/features/ProfileEditForm';

export default function ProfileEditPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<{ id: string; name?: string | null; bio?: string | null; email: string; role: 'CREATOR' | 'ADMIN'; createdAt: string; updatedAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user) {
        router.push('/login?redirect=%2Fprofile%2Fedit');
        return;
      }
    }
  }, [isAuthenticated, authLoading, user, router]);

  useEffect(() => {
    if (!authLoading && user) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const userProfile = await firebaseDataService.getUserById(user.id);
          
          if (!userProfile) {
            setError('User profile not found');
            setLoading(false);
            return;
          }
          
          setProfile(userProfile);
        } catch (err) {
          console.error('Failed to load profile:', err);
          setError('Failed to load profile');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update your profile information
            </p>
          </div>
          <div className="p-6">
            <ProfileEditForm 
              user={{
                id: profile.id,
                email: profile.email,
                name: profile.name || '',
                bio: profile.bio || '',
                role: profile.role,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
