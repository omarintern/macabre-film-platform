import React from 'react';
import WorksGallery from '../../components/features/WorksGallery';

export const metadata = {
  title: 'Spaces - Browse All Works',
  description: 'Browse all short text works submitted by creators on our platform.',
};

export default function SpacesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Spaces
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Browse all works submitted by creators
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <WorksGallery />
        </div>
      </section>
    </div>
  );
}
