'use client';

import React, { useState } from 'react';
import { Button } from '../ui/design-system';

interface ReferenceSelectorProps {
  onReferencesChange: (references: string[]) => void;
  references: string[];
  disabled?: boolean;
}

// Placeholder component for reference selection
// Full implementation will be completed in Story 2.7
export default function ReferenceSelector({ 
  onReferencesChange, 
  references,
  disabled = false
}: ReferenceSelectorProps) {
  const [showSearchModal, setShowSearchModal] = useState(false);

  const maxReferences = 5;
  const remainingSlots = maxReferences - references.length;

  return (
    <div className="space-y-3">
      {/* Current references display */}
      {references.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-green-700 mb-2">
            Selected references ({references.length}/{maxReferences})
          </label>
          <div className="space-y-1">
            {references.map((ref, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-green-100 rounded border border-green-200"
              >
                <span className="text-sm text-green-800">{ref}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newRefs = references.filter((_, i) => i !== index);
                    onReferencesChange(newRefs);
                  }}
                  disabled={disabled}
                  className={`text-xs ${
                    disabled 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-green-600 hover:text-green-800'
                  }`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add reference button */}
      {remainingSlots > 0 && (
        <div>
          <label className="block text-xs font-medium text-green-700 mb-2">
            Add references to other creators&apos; posts
          </label>
          <button
            type="button"
            onClick={() => setShowSearchModal(!showSearchModal)}
            disabled={disabled}
            className={`w-full px-3 py-2 text-sm text-left border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
              disabled 
                ? 'bg-gray-100 cursor-not-allowed text-gray-400' 
                : 'bg-white hover:bg-green-50'
            }`}
          >
            <span className="text-gray-500">
              🔍 Search posts to reference... ({remainingSlots} slots remaining)
            </span>
          </button>
        </div>
      )}

      {/* Max references reached */}
      {remainingSlots === 0 && (
        <div className="p-2 bg-yellow-100 rounded border border-yellow-200">
          <p className="text-xs text-yellow-700">
            ⚠️ Maximum references reached (5/5). Remove a reference to add another.
          </p>
        </div>
      )}

      {/* Placeholder message */}
      <div className="p-3 bg-green-100 rounded-lg border border-green-200">
        <p className="text-xs text-green-700">
          📝 <strong>Story 2.5 Scope:</strong> This interface provides reference management and search trigger.
          Full post search and selection functionality will be implemented in Story 2.7.
        </p>
      </div>
    </div>
  );
}
