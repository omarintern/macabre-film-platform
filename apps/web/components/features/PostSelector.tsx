'use client';

import React, { useState, useEffect } from 'react';
import { Work } from '@/lib/services/workService';
import { MosaicChain } from '@/lib/firebase/dataService';
import { firebaseDataService } from '@/lib/firebase/dataService';
import { useAuth } from '@/stores/userSessionStore';
import { Button } from '../ui/design-system';

interface PostSelectorProps {
  onPostSelect?: (work: Work | null) => void;  // For MosaicChainBuilder
  onSelect?: (work: Work | null) => void;      // For other uses
  selectedPost?: Work | null;                  // For MosaicChainBuilder
  selectedWork?: Work | null;                  // For other uses
  onClose?: () => void;                        // For modal usage
  mode?: 'mosaic' | 'reference';              // For different modes
}

interface MosaicChainOption {
  chain: MosaicChain;
  firstPost: Work;
}

export default function PostSelector({ 
  onPostSelect, 
  onSelect, 
  selectedPost, 
  selectedWork, 
  onClose,
  mode = 'mosaic'
}: PostSelectorProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Work[]>([]);
  const [mosaicChains, setMosaicChains] = useState<MosaicChainOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'chains'>('posts');

  // Use the appropriate callback and selected work
  const handleSelect = onPostSelect || onSelect;
  const currentSelection = selectedPost || selectedWork;

  useEffect(() => {
    const loadPosts = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Load individual posts and mosaic chains in parallel
        const [postsData, chainsData] = await Promise.all([
          firebaseDataService.getWorksByCreator(user.id),
          firebaseDataService.getMosaicChainsByCreator(user.id)
        ]);
        
        setPosts(postsData.works);
        
        // Get the first post of each chain
        const chainOptions: MosaicChainOption[] = [];
        for (const chain of chainsData) {
          try {
            const chainWorks = await firebaseDataService.getWorksInChain(chain.id);
            
            if (chainWorks.length > 0) {
              chainOptions.push({
                chain,
                firstPost: chainWorks[0]
              });
            }
          } catch (error) {
            console.error(`Error loading works for chain ${chain.id}:`, error);
          }
        }
        
        setMosaicChains(chainOptions);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [user]);

  const handlePostSelect = (work: Work) => {
    if (handleSelect) {
      handleSelect(work);
    }
  };

  const handleChainSelect = (chainOption: MosaicChainOption) => {
    // Select the first post of the chain as the parent
    if (handleSelect) {
      handleSelect(chainOption.firstPost);
    }
  };

  const handleNewChain = () => {
    if (handleSelect) {
      handleSelect(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          {mode === 'mosaic' ? 'Select Mosaic Chain' : 'Select Reference'}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="px-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'posts'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Individual Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('chains')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'chains'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mosaic Chains ({mosaicChains.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {activeTab === 'posts' ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <div className="p-3 border border-gray-200 rounded-lg">
              <button
                onClick={handleNewChain}
                className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                  currentSelection === null
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">Create New Chain</div>
                <div className="text-sm text-gray-600">Start a new mosaic chain</div>
              </button>
            </div>
            
            {posts.map((post) => (
              <div key={post.id} className="p-3 border border-gray-200 rounded-lg">
                <button
                  onClick={() => handlePostSelect(post)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    currentSelection?.id === post.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{post.title}</div>
                  <div className="text-sm text-gray-600">{post.classification}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {post.tags?.slice(0, 3).map(tag => `#${tag}`).join(' ')}
                  </div>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {mosaicChains.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No mosaic chains found.</p>
                <p className="text-sm">Create your first chain by selecting &quot;Individual Posts&quot; tab.</p>
              </div>
            ) : (
              mosaicChains.map((chainOption) => (
                <div key={chainOption.chain.id} className="p-3 border border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleChainSelect(chainOption)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      currentSelection?.id === chainOption.firstPost.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{chainOption.chain.metaTitle}</div>
                    <div className="text-sm text-gray-600">
                      {chainOption.chain.postCount} posts in chain
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      First post: {chainOption.firstPost.title}
                    </div>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}