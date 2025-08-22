'use client';

import React from 'react';
import { useTags } from '../../hooks/useTags';
import TagCard from './TagCard';
import { Skeleton, ErrorAlert } from '../ui/design-system';

const TagList: React.FC = () => {
  const { tags, isLoading, error } = useTags();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4" data-testid="skeleton">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorAlert
        title="Error loading tags"
        message={error}
        variant="error"
      />
    );
  }

  // Empty state
  if (!tags || tags.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No tags yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          Tags will appear here once works are submitted with tags.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <TagCard key={tag.name} tag={tag} />
        ))}
      </div>

      {/* Results info */}
      <div className="text-center text-sm text-gray-500">
        Showing {tags.length} tags
      </div>
    </div>
  );
};

export default TagList;
