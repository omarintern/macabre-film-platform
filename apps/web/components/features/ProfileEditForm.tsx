'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserSessionStore } from '../../stores/userSessionStore';
import { firebaseDataService } from '../../lib/firebase/dataService';
import { Button } from '../ui/design-system';

interface User {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  role: 'CREATOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

interface ProfileEditFormProps {
  user: User;
}

interface FormData {
  name: string;
  bio: string;
}

interface FormErrors {
  name?: string;
  bio?: string;
  general?: string;
}

export default function ProfileEditForm({ user }: ProfileEditFormProps) {
  const { setUserSession } = useUserSessionStore();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    bio: user?.bio || ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be 100 characters or less';
    }

    // Bio validation
    if (formData.bio.length > 1000) {
      newErrors.bio = 'Bio must be 1000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Update profile using Firebase data service
      // Update profile using Firebase data service
      await firebaseDataService.updateUserProfile(user.id, {
        name: formData.name.trim(),
        bio: formData.bio.trim()
      });

      // Fetch the updated user data
      const updatedUser = await firebaseDataService.getUserById(user.id);
      // Update the user session store
      setUserSession(updatedUser, ''); // Firebase handles tokens internally

      // Redirect to profile page
      router.push(`/profile/${user.id}`);
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({
        general: 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter your name"
          maxLength={100}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.bio ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Tell us about yourself..."
          maxLength={1000}
        />
        <div className="mt-1 flex justify-between text-sm text-gray-500">
          {errors.bio && (
            <p className="text-red-600">{errors.bio}</p>
          )}
          <span className="ml-auto">
            {formData.bio.length}/1000 characters
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(`/profile/${user.id}`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
