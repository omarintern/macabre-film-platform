'use client';

import React, { useState } from 'react';
import { Button, ErrorAlert, Card, CardContent, CardHeader, CardTitle } from '../ui/design-system';
import { workService } from '../../lib/services/workService';
import { useAuth } from '../../stores/userSessionStore';

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
  const { user } = useAuth();
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

  // Adaptive sizing functions for flexible form fields
  const calculateTextareaRows = (text: string): number => {
    if (!text) return 3; // Minimum rows for empty field
    
    const lines = text.split('\n').length;
    const estimatedLines = Math.ceil(text.length / 80); // Rough estimate based on average line length
    const calculatedRows = Math.max(lines, estimatedLines);
    
    // Dynamic sizing based on content length with reasonable bounds
    return Math.min(Math.max(calculatedRows, 3), 20); // Min 3 rows, max 20 rows
  };

  const calculateTitleRows = (text: string): number => {
    if (!text) return 1; // Single row for empty title
    
    const estimatedLines = Math.ceil(text.length / 60); // Titles typically shorter per line
    return Math.min(Math.max(estimatedLines, 1), 3); // Min 1 row, max 3 rows for titles
  };

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
      if (!user) {
        throw new Error('You must be logged in to submit work');
      }

      // Parse tags from comma-separated string
      const parsedTags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      // Use Firebase workService directly - no API routes needed!
      const work = await workService.createWork({
        title: formData.title.trim(),
        body: formData.body.trim(),
        classification: formData.classification,
        tags: parsedTags,
      }, user.id);

      console.log('✅ Work created successfully in Firebase:', work.title);

      // Success!
      setIsSuccess(true);
      setFormData({
        title: '',
        body: '',
        classification: '',
        tags: '',
      });

      if (onSubmissionSuccess) {
        onSubmissionSuccess(work);
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
      <Card className="max-w-2xl mx-auto shadow-lg border-border/50">
        <CardContent className="p-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-green-500"
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
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-foreground">
                Work submitted successfully!
              </h3>
              <div className="mt-2 text-muted-foreground">
                <p>Your work has been added to your portfolio.</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleReset}
              variant="secondary"
              size="md"
              className="font-medium"
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
      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-semibold text-foreground">Submit New Work</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {errors.general && (
              <ErrorAlert
                title="Error"
                message={errors.general}
                variant="error"
              />
            )}

            {/* Adaptive Title Field */}
            <div className="w-full">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <div className="relative">
                <textarea
                  id="title"
                  name="title"
                  rows={calculateTitleRows(formData.title)}
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 resize-none ${
                    errors.title
                      ? 'border-destructive bg-destructive/5 focus:ring-destructive/20'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
                  }`}
                  placeholder="Enter the title of your work"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                  style={{
                    minHeight: '42px', // Minimum height for usability
                    transition: 'height 0.3s ease-in-out'
                  }}
                />
              </div>
              {errors.title && (
                <p id="title-error" className="mt-1 text-sm text-destructive font-medium">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label htmlFor="classification" className="block text-sm font-medium text-foreground">
                Classification *
              </label>
              <select
                id="classification"
                name="classification"
                value={formData.classification}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
                  errors.classification 
                    ? 'border-destructive bg-destructive/5' 
                    : 'border-border bg-background hover:border-border/60'
                }`}
                aria-describedby={errors.classification ? 'classification-error' : undefined}
              >
                <option value="">Select classification</option>
                <option value="Synopsis">Synopsis</option>
                <option value="Scene Description">Scene Description</option>
                <option value="Other">Other</option>
              </select>
              {errors.classification && (
                <p id="classification-error" className="text-sm text-destructive font-medium">
                  {errors.classification}
                </p>
              )}
            </div>

            {/* Adaptive Body Field */}
            <div className="space-y-3">
              <label htmlFor="body" className="block text-sm font-medium text-foreground">
                Body *
              </label>
              <textarea
                id="body"
                name="body"
                rows={calculateTextareaRows(formData.body)}
                value={formData.body}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all duration-300 ${
                  errors.body 
                    ? 'border-destructive bg-destructive/5' 
                    : 'border-border bg-background hover:border-border/60'
                }`}
                placeholder="Enter your work content here..."
                aria-describedby={errors.body ? 'body-error' : 'body-counter'}
                style={{
                  minHeight: '90px', // Minimum height for usability
                  transition: 'height 0.3s ease-in-out'
                }}
              />
              <div className="flex justify-between items-center">
                <div>
                  {errors.body && (
                    <p id="body-error" className="text-sm text-destructive font-medium">
                      {errors.body}
                    </p>
                  )}
                </div>
                <p
                  id="body-counter"
                  className={`text-sm font-medium ${
                    remainingChars < 0 ? 'text-destructive' : remainingChars < 100 ? 'text-amber-600' : 'text-muted-foreground'
                  }`}
                >
                  {remainingChars} characters remaining
                </p>
              </div>
            </div>

            {/* Adaptive Tags Field */}
            <div className="w-full">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags/Hashtags
              </label>
              <div className="relative">
                <textarea
                  id="tags"
                  name="tags"
                  rows={Math.min(Math.max(Math.ceil(formData.tags.length / 50), 1), 3)}
                  value={formData.tags}
                  onChange={handleInputChange}
                  className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 resize-none ${
                    errors.tags
                      ? 'border-destructive bg-destructive/5 focus:ring-destructive/20'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
                  }`}
                  placeholder="Enter tags separated by commas (e.g., drama, thriller, action)"
                  aria-invalid={!!errors.tags}
                  aria-describedby={errors.tags ? 'tags-error' : 'tags-helper'}
                  style={{
                    minHeight: '42px', // Minimum height for usability
                    transition: 'height 0.3s ease-in-out'
                  }}
                />
              </div>
              {errors.tags && (
                <p id="tags-error" className="mt-1 text-sm text-destructive font-medium">
                  {errors.tags}
                </p>
              )}
              <p id="tags-helper" className="mt-1 text-sm text-gray-500">
                Optional. Separate multiple tags with commas.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                variant="primary"
                className="flex-1 font-medium"
              >
                {isLoading ? 'Submitting...' : 'Submit Work'}
              </Button>
              
              <Button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
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
}
