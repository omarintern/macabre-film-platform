'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../stores/userSessionStore';
import MosaicChainManager from '../../../../components/features/MosaicChainManager';
import { Button } from '../../../../components/ui/design-system';
import Link from 'next/link';

export default function ChainManagementPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'manage' | 'view'>('manage');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You must be logged in to manage your chains.</p>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'CREATOR') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Only creators can manage mosaic chains.</p>
          <Link href="/">
            <Button variant="secondary">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleViewChain = (chainId: string) => {
    // TODO: Implement chain viewing functionality
    console.log('View chain:', chainId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chain Management</h1>
              <p className="text-gray-600 mt-2">
                Manage your mosaic chains and connected post series
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/profile/edit">
                <Button variant="secondary">Edit Profile</Button>
              </Link>
              <Link href="/spaces">
                <Button>View Spaces</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setViewMode('manage')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                viewMode === 'manage'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Chains
            </button>
            <button
              onClick={() => setViewMode('view')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                viewMode === 'view'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              View All Chains
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {viewMode === 'manage' ? (
            <MosaicChainManager
              onViewChain={handleViewChain}
              className=""
            />
          ) : (
            <div className="p-6">
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chain Viewer</h3>
                <p className="text-gray-600">
                  This feature will allow you to view all your chains in a visual format.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
