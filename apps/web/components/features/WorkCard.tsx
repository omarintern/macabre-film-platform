import React from 'react';
import { Work } from '../../lib/services/workService';
import Link from 'next/link';

interface WorkCardProps {
  work: Work;
}

const WorkCard: React.FC<WorkCardProps> = ({ work }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {work.title}
        </h3>

        {/* Classification Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {work.classification}
          </span>
        </div>

        {/* Body Preview */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {truncateText(work.body, 150)}
        </p>

        {/* Tags */}
        {work.tags && work.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {work.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                #{tag}
              </span>
            ))}
            {work.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
                +{work.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Creator and Date */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <span className="font-medium text-gray-700">
              {work.creator?.name || 'Anonymous Creator'}
            </span>
          </div>
          <span>{formatDate(work.createdAt)}</span>
        </div>

        {/* View Details Link */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={`/works/${work.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
          >
            View Details
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkCard;
