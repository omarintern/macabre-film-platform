import React from 'react';
import { Work } from '../../lib/services/workService';
import WorkCard from './WorkCard';

interface CreatorWorksListProps {
  creatorId?: string; // Used for data fetching in parent component
  works?: Work[];
  isLoading?: boolean;
  error?: string | null;
}

const CreatorWorksList = ({ works = [], isLoading = false, error }: CreatorWorksListProps) => {
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((columnIndex) => (
            <div key={columnIndex} className="space-y-6">
              {[1].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Works</h3>
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
              <p className="text-sm text-red-800">
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Works</h3>
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
          <h4 className="mt-4 text-lg font-medium text-gray-900">No works yet</h4>
          <p className="mt-2 text-sm text-gray-500">
            This creator hasn&apos;t submitted any works yet.
          </p>
        </div>
      </div>
    );
  }

  const columns = distributeWorksToColumns(works);

  // Works list - Chronological masonry layout
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">
        Works ({works.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-6">
            {column.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatorWorksList;