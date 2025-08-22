'use client';

import React from 'react';
import Link from 'next/link';
import { Tag } from '../../lib/services/workService';
import { Card, CardContent } from '../ui/design-system';

interface TagCardProps {
  tag: Tag;
}

const TagCard: React.FC<TagCardProps> = ({ tag }) => {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag.name)}`}
      className="block group"
    >
      <Card className="hover:shadow-lg hover:border-border/60 transition-all duration-300 group-hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              #{tag.name}
            </h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {tag.count}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            {tag.count === 1 ? '1 work' : `${tag.count} works`}
          </div>

          <div className="pt-4 border-t border-border/50">
            <span className="text-xs text-primary group-hover:text-primary/80 transition-colors duration-200 font-medium">
              View works →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TagCard;
