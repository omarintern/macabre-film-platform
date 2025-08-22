'use client';

import React, { useState } from 'react';
import { useWorksGallery } from '../../hooks/useWorksGallery';
import WorkCard from './WorkCard';
import Pagination from '../ui/Pagination';
import { Skeleton, ErrorAlert } from '../ui/design-system';

const WorksGallery: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { works, pagination, isLoading, error } = useWorksGallery(currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-3 w-1/4" />
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
        title="Error loading works"
        message={error}
        variant="error"
      />
    );
  }

  // Empty state
  if (!works || works.length === 0) {
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-6 text-xl font-semibold text-foreground">No works yet</h3>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Be the first to submit a work and share your creative vision with the community.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
          />
        </div>
      )}

      {/* Results info */}
      {pagination && (
        <div className="text-center text-sm text-muted-foreground font-medium">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} works
        </div>
      )}
    </div>
  );
};

export default WorksGallery;
