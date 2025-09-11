'use client';

import React, { useState, useEffect } from 'react';
import { Work } from '../../lib/services/workService';
import { firebaseDataService } from '../../lib/firebase/dataService';

interface MosaicChainHeaderProps {
  metaTitle: string;
  currentPosition: number;
  totalPosts: number;
  chainId: string;
  onNavigateToChain?: (chainId: string) => void;
}

export default function MosaicChainHeader({
  metaTitle,
  currentPosition,
  totalPosts,
  chainId,
  onNavigateToChain
}: MosaicChainHeaderProps) {
  const [chainWorks, setChainWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChainWorks = async () => {
      try {
        const works = await firebaseDataService.getWorksInChain(chainId);
        setChainWorks(works.sort((a, b) => (a.mosaicPosition || 0) - (b.mosaicPosition || 0)));
      } catch (error) {
        console.error('Error loading chain works:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChainWorks();
  }, [chainId]);

  const handleChainClick = () => {
    if (onNavigateToChain) {
      onNavigateToChain(chainId);
    }
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case 'Synopsis':
        return '📝';
      case 'Scene Description':
        return '🎬';
      case 'Other':
        return '📄';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-blue-100 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-blue-700">Mosaic Chain</span>
            </div>
            <div className="h-4 w-px bg-blue-300"></div>
            <span className="text-sm text-blue-600">
              Part {currentPosition} of {totalPosts}
            </span>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {metaTitle}
          </h2>
          
          {/* Chain Navigation Links */}
          <div className="mb-2">
            <p className="text-sm text-gray-600 mb-2">Chain Posts:</p>
            <div className="flex flex-wrap gap-2">
              {chainWorks.map((work, index) => (
                <button
                  key={work.id}
                  onClick={() => {
                    // Scroll to this work in the chain view
                    if (onNavigateToChain) {
                      onNavigateToChain(chainId);
                    }
                  }}
                  className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    work.mosaicPosition === currentPosition
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  <span>{getClassificationIcon(work.classification)}</span>
                  <span>Part {work.mosaicPosition}</span>
                </button>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            This post is part of a connected series. 
            {onNavigateToChain && (
              <button
                onClick={handleChainClick}
                className="ml-1 text-blue-600 hover:text-blue-800 underline font-medium"
              >
                View all posts in this chain
              </button>
            )}
          </p>
        </div>
        
        <div className="flex-shrink-0 ml-4">
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPosts }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index < currentPosition - 1
                    ? 'bg-blue-600'
                    : index === currentPosition - 1
                    ? 'bg-blue-400 ring-2 ring-blue-200'
                    : 'bg-gray-300'
                }`}
                title={`Part ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
