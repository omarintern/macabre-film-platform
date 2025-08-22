import React from 'react';
import WorksGallery from '../../components/features/WorksGallery';

export const metadata = {
  title: 'Spaces - Browse All Works',
  description: 'Browse all short text works submitted by creators on our platform.',
};

export default function SpacesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Spaces
          </h1>
          <p className="text-lg text-gray-600">
            Browse all short text works submitted by creators
          </p>
        </div>

        {/* Works Gallery */}
        <WorksGallery />
      </div>
    </div>
  );
}
