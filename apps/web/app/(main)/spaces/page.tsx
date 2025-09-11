'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../stores/userSessionStore';
import { Button } from '../../../components/ui/design-system';
import WorksGallery from '../../../components/features/WorksGallery';
import WorkSubmissionModal from '../../../components/features/WorkSubmissionModal';
import { Work } from '../../../components/features/WorkSubmissionForm';

export default function SpacesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, isAuthenticated } = useAuth();

  const handleSubmissionSuccess = (work: Work) => {
    console.log('✅ Work submitted successfully:', work.title);
    
    // Trigger refresh after successful submission
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 500);
  };

  const canCreateWork = isAuthenticated && (user?.role === 'CREATOR' || user?.role === 'ADMIN');

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Spaces
              </h1>
              <p className="text-lg text-gray-700">
                Browse all works submitted by creators
              </p>
            </div>
            
            {canCreateWork && (
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="primary"
                size="lg"
                className="rounded-full px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Post
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <WorksGallery refreshTrigger={refreshKey} />
        </div>
      </section>

      {/* Work Submission Modal */}
      <WorkSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmissionSuccess={handleSubmissionSuccess}
      />
    </div>
  );
}