'use client';

import React from 'react';
import Link from 'next/link';
import { Tag } from '../../lib/services/workService';

interface TagCardProps {
  tag: Tag;
}

const TagCard: React.FC<TagCardProps> = ({ tag }) => {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag.name)}`}
      className="tag-link"
    >
      {tag.name} <span className="text-gray-500 text-sm">{tag.count}</span>
    </Link>
  );
};

export default TagCard;
