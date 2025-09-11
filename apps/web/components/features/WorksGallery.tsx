'use client';

import React, { useState, useMemo } from 'react';
import { useWorksGallery } from '../../hooks/useWorksGallery';
import { useRealtimeWorks } from '../../hooks/useRealtimeWorks';
import WorkCard from './WorkCard';
import Pagination from '../ui/Pagination';
import { Skeleton, ErrorAlert } from '../ui/design-system';
import { Work } from '../../lib/services/workService';

interface WorksGalleryProps {
  refreshTrigger?: number;
}

const WorksGallery: React.FC<WorksGalleryProps> = ({ refreshTrigger }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { works, pagination, isLoading, error } = useWorksGallery(currentPage, refreshTrigger);
  const { realtimeWorks, isConnected } = useRealtimeWorks();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Combine real-time works with paginated works, avoiding duplicates
  const allWorks = useMemo(() => {
    if (!realtimeWorks.length) return works;
    
    // Convert realtime works to regular Work format
    const realtimeAsWorks: Work[] = realtimeWorks.map(rw => ({
      id: rw.id,
      title: rw.title,
      body: rw.body,
      classification: rw.classification,
      tags: rw.tags,
      creatorId: rw.creatorId,
      createdAt: new Date(rw.timestamp || Date.now()),
      updatedAt: new Date(rw.timestamp || Date.now()),
      creator: rw.creator
    }));

    // Combine and deduplicate by ID
    const existingIds = new Set(works.map(w => w.id));
    const newRealtimeWorks = realtimeAsWorks.filter(rw => !existingIds.has(rw.id));
    
    // Put new real-time works at the top
    return [...newRealtimeWorks, ...works];
  }, [realtimeWorks, works]);

  // Distribute works chronologically across 3 columns
  const distributeWorksToColumns = (works: Work[]) => {
    const columns: Work[][] = [[], [], []];
    works.forEach((work, index) => {
      const columnIndex = index % 3;
      columns[columnIndex].push(work);
    });
    return columns;
  };

  // Loading state - updated for column layout
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2].map((columnIndex) => (
            <div key={columnIndex} className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
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
  if (!allWorks || allWorks.length === 0) {
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
        {isConnected && (
          <p className="mt-2 text-sm text-green-600">
            🔴 Live - New submissions will appear instantly
          </p>
        )}
      </div>
    );
  }

  const columns = distributeWorksToColumns(allWorks);

  return (
    <div className="space-y-12">
      {/* Real-time status indicator */}
      {isConnected && (
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates active</span>
          </div>
        </div>
      )}
      
      {/* Works Grid - Chronological masonry layout with 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-8">
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
      {pagination && (
        <div className="text-center text-sm text-gray-600 font-medium">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} works
        </div>
      )}
    </div>
  );
};

export default WorksGallery;