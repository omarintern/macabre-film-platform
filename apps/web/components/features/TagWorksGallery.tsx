'use client';

import React, { useState } from 'react';
import { useTagWorksGallery } from '../../hooks/useTagWorksGallery';
import WorkCard from './WorkCard';
import Pagination from '../ui/Pagination';
import { Work } from '../../lib/services/workService';

interface TagWorksGalleryProps {
  tagName: string;
}

const TagWorksGallery: React.FC<TagWorksGalleryProps> = ({ tagName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { works, pagination, isLoading, error } = useTagWorksGallery(tagName, currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Distribute works chronologically across 3 columns
  const distributeWorksToColumns = (works: Work[]) => {
    const columns: Work[][] = [[], [], []];
    works.forEach((work, index) => {
      const columnIndex = index % 3;
      columns[columnIndex].push(work);
    });
    return columns;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading works">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((columnIndex) => (
            <div key={columnIndex} className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse" data-testid="skeleton" aria-hidden="true">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="sr-only">Loading works tagged {tagName}...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
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
              <h3 className="text-sm font-medium text-red-800">
                Error loading works
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!works || works.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No works found</h3>
        <p className="mt-2 text-sm text-gray-600">
          No works have been tagged with &quot;#{tagName}&quot; yet.
        </p>
        <div className="mt-6">
          <a
            href="/index"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            Browse all tags
          </a>
        </div>
      </div>
    );
  }

  const columns = distributeWorksToColumns(works);

  return (
    <div className="space-y-8">
      {/* Works Grid - Chronological masonry layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-6">
            {column.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
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
      <div className="text-center text-sm text-gray-600">
        Showing {works.length} of {pagination?.total || 0} works tagged &quot;#{tagName}&quot;
      </div>
    </div>
  );
};

export default TagWorksGallery;