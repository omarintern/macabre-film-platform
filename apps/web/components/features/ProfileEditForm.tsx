'use client';

import React, { useState } from 'react';
import { Input, Button, ErrorAlert, Card, CardContent, CardHeader, CardTitle } from '../ui/design-system';

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
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {errors.general && (
              <ErrorAlert
                title="Error"
                message={errors.general}
                variant="error"
              />
            )}

            <Input
              id="name"
              name="name"
              type="text"
              label="Display Name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your display name"
              error={!!errors.name}
              errorMessage={errors.name}
              helperText={`${formData.name.length}/100 characters`}
            />

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
                aria-describedby={errors.bio ? 'bio-error' : 'bio-counter'}
              />
              {errors.bio && (
                <p id="bio-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.bio}
                </p>
              )}
              <p id="bio-counter" className="mt-1 text-sm text-gray-500">
                {formData.bio.length}/1000 characters
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                loading={isSubmitting}
                variant="primary"
                fullWidth
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </Button>
              
              <Button
                type="button"
                onClick={() => {
                  setFormData({ name: initialName, bio: initialBio });
                  setErrors({});
                }}
                disabled={isSubmitting || isLoading}
                variant="secondary"
                fullWidth
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEditForm;
