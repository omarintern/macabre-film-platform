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
      <div className="space-y-8">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-8 space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="break-inside-avoid mb-2" data-testid="skeleton">
              <Skeleton className="h-5 w-24 inline-block" />
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
      <div className="text-center py-16">
        <svg
          className="mx-auto h-16 w-16 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <h3 className="mt-6 text-xl font-semibold text-foreground">No tags yet</h3>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Tags will appear here once works are submitted with tags.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tags in Columns */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-8 space-y-2">
        {tags.map((tag) => (
          <div key={tag.name} className="break-inside-avoid mb-2">
            <TagCard tag={tag} />
          </div>
        ))}
      </div>

      {/* Results info */}
      <div className="text-center text-sm text-muted-foreground font-medium">
        Showing {tags.length} tags
      </div>
    </div>
  );
};

export default TagList;
