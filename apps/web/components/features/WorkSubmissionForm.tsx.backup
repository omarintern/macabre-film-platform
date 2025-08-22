'use client';

import React, { useState } from 'react';

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
      <div className="max-w-2xl mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
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
          <button
            onClick={handleReset}
            className="bg-green-100 text-green-800 px-4 py-2 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
          >
            Submit Another Work
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500`}
            placeholder="Enter the title of your work"
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        {/* Classification Field */}
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

        {/* Body Field */}
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

        {/* Tags Field */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags/Hashtags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${
              errors.tags ? 'border-red-300' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500`}
            placeholder="Enter tags separated by commas (e.g., drama, thriller, action)"
            aria-describedby={errors.tags ? 'tags-error' : 'tags-help'}
          />
          {errors.tags ? (
            <p id="tags-error" className="mt-1 text-sm text-red-600">
              {errors.tags}
            </p>
          ) : (
            <p id="tags-help" className="mt-1 text-sm text-gray-500">
              Optional. Separate multiple tags with commas.
            </p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Submitting...' : 'Submit Work'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
