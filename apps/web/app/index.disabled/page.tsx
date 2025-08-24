import React from 'react';
import TagList from '../../components/features/TagList';

export const metadata = {
  title: 'Index - Browse All Tags',
  description: 'Browse all tags and hashtags used in works on our platform.',
};

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Index
          </h1>
          <p className="text-lg text-gray-600">
            Browse all tags and hashtags used in works
          </p>
        </div>

        {/* Tags List */}
        <TagList />
      </div>
    </div>
  );
}
