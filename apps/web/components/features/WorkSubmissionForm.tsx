'use client';

import React, { useState } from 'react';
import { Input, Button, ErrorAlert, Card, CardContent, CardHeader, CardTitle } from '../ui/design-system';

export interface Work {
  id: string;
  title: string;
  body: string;
  classification: string;
  tags: string[];
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface WorkSubmissionFormProps {
  onSubmissionSuccess?: (work: Work) => void;
}

interface FormData {
  title: string;
  body: string;
  classification: string;
  tags: string;
}

interface FormErrors {
  title?: string;
  body?: string;
  classification?: string;
  tags?: string;
  general?: string;
}

export default function WorkSubmissionForm({ onSubmissionSuccess }: WorkSubmissionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    body: '',
    classification: '',
    tags: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const maxBodyLength = 1000;
  const remainingChars = maxBodyLength - formData.body.length;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Body is required';
    } else if (formData.body.length > maxBodyLength) {
      newErrors.body = `Body must be ${maxBodyLength} characters or less`;
    }

    if (!formData.classification) {
      newErrors.classification = 'Classification is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Parse tags from comma-separated string
      const parsedTags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const response = await fetch('/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          body: formData.body.trim(),
          classification: formData.classification,
          tags: parsedTags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit work');
      }

      // Success!
      setIsSuccess(true);
      setFormData({
        title: '',
        body: '',
        classification: '',
        tags: '',
      });

      if (onSubmissionSuccess && data.work) {
        onSubmissionSuccess(data.work);
      }

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Work submission error:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      body: '',
      classification: '',
      tags: '',
    });
    setErrors({});
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Work submitted successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your work has been added to your portfolio.</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={handleReset}
              variant="secondary"
              size="sm"
            >
              Submit Another Work
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Submit New Work</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <ErrorAlert
                title="Error"
                message={errors.general}
                variant="error"
              />
            )}

            <Input
              id="title"
              name="title"
              type="text"
              label="Title *"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter the title of your work"
              error={!!errors.title}
              errorMessage={errors.title}
            />

            <div>
              <label htmlFor="classification" className="block text-sm font-medium text-gray-700 mb-2">
                Classification *
              </label>
              <select
                id="classification"
                name="classification"
                value={formData.classification}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.classification ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500`}
                aria-describedby={errors.classification ? 'classification-error' : undefined}
              >
                <option value="">Select classification</option>
                <option value="Synopsis">Synopsis</option>
                <option value="Scene Description">Scene Description</option>
                <option value="Other">Other</option>
              </select>
              {errors.classification && (
                <p id="classification-error" className="mt-1 text-sm text-red-600">
                  {errors.classification}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                Body *
              </label>
              <textarea
                id="body"
                name="body"
                rows={8}
                value={formData.body}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.body ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-vertical`}
                placeholder="Enter your work content here..."
                aria-describedby={errors.body ? 'body-error' : 'body-counter'}
              />
              <div className="mt-1 flex justify-between items-center">
                <div>
                  {errors.body && (
                    <p id="body-error" className="text-sm text-red-600">
                      {errors.body}
                    </p>
                  )}
                </div>
                <p
                  id="body-counter"
                  className={`text-sm ${
                    remainingChars < 0 ? 'text-red-600' : remainingChars < 100 ? 'text-yellow-600' : 'text-gray-500'
                  }`}
                >
                  {remainingChars} characters remaining
                </p>
              </div>
            </div>

            <Input
              id="tags"
              name="tags"
              type="text"
              label="Tags/Hashtags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Enter tags separated by commas (e.g., drama, thriller, action)"
              error={!!errors.tags}
              errorMessage={errors.tags}
              helperText="Optional. Separate multiple tags with commas."
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                variant="primary"
                fullWidth
              >
                {isLoading ? 'Submitting...' : 'Submit Work'}
              </Button>
              
              <Button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
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
}
