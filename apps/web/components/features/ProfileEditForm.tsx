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
      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-semibold text-foreground">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
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

            <div className="space-y-3">
              <label htmlFor="bio" className="block text-sm font-medium text-foreground">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-vertical transition-all duration-200 ${
                  errors.bio 
                    ? 'border-destructive bg-destructive/5' 
                    : 'border-border bg-background hover:border-border/60'
                }`}
                placeholder="Tell others about yourself..."
                aria-describedby={errors.bio ? 'bio-error' : 'bio-counter'}
              />
              {errors.bio && (
                <p id="bio-error" className="text-sm text-destructive font-medium" role="alert">
                  {errors.bio}
                </p>
              )}
              <p id="bio-counter" className="text-sm text-muted-foreground font-medium">
                {formData.bio.length}/1000 characters
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                loading={isSubmitting}
                variant="primary"
                className="flex-1 font-medium"
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
                className="flex-1 font-medium"
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
