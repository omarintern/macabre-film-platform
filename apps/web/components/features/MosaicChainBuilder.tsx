'use client';

import React, { useState } from 'react';
import { Work } from '../../lib/services/workService';
import PostSelector from './PostSelector';

interface MosaicChainBuilderProps {
  onMetaTitleChange: (metaTitle: string) => void;
  onParentPostChange: (post: Work | null) => void;
  metaTitle: string;
  parentPost: Work | null;
  disabled?: boolean;
}

export default function MosaicChainBuilder({ 
  onMetaTitleChange, 
  onParentPostChange,
  metaTitle,
  parentPost,
  disabled = false
}: MosaicChainBuilderProps) {
  const [showPostSelector, setShowPostSelector] = useState(false);

  const handlePostSelect = (post: Work | null) => {
    onParentPostChange(post);
    setShowPostSelector(false);
    
    // If selecting an existing post with a meta-title, use that meta-title
    if (post && post.mosaicMetaTitle) {
      onMetaTitleChange(post.mosaicMetaTitle);
    } else if (post === null) {
      // If creating new chain, clear meta-title so user must enter it
      onMetaTitleChange('');
    }
  };

  const getPostSelectionText = () => {
    if (parentPost) {
      return `${parentPost.title} (${parentPost.classification})`;
    }
    return 'Choose from your previous posts or start new chain...';
  };

  const isNewChain = parentPost === null;
  const hasExistingMetaTitle = parentPost && parentPost.mosaicMetaTitle;

  return (
    <div className="space-y-3">
      {/* Meta-title input - only show for new chains */}
      {isNewChain && (
        <div>
          <label htmlFor="mosaic-meta-title" className="block text-xs font-medium text-blue-700 mb-1">
            Meta-title for this mosaic chain *
          </label>
          <input
            id="mosaic-meta-title"
            type="text"
            value={metaTitle}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            disabled={disabled}
            className={`w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
            }`}
            placeholder="e.g., My Horror Series, Urban Tales, etc."
            required
          />
          <p className="mt-1 text-xs text-blue-600">
            This title will appear on all posts in the chain.
          </p>
        </div>
      )}

      {/* Show existing meta-title for attached chains */}
      {hasExistingMetaTitle && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">Using Existing Chain</h4>
              <p className="text-xs text-green-700 mt-1">
                This post will be added to the existing chain: <strong>&quot;{parentPost.mosaicMetaTitle}&quot;</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Post selection */}
      <div>
        <label className="block text-xs font-medium text-blue-700 mb-2">
          Chain relationship
        </label>
        <button
          type="button"
          onClick={() => setShowPostSelector(!showPostSelector)}
          disabled={disabled}
          className={`w-full px-3 py-2 text-sm text-left border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            disabled 
              ? 'bg-gray-100 cursor-not-allowed text-gray-400' 
              : 'bg-white hover:bg-blue-50'
          }`}
        >
          <span className={parentPost ? 'text-gray-900' : 'text-gray-500'}>
            {getPostSelectionText()}
          </span>
        </button>
        <p className="mt-1 text-xs text-blue-600">
          {parentPost 
            ? 'This post will be linked to the selected parent post.'
            : 'Select a parent post to continue an existing chain, or start a new chain.'
          }
        </p>
      </div>

      {/* Post selector modal */}
      {showPostSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <PostSelector
              onPostSelect={handlePostSelect}
              selectedPost={parentPost}
              onClose={() => setShowPostSelector(false)}
              mode="mosaic"
            />
          </div>
        </div>
      )}

      {/* Chain info display (only if parentPost and no existing meta-title) */}
      {parentPost && !hasExistingMetaTitle && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Chain Connection</h4>
              <p className="text-xs text-blue-700 mt-1">
                This post will be added to the chain starting with &quot;{parentPost.title}&quot;.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
