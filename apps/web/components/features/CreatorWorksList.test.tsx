import React from 'react';
import { render, screen } from '@testing-library/react';
import CreatorWorksList from './CreatorWorksList';
import { Work } from '../../lib/services/workService';

const mockWorks: Work[] = [
  {
    id: 'work-1',
    title: 'The Great Adventure',
    body: 'A thrilling story about adventure...',
    classification: 'Synopsis',
    tags: ['adventure', 'thriller'],
    creatorId: 'creator-1',
    createdAt: '2025-01-21T12:00:00.000Z',
    updatedAt: '2025-01-21T12:00:00.000Z',
    creator: {
      id: 'creator-1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
  {
    id: 'work-2',
    title: 'Dramatic Scene',
    body: 'An emotional scene description...',
    classification: 'Scene Description',
    tags: ['drama', 'emotion'],
    creatorId: 'creator-1',
    createdAt: '2025-01-20T12:00:00.000Z',
    updatedAt: '2025-01-20T12:00:00.000Z',
    creator: {
      id: 'creator-1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
  {
    id: 'work-3',
    title: 'Other Work',
    body: 'Some other creative work...',
    classification: 'Other',
    tags: [],
    creatorId: 'creator-1',
    createdAt: '2025-01-19T12:00:00.000Z',
    updatedAt: '2025-01-19T12:00:00.000Z',
    creator: {
      id: 'creator-1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
];

describe('CreatorWorksList', () => {
  it('renders loading state correctly', () => {
    render(<CreatorWorksList creatorId="creator-1" isLoading={true} />);
    
    expect(screen.getByText('Works')).toBeInTheDocument();
    
    // Check for loading animation elements
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to load works';
    render(
      <CreatorWorksList 
        creatorId="creator-1" 
        error={errorMessage}
      />
    );
    
    expect(screen.getByText('Works')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    
    // Check for error icon SVG
    const errorIcon = document.querySelector('svg.text-red-400');
    expect(errorIcon).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    render(<CreatorWorksList creatorId="creator-1" works={[]} />);
    
    expect(screen.getByText('Works')).toBeInTheDocument();
    expect(screen.getByText('No works yet')).toBeInTheDocument();
    expect(screen.getByText("This creator hasn't submitted any works yet.")).toBeInTheDocument();
  });

  it('renders works list correctly', () => {
    render(<CreatorWorksList creatorId="creator-1" works={mockWorks} />);
    
    expect(screen.getByText('Works (3)')).toBeInTheDocument();
    
    // Check first work
    expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
    expect(screen.getByText('Synopsis')).toBeInTheDocument();
    expect(screen.getByText('#adventure')).toBeInTheDocument();
    expect(screen.getByText('#thriller')).toBeInTheDocument();
    
    // Check second work
    expect(screen.getByText('Dramatic Scene')).toBeInTheDocument();
    expect(screen.getByText('Scene Description')).toBeInTheDocument();
    expect(screen.getByText('#drama')).toBeInTheDocument();
    expect(screen.getByText('#emotion')).toBeInTheDocument();
    
    // Check third work
    expect(screen.getByText('Other Work')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('displays formatted dates correctly', () => {
    render(<CreatorWorksList creatorId="creator-1" works={[mockWorks[0]]} />);
    
    // Check that date is formatted (should show "Jan 21, 2025" format)
    expect(screen.getByText(/Jan 21, 2025|January 21, 2025/)).toBeInTheDocument();
  });

  it('handles works without tags correctly', () => {
    const workWithoutTags = [{
      ...mockWorks[0],
      tags: []
    }];
    
    render(<CreatorWorksList creatorId="creator-1" works={workWithoutTags} />);
    
    expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
    expect(screen.queryByText('#adventure')).not.toBeInTheDocument();
    expect(screen.queryByText('#thriller')).not.toBeInTheDocument();
  });

  it('displays works in the order provided (most recent first)', () => {
    render(<CreatorWorksList creatorId="creator-1" works={mockWorks} />);
    
    const workTitles = screen.getAllByRole('heading', { level: 3 });
    // Filter to only get the work title headings (not the main "Works (3)" heading)
    const workTitleHeadings = workTitles.filter(heading => 
      heading.textContent !== 'Works (3)' && heading.textContent !== 'Works'
    );
    expect(workTitleHeadings[0]).toHaveTextContent('The Great Adventure'); // Most recent
    expect(workTitleHeadings[1]).toHaveTextContent('Dramatic Scene');
    expect(workTitleHeadings[2]).toHaveTextContent('Other Work'); // Oldest
  });

  it('applies correct CSS classes for styling', () => {
    render(<CreatorWorksList creatorId="creator-1" works={[mockWorks[0]]} />);
    
    // Find the work card container - it should have one of the card-* color classes
    const workCard = screen.getByText('The Great Adventure').closest('div');
    expect(workCard).toHaveClass('rounded-lg', 'shadow-sm', 'p-8');
    
    // Check that the classification is displayed
    const classificationText = screen.getByText('Synopsis');
    expect(classificationText).toBeInTheDocument();
    
    // Check that tags are displayed with hashtags
    const tagBadge = screen.getByText('#adventure');
    expect(tagBadge).toBeInTheDocument();
  });

  it('handles undefined works prop correctly', () => {
    render(<CreatorWorksList creatorId="creator-1" />);
    
    expect(screen.getByText('Works')).toBeInTheDocument();
    expect(screen.getByText('No works yet')).toBeInTheDocument();
  });
});
