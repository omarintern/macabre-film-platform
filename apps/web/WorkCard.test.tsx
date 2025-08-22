import React from 'react';
import { render, screen } from '@testing-library/react';
import WorkCard from './WorkCard';

describe('WorkCard', () => {
  const mockWork = {
    id: 'work_1',
    title: 'Test Work Title',
    body: 'This is a test work body that should be truncated if it is too long. This text should be long enough to test the truncation functionality.',
    classification: 'Synopsis',
    tags: ['drama', 'thriller', 'action'],
    creatorId: 'user_123',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    creator: {
      id: 'user_123',
      name: 'Test Creator',
      email: 'creator@example.com',
    },
  };

  it('renders work title correctly', () => {
    render(<WorkCard work={mockWork} />);
    expect(screen.getByText('Test Work Title')).toBeInTheDocument();
  });

  it('renders classification badge correctly', () => {
    render(<WorkCard work={mockWork} />);
    expect(screen.getByText('Synopsis')).toBeInTheDocument();
  });

  it('renders work body preview correctly', () => {
    render(<WorkCard work={mockWork} />);
    expect(screen.getByText(/This is a test work body/)).toBeInTheDocument();
  });

  it('renders tags correctly', () => {
    render(<WorkCard work={mockWork} />);
    expect(screen.getByText('#drama')).toBeInTheDocument();
    expect(screen.getByText('#thriller')).toBeInTheDocument();
    expect(screen.getByText('#action')).toBeInTheDocument();
  });

  it('renders creator name correctly', () => {
    render(<WorkCard work={mockWork} />);
    expect(screen.getByText('Test Creator')).toBeInTheDocument();
  });

  it('renders formatted date correctly', () => {
    render(<WorkCard work={mockWork} />);
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
  });

  it('renders view details link correctly', () => {
    render(<WorkCard work={mockWork} />);
    const link = screen.getByText('View Details');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/works/work_1');
  });

  it('shows anonymous creator when creator name is not available', () => {
    const workWithoutCreatorName = {
      ...mockWork,
      creator: {
        ...mockWork.creator,
        name: null,
      },
    };

    render(<WorkCard work={workWithoutCreatorName} />);
    expect(screen.getByText('Anonymous Creator')).toBeInTheDocument();
  });

  it('handles work without tags', () => {
    const workWithoutTags = {
      ...mockWork,
      tags: [],
    };

    render(<WorkCard work={workWithoutTags} />);
    expect(screen.queryByText(/#/)).not.toBeInTheDocument();
  });

  it('shows limited tags with more indicator when there are many tags', () => {
    const workWithManyTags = {
      ...mockWork,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    };

    render(<WorkCard work={workWithManyTags} />);
    expect(screen.getByText('#tag1')).toBeInTheDocument();
    expect(screen.getByText('#tag2')).toBeInTheDocument();
    expect(screen.getByText('#tag3')).toBeInTheDocument();
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    render(<WorkCard work={mockWork} />);
    
    const card = screen.getByText('Test Work Title').closest('.bg-white');
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'border-gray-200');
  });

  it('truncates long body text correctly', () => {
    const workWithLongBody = {
      ...mockWork,
      body: 'A'.repeat(200), // Very long body
    };

    render(<WorkCard work={workWithLongBody} />);
    const bodyElement = screen.getByText(/A{150}/);
    expect(bodyElement.textContent).toContain('...');
  });
});
