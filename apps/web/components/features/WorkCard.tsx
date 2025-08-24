import React from 'react';
import { Work } from '../../lib/services/workService';

interface WorkCardProps {
  work: Work;
}

const WorkCard: React.FC<WorkCardProps> = ({ work }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Generate pastel color based on work content for consistent but varied appearance
  const getCardColor = (work: Work) => {
    const colors = [
      'card-orange', // Light orange/cream
      'card-red',    // Light pink/red
      'card-green',  // Light green
      'card-pink',   // Light pink
      'card-blue',   // Light blue
    ];
    
    // Use work ID or title to consistently assign colors
    const hash = work.id.charCodeAt(0) + work.title.charCodeAt(0);
    return colors[hash % colors.length];
  };

  const cardColor = getCardColor(work);
  const borderColor = cardColor.replace('card-', 'border-') + '-300';

  return (
    <div className={`${cardColor} p-8 border-l-4 ${borderColor} rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group`}>
      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-200">
        {work.title}
      </h3>

      {/* Body Content - No truncation, let content determine height */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {work.body}
      </p>

      {/* Creator */}
      <p className="text-sm text-gray-500 mb-4">
        by {work.creator?.name || 'Anonymous Creator'}
      </p>

      {/* Tags with color-coordinated styling */}
      {work.tags && work.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {work.tags.slice(0, 4).map((tag, index) => {
            const tagColor = cardColor.replace('card-', 'bg-') + '-100';
            const textColor = cardColor.replace('card-', 'text-') + '-800';
            
            return (
              <span
                key={index}
                className={`text-xs ${tagColor} ${textColor} px-3 py-1 rounded-full font-medium`}
              >
                #{tag}
              </span>
            );
          })}
          {work.tags.length > 4 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              +{work.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Classification and Date - Subtle footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-gray-200">
        <span className="font-medium">{work.classification}</span>
        <span>{formatDate(work.createdAt)}</span>
      </div>
    </div>
  );
};

export default WorkCard;
