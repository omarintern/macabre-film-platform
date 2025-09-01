import React from 'react';
import { render, screen } from '@testing-library/react';
import TagWorksGallery from './TagWorksGallery';
import { useTagWorksGallery } from '../../hooks/useTagWorksGallery';

// Mock the useTagWorksGallery hook
jest.mock('../../hooks/useTagWorksGallery');
const mockedUseTagWorksGallery = useTagWorksGallery as jest.MockedFunction<typeof useTagWorksGallery>;

// Mock the WorkCard component
jest.mock('./WorkCard', () => {
  return function MockWorkCard({ work }: { work: any }) {
    return <div data-testid="work-card">{work.title}</div>;
  };
});

// Mock the Pagination component
jest.mock('../ui/Pagination', () => {
  return function MockPagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
    return <div data-testid="pagination">Page {currentPage} of {totalPages}</div>;
  };
});

describe('TagWorksGallery', () => {
  const mockWorks = [
    {
      id: 'work-1',
      title: 'Test Work 1',
      body: 'Test body 1',
      classification: 'Synopsis',
      tags: ['action', 'drama'],
      creatorId: 'creator-1',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      creator: {
        id: 'creator-1',
        name: 'Test Creator',
        email: 'creator@test.com',
      },
    },
    {
      id: 'work-2',
      title: 'Test Work 2',
      body: 'Test body 2',
      classification: 'Scene Description',
      tags: ['action', 'thriller'],
      creatorId: 'creator-2',
      createdAt: '2025-01-02T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
      creator: {
        id: 'creator-2',
        name: 'Test Creator 2',
        email: 'creator2@test.com',
      },
    },
  ];

  const mockPagination = {
    page: 1,
    limit: 12,
    total: 2,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    mockedUseTagWorksGallery.mockReturnValue({
      works: [],
      pagination: null,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<TagWorksGallery tagName="action" />);
    
    // Check for loading skeleton elements
    const skeletonElements = screen.getAllByTestId('skeleton');
    expect(skeletonElements).toHaveLength(6); // 6 skeleton cards
  });

  it('should render error state', () => {
    const errorMessage = 'Failed to fetch works';
    mockedUseTagWorksGallery.mockReturnValue({
      works: [],
      pagination: null,
      isLoading: false,
      error: errorMessage,
      refetch: jest.fn(),
    });

    render(<TagWorksGallery tagName="action" />);
    
    expect(screen.getByText('Error loading works')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render empty state when no works found', () => {
    mockedUseTagWorksGallery.mockReturnValue({
      works: [],
      pagination: null,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<TagWorksGallery tagName="nonexistent" />);
    
    expect(screen.getByText('No works found')).toBeInTheDocument();
    expect(screen.getByText('No works have been tagged with "#nonexistent" yet.')).toBeInTheDocument();
    expect(screen.getByText('Browse all tags')).toBeInTheDocument();
  });

  it('should render works list when works exist', () => {
    mockedUseTagWorksGallery.mockReturnValue({
      works: mockWorks,
      pagination: mockPagination,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<TagWorksGallery tagName="action" />);
    
    // Check that all works are rendered
    expect(screen.getByText('Test Work 1')).toBeInTheDocument();
    expect(screen.getByText('Test Work 2')).toBeInTheDocument();
    
    // Check for results info
    expect(screen.getByText('Showing 2 of 2 works tagged "#action"')).toBeInTheDocument();
  });

  it('should render pagination when multiple pages exist', () => {
    const multiPagePagination = {
      ...mockPagination,
      total: 25,
      totalPages: 3,
      hasNext: true,
      hasPrev: false,
    };

    mockedUseTagWorksGallery.mockReturnValue({
      works: mockWorks,
      pagination: multiPagePagination,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<TagWorksGallery tagName="action" />);
    
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('should not render pagination when only one page exists', () => {
    mockedUseTagWorksGallery.mockReturnValue({
      works: mockWorks,
      pagination: mockPagination,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<TagWorksGallery tagName="action" />);
    
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('should handle special characters in tag names', () => {
    mockedUseTagWorksGallery.mockReturnValue({
      works: mockWorks,
      pagination: mockPagination,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<TagWorksGallery tagName="sci-fi" />);
    
    expect(screen.getByText('Showing 2 of 2 works tagged "#sci-fi"')).toBeInTheDocument();
  });

  it('should call useTagWorksGallery with correct parameters', () => {
    mockedUseTagWorksGallery.mockReturnValue({
      works: mockWorks,
      pagination: mockPagination,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<TagWorksGallery tagName="action" />);
    
    expect(mockedUseTagWorksGallery).toHaveBeenCalledWith('action', 1);
  });
});

