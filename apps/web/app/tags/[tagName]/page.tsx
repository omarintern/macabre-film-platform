import React from 'react';
import TagWorksGallery from '../../../components/features/TagWorksGallery';

interface TagResultsPageProps {
  params: Promise<{
    tagName: string;
  }>;
}

export async function generateMetadata({ params }: TagResultsPageProps) {
  const resolvedParams = await params;
  const tagName = decodeURIComponent(resolvedParams.tagName);
  
  return {
    title: `Works tagged "${tagName}" - Macabre`,
    description: `Browse all works tagged with "${tagName}" on our platform.`,
  };
}

export default async function TagResultsPage({ params }: TagResultsPageProps) {
  const resolvedParams = await params;
  const tagName = decodeURIComponent(resolvedParams.tagName);

  // Validate tag name
  if (!tagName || tagName.trim() === '') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Tag</h1>
            <p className="text-lg text-gray-600 mb-6">
              The tag name provided is invalid or empty.
            </p>
            <a
              href="/index"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Browse all tags
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <a href="/index" className="hover:text-gray-700 transition-colors">
              Index
            </a>
            <span>/</span>
            <span className="text-gray-900">#{tagName}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Works tagged &quot;#{tagName}&quot;
          </h1>
          <p className="text-lg text-gray-600">
            Browse all works associated with this tag
          </p>
        </div>

        {/* Tag Works Gallery */}
        <TagWorksGallery tagName={tagName} />
      </div>
    </div>
  );
}
