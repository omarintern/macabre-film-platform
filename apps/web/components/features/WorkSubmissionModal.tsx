'use client';

import React, { useState } from 'react';
import { Button, ErrorAlert } from '../ui/design-system';
import { Work } from './WorkSubmissionForm';
import { workService } from '../../lib/services/workService';
import { useAuth } from '../../stores/userSessionStore';
import MosaicChainBuilder from './MosaicChainBuilder';
import PostSelector from './PostSelector';
import ReferenceSelector from './ReferenceSelector';

interface WorkSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmissionSuccess?: (work: Work) => void;
}

interface FormData {
  title: string;
  body: string;
  classification: string;
  tags: string;
  connectionType: 'none' | 'mosaic' | 'reference';
  mosaicMetaTitle: string;
  parentPost: Work | null;
  references: string[];
}

interface FormErrors {
  title?: string;
  body?: string;
  classification?: string;
  tags?: string;
  general?: string;
}

export default function WorkSubmissionModal({ 
  isOpen, 
  onClose, 
  onSubmissionSuccess 
}: WorkSubmissionModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    body: '',
    classification: '',
    tags: '',
    connectionType: 'none',
    mosaicMetaTitle: '',
    parentPost: null,
    references: [],
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const maxBodyLength = 2000;
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

  const handleMosaicMetaTitleChange = (metaTitle: string) => {
    setFormData(prev => ({
      ...prev,
      mosaicMetaTitle: metaTitle,
    }));
  };

  const handleParentPostChange = (parentPost: Work | null) => {
    setFormData(prev => ({
      ...prev,
      parentPost,
    }));
  };

  const handleReferencesChange = (references: string[]) => {
    setFormData(prev => ({
      ...prev,
      references,
    }));
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

    // Connection-specific validation
    if (formData.connectionType === 'mosaic' && !formData.mosaicMetaTitle.trim()) {
      newErrors.general = 'Meta-title is required for mosaic connections';
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
        // Story 2.6: Pass mosaic chain data
        connectionType: formData.connectionType,
        mosaicMetaTitle: formData.connectionType === 'mosaic' ? formData.mosaicMetaTitle : undefined,
        mosaicId: formData.connectionType === 'mosaic' && formData.parentPost ? formData.parentPost.mosaicId : undefined,
        references: formData.connectionType === 'reference' ? formData.references.map(ref => ({
          postId: 'placeholder-id',
          title: ref,
          creatorName: 'placeholder-creator'
        })) : undefined,
      }, user.id);

      console.log('✅ Work created successfully in Firebase:', work.title);

      // Success! Reset form and close modal
      resetForm();

      if (onSubmissionSuccess) {
        onSubmissionSuccess(work);
      }

      onClose();

    } catch (error) {
      console.error('Work submission error:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      classification: '',
      tags: '',
      connectionType: 'none',
      mosaicMetaTitle: '',
      parentPost: null,
      references: [],
    });
    setErrors({});
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - very light overlay to keep background clearly visible */}
      <div 
        className="absolute inset-0 transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)', // Only 10% opacity
        }}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-900">Post New Work</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 ease-in-out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white rounded-b-xl">
          {errors.general && (
            <ErrorAlert
              title="Error"
              message={errors.general}
              variant="error"
            />
          )}

          {/* Title */}
          <div>
            <label htmlFor="modal-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="modal-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.title
                  ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white'
              }`}
              placeholder="Enter work title"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Classification */}
          <div>
            <label htmlFor="modal-classification" className="block text-sm font-medium text-gray-700 mb-1">
              Classification *
            </label>
            <select
              id="modal-classification"
              name="classification"
              value={formData.classification}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.classification
                  ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white'
              }`}
              disabled={isLoading}
            >
              <option value="">Select classification</option>
              <option value="Synopsis">Synopsis</option>
              <option value="Scene Description">Scene Description</option>
              <option value="Other">Other</option>
            </select>
            {errors.classification && (
              <p className="mt-1 text-sm text-red-600">{errors.classification}</p>
            )}
          </div>

          {/* Body */}
          <div>
            <label htmlFor="modal-body" className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              id="modal-body"
              name="body"
              rows={8}
              value={formData.body}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 ${
                errors.body
                  ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white'
              }`}
              placeholder="Enter your work content..."
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.body && (
                <p className="text-sm text-red-600">{errors.body}</p>
              )}
              <p className={`text-sm ml-auto ${
                remainingChars < 0 ? 'text-red-600' : remainingChars < 100 ? 'text-amber-600' : 'text-gray-500'
              }`}>
                {remainingChars} characters remaining
              </p>
            </div>
          </div>

          {/* Connections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Connections
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="connectionType"
                  value="none"
                  checked={formData.connectionType === 'none'}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">None</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="connectionType"
                  value="mosaic"
                  checked={formData.connectionType === 'mosaic'}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Start/Continue Mosaic</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="connectionType"
                  value="reference"
                  checked={formData.connectionType === 'reference'}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Add References</span>
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Optional. Connect this work to other posts.
            </p>

            {/* Conditional rendering for connection-specific interfaces */}
            {formData.connectionType === 'mosaic' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <MosaicChainBuilder
                  onMetaTitleChange={handleMosaicMetaTitleChange}
                  onParentPostChange={handleParentPostChange}
                  metaTitle={formData.mosaicMetaTitle}
                  parentPost={formData.parentPost}
                  disabled={isLoading}
                />
              </div>
            )}

            {formData.connectionType === 'reference' && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <ReferenceSelector
                  onReferencesChange={handleReferencesChange}
                  references={formData.references}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="modal-tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              id="modal-tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:border-gray-300 focus:bg-white transition-all duration-200"
              placeholder="drama, thriller, action"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional. Separate multiple tags with commas.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              variant="secondary"
              className="flex-1 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              variant="primary"
              className="flex-1 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? 'Posting...' : 'Post Work'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}