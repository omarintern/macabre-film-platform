'use client';

import React from 'react';
import Link from 'next/link';
import { Tag } from '../../lib/services/workService';

interface TagCardProps {
  tag: Tag;
}

const TagCard: React.FC<TagCardProps> = ({ tag }) => {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag.name)}`}
      className="block group"
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            #{tag.name}
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {tag.count}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          {tag.count === 1 ? '1 work' : `${tag.count} works`}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-blue-600 group-hover:text-blue-800 transition-colors">
            View works →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TagCard;
