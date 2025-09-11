'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import PublicProfile from '../../../../components/features/PublicProfile';
import { firebaseDataService } from '../../../../lib/firebase/dataService';
import { useAuth } from '../../../../stores/userSessionStore';

interface PublicProfileType {
  id: string;
  name?: string | null;
  bio?: string | null;
  role: 'CREATOR' | 'ADMIN';
  createdAt: string;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<PublicProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = params?.userId as string;

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=%2Fprofile');
        return;
      }
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!userId || typeof userId !== 'string') {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const user = await firebaseDataService.getUserById(userId);
        
        if (!user) {
          setError('User not found');
          setLoading(false);
          return;
        }
        
        // Transform user data to PublicProfile format
        const profileData = {
          id: user.id,
          name: user.name,
          bio: user.bio,
          role: user.role,
          createdAt: user.createdAt
        };
        
        setProfile(profileData);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

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
            {error === 'User not found' ? 'Profile Not Found' : 'Something went wrong'}
          </h1>
          <p className="text-gray-600 mb-4">
            {error === 'User not found' 
              ? 'The profile you\'re looking for doesn\'t exist.'
              : 'We couldn\'t load this profile. Please try again later.'
            }
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

  if (!profile) {
    return null;
  }

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
}