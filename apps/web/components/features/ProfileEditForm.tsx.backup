'use client';

import React, { useState } from 'react';

interface ProfileEditFormProps {
  initialName?: string;
  initialBio?: string;
  onSave: (data: { name: string; bio: string }) => Promise<void>;
  isLoading?: boolean;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  initialName = '',
  initialBio = '',
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialName,
    bio: initialBio,
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    bio?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be 100 characters or less';
    }

    if (formData.bio.trim().length > 1000) {
      newErrors.bio = 'Bio must be 1000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSave({
        name: formData.name.trim(),
        bio: formData.bio.trim(),
      });
    } catch (error) {
      console.error('Profile update failed:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500`}
              placeholder="Enter your display name"

              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.name}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.name.length}/100 characters
            </p>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.bio ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-vertical`}
              placeholder="Tell others about yourself..."

              aria-describedby={errors.bio ? 'bio-error' : undefined}
            />
            {errors.bio && (
              <p id="bio-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.bio}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.bio.length}/1000 characters
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={`flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
              } transition-colors`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setFormData({ name: initialName, bio: initialBio });
                setErrors({});
              }}
              disabled={isSubmitting || isLoading}
              className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;
