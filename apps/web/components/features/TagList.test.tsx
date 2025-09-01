import React from 'react';
import { render, screen } from '@testing-library/react';
import TagList from './TagList';
import { useTags } from '../../hooks/useTags';

// Mock the useTags hook
jest.mock('../../hooks/useTags');
const mockedUseTags = useTags as jest.MockedFunction<typeof useTags>;

describe('TagList', () => {
  const mockTags = [
    { name: 'action', count: 3 },
    { name: 'drama', count: 2 },
    { name: 'thriller', count: 1 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    mockedUseTags.mockReturnValue({
      tags: [],
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<TagList />);
    
    // Check for loading skeleton elements
    const skeletonElements = screen.getAllByTestId('skeleton');
    expect(skeletonElements).toHaveLength(8); // 8 skeleton cards
  });

  it('should render error state', () => {
    const errorMessage = 'Failed to fetch tags';
    mockedUseTags.mockReturnValue({
      tags: [],
      isLoading: false,
      error: errorMessage,
      refetch: jest.fn(),
    });

    render(<TagList />);
    
    expect(screen.getByText('Error loading tags')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render empty state when no tags', () => {
    mockedUseTags.mockReturnValue({
      tags: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<TagList />);
    
    expect(screen.getByText('No tags yet')).toBeInTheDocument();
    expect(screen.getByText('Tags will appear here once works are submitted with tags.')).toBeInTheDocument();
  });

  it('should render tags list when tags exist', () => {
    mockedUseTags.mockReturnValue({
      tags: mockTags,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<TagList />);
    
    // Check that all tags are rendered
    expect(screen.getByText('#action')).toBeInTheDocument();
    expect(screen.getByText('#drama')).toBeInTheDocument();
    expect(screen.getByText('#thriller')).toBeInTheDocument();
    
    // Check for count badges
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Check for work count text
    expect(screen.getByText('3 works')).toBeInTheDocument();
    expect(screen.getByText('2 works')).toBeInTheDocument();
    expect(screen.getByText('1 work')).toBeInTheDocument();
    
    // Check for results info
    expect(screen.getByText('Showing 3 tags')).toBeInTheDocument();
  });

  it('should render correct singular form for single work', () => {
    const singleWorkTag = [{ name: 'test', count: 1 }];
    mockedUseTags.mockReturnValue({
      tags: singleWorkTag,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<TagList />);
    
    expect(screen.getByText('1 work')).toBeInTheDocument();
  });
});

