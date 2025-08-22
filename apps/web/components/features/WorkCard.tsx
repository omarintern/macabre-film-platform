import React from 'react';
import { Work } from '../../lib/services/workService';
import Link from 'next/link';

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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="group bg-card rounded-lg border border-border hover:border-border/60 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {work.title}
        </h3>

        {/* Classification Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {work.classification}
          </span>
        </div>

        {/* Body Preview */}
        <p className="text-muted-foreground text-sm mb-5 line-clamp-3 leading-relaxed">
          {truncateText(work.body, 150)}
        </p>

        {/* Tags */}
        {work.tags && work.tags.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {work.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border/50"
              >
                #{tag}
              </span>
            ))}
            {work.tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted/50 text-muted-foreground/70">
                +{work.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Creator and Date */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <span className="font-medium text-foreground">
              {work.creator?.name || 'Anonymous Creator'}
            </span>
          </div>
          <span className="font-medium">{formatDate(work.createdAt)}</span>
        </div>

        {/* View Details Link */}
        <div className="pt-4 border-t border-border/50">
          <Link
            href={`/works/${work.id}`}
            className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center group/link transition-colors duration-200"
          >
            View Details
            <svg
              className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkCard;
