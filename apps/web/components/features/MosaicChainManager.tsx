'use client';

import React, { useState, useEffect } from 'react';
import { firebaseDataService, MosaicChain } from '../../lib/firebase/dataService';
import { useAuth } from '../../stores/userSessionStore';
import { Button } from '../ui/design-system';

interface MosaicChainManagerProps {
  onEditChain?: (chain: MosaicChain) => void;
  onViewChain?: (chainId: string) => void;
  className?: string;
}

export default function MosaicChainManager({ 
  onEditChain, 
  onViewChain,
  className = '' 
}: MosaicChainManagerProps) {
  const { user } = useAuth();
  const [chains, setChains] = useState<MosaicChain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingChain, setEditingChain] = useState<MosaicChain | null>(null);
  const [editMetaTitle, setEditMetaTitle] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadChains();
    }
  }, [user]);

  const loadChains = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const userChains = await firebaseDataService.getMosaicChainsByCreator(user.id);
      setChains(userChains);
    } catch (err) {
      console.error('Error loading chains:', err);
      setError('Failed to load chains. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMetaTitle = (chain: MosaicChain) => {
    setEditingChain(chain);
    setEditMetaTitle(chain.metaTitle);
  };

  const handleSaveMetaTitle = async () => {
    if (!editingChain || !editMetaTitle.trim()) return;
    
    try {
      await firebaseDataService.updateMosaicChainMetaTitle(editingChain.id, editMetaTitle.trim());
      await loadChains(); // Reload to get updated data
      setEditingChain(null);
      setEditMetaTitle('');
    } catch (err) {
      console.error('Error updating meta-title:', err);
      setError('Failed to update meta-title. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingChain(null);
    setEditMetaTitle('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading chains...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={loadChains}
                className="mt-1 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Mosaic Chains</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your connected post series
          </p>
        </div>
        <Button
          onClick={loadChains}
          variant="secondary"
          className="text-sm"
        >
          Refresh
        </Button>
      </div>

      {chains.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mosaic chains yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first mosaic chain by connecting posts when submitting new work.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {chains.map((chain) => (
            <div
              key={chain.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingChain?.id === chain.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editMetaTitle}
                        onChange={(e) => setEditMetaTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter meta-title..."
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleSaveMetaTitle}
                          size="sm"
                          disabled={!editMetaTitle.trim()}
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="secondary"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {chain.metaTitle}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{chain.postCount} posts</span>
                        <span>Created {formatDate(chain.createdAt)}</span>
                        <span>Updated {formatDate(chain.updatedAt)}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {editingChain?.id !== chain.id && (
                  <div className="flex space-x-2 ml-4">
                    <Button
                      onClick={() => handleEditMetaTitle(chain)}
                      variant="secondary"
                      size="sm"
                    >
                      Edit Title
                    </Button>
                    {onViewChain && (
                      <Button
                        onClick={() => onViewChain(chain.id)}
                        size="sm"
                      >
                        View Chain
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
