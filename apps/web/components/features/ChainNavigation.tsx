'use client';

import React from 'react';
import { Button } from '../ui/design-system';

interface ChainNavigationProps {
  currentPosition: number;
  totalPosts: number;
  chainId: string;
  onNavigateToPost?: (postId: string) => void;
  onNavigateToChain?: (chainId: string) => void;
  previousPostId?: string;
  nextPostId?: string;
  className?: string;
}

export default function ChainNavigation({
  currentPosition,
  totalPosts,
  chainId,
  onNavigateToPost,
  onNavigateToChain,
  previousPostId,
  nextPostId,
  className = ''
}: ChainNavigationProps) {
  const isFirstPost = currentPosition === 1;
  const isLastPost = currentPosition === totalPosts;

  const handlePrevious = () => {
    if (previousPostId && onNavigateToPost) {
      onNavigateToPost(previousPostId);
    }
  };

  const handleNext = () => {
    if (nextPostId && onNavigateToPost) {
      onNavigateToPost(nextPostId);
    }
  };

  const handleViewChain = () => {
    if (onNavigateToChain) {
      onNavigateToChain(chainId);
    }
  };

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <div className="flex-1">
          {!isFirstPost && previousPostId ? (
            <Button
              onClick={handlePrevious}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </Button>
          ) : (
            <div className="text-sm text-gray-400">
              {isFirstPost ? 'First post in chain' : 'No previous post'}
            </div>
          )}
        </div>

        {/* Chain Info */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              Part {currentPosition} of {totalPosts}
            </span>
            {totalPosts > 1 && (
              <button
                onClick={handleViewChain}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                View Chain
              </button>
            )}
          </div>
          
          {/* Progress indicator */}
          <div className="mt-2 flex justify-center">
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(totalPosts, 10) }, (_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index < currentPosition
                      ? 'bg-blue-600'
                      : index === currentPosition - 1
                      ? 'bg-blue-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
              {totalPosts > 10 && (
                <span className="text-xs text-gray-500 ml-1">+{totalPosts - 10}</span>
              )}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex-1 flex justify-end">
          {!isLastPost && nextPostId ? (
            <Button
              onClick={handleNext}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          ) : (
            <div className="text-sm text-gray-400">
              {isLastPost ? 'Latest post in chain' : 'No next post'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
