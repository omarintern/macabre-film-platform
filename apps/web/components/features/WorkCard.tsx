'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Work } from '@/lib/services/workService';
import { firebaseDataService } from '@/lib/firebase/dataService';

interface WorkCardProps {
  work: Work;
}

export default function WorkCard({ work }: WorkCardProps) {
  const [chainWorks, setChainWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChainWorks = async () => {
      if (work.mosaicId) {
        try {
          const works = await firebaseDataService.getWorksInChain(work.mosaicId);
          setChainWorks(works);
        } catch (error) {
          console.error('Error fetching chain works:', error);
        }
      }
      setLoading(false);
    };

    fetchChainWorks();
  }, [work.mosaicId]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {work.title}
      </h3>

      {/* Classification Badge */}
      {work.classification && (
        <div className="mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {work.classification}
          </span>
        </div>
      )}

      {/* Body Content */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">{work.body}</p>
        <p className="text-sm text-gray-500">
          by {work.creator?.name || 'Anonymous Creator'}
        </p>
      </div>

      {/* Footer with Tags and Mosaic Chain */}
      <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
        {/* Row 1: Mosaic Chain */}
        {work.mosaicId && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">{work.mosaicMetaTitle || 'Mosaic Chain'}</span>
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center space-x-2 flex-wrap">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              ) : chainWorks.length > 0 ? (
                chainWorks.map((chainWork, index) => (
                  <Link 
                    key={chainWork.id}
                    href={`/works/${chainWork.id}`} 
                    className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                  >
                    {chainWork.title}
                    {index < chainWorks.length - 1 && <span className="text-gray-400 mx-1">•</span>}
                  </Link>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No chain works found</span>
              )}
            </div>
          </div>
        )}
        
        {/* Row 2: Tags */}
        {work.tags && work.tags.length > 0 && (
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>
              {work.tags.slice(0, 3).map(tag => `#${tag}`).join(', ')}
              {work.tags.length > 3 && ` +${work.tags.length - 3} more`}
            </span>
          </div>
        )}
        
        {/* Row 3: Date */}
        <div className="text-sm text-gray-500">
          {new Date(work.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
}
