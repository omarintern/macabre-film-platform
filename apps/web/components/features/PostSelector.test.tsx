import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostSelector from './PostSelector';
import { workService } from '../../lib/services/workService';
import { useAuth } from '../../stores/userSessionStore';

// Mock the services
jest.mock('../../lib/services/workService');
jest.mock('../../stores/userSessionStore');

const mockWorkService = workService as jest.Mocked<typeof workService>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('PostSelector', () => {
  const mockOnPostSelect = jest.fn();
  const mockOnClose = jest.fn();
  const mockUser = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'CREATOR' as const
  };

  const mockPosts = [
    {
      id: '1',
      title: 'Test Post 1',
      body: 'Test body 1',
      classification: 'Synopsis',
      tags: ['test'],
      creatorId: 'user1',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      creator: { id: 'user1', name: 'Test User', email: 'test@example.com' }
    },
    {
      id: '2',
      title: 'Test Post 2',
      body: 'Test body 2',
      classification: 'Scene Description',
      tags: ['drama'],
      creatorId: 'user1',
      createdAt: '2023-01-02',
      updatedAt: '2023-01-02',
      creator: { id: 'user1', name: 'Test User', email: 'test@example.com' }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: mockUser });
  });

  it('renders loading state initially', () => {
    mockWorkService.getWorksByCreator.mockResolvedValue({
      works: [],
      page: 1,
      limit: 100,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false
    });

    render(
      <PostSelector
        onPostSelect={mockOnPostSelect}
        selectedPost={null}
        onClose={mockOnClose}
        mode="mosaic"
      />
    );

    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });

  it('renders posts list for mosaic mode', async () => {
    mockWorkService.getWorksByCreator.mockResolvedValue({
      works: mockPosts,
      page: 1,
      limit: 100,
      total: 2,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    });

    render(
      <PostSelector
        onPostSelect={mockOnPostSelect}
        selectedPost={null}
        onClose={mockOnClose}
        mode="mosaic"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Select Parent Post')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    expect(screen.getByText('🆕 Start New Chain')).toBeInTheDocument();
  });

  it('renders posts list for reference mode', async () => {
    mockWorkService.getAllWorks.mockResolvedValue({
      works: mockPosts,
      page: 1,
      limit: 100,
      total: 2,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    });

    render(
      <PostSelector
        onPostSelect={mockOnPostSelect}
        selectedPost={null}
        onClose={mockOnClose}
        mode="reference"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Select Reference Post')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    expect(screen.queryByText('🆕 Start New Chain')).not.toBeInTheDocument();
  });

  it('filters posts by search term', async () => {
    mockWorkService.getWorksByCreator.mockResolvedValue({
      works: mockPosts,
      page: 1,
      limit: 100,
      total: 2,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    });

    const user = userEvent.setup();
    render(
      <PostSelector
        onPostSelect={mockOnPostSelect}
        selectedPost={null}
        onClose={mockOnClose}
        mode="mosaic"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search posts...');
    await user.type(searchInput, 'Post 1');

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Post 2')).not.toBeInTheDocument();
  });

  it('filters posts by classification', async () => {
    mockWorkService.getWorksByCreator.mockResolvedValue({
      works: mockPosts,
      page: 1,
      limit: 100,
      total: 2,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    });

    const user = userEvent.setup();
    render(
      <PostSelector
        onPostSelect={mockOnPostSelect}
        selectedPost={null}
        onClose={mockOnClose}
        mode="mosaic"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    const filterSelect = screen.getByDisplayValue('All Types');
    await user.selectOptions(filterSelect, 'Synopsis');

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Post 2')).not.toBeInTheDocument();
  });

  it('calls onPostSelect when post is clicked', async () => {
    mockWorkService.getWorksByCreator.mockResolvedValue({
      works: mockPosts,
      page: 1,
      limit: 100,
      total: 2,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    });

    const user = userEvent.setup();
    render(
      <PostSelector
        onPostSelect={mockOnPostSelect}
        selectedPost={null}
        onClose={mockOnClose}
        mode="mosaic"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    const postElement = screen.getByText('Test Post 1').closest('div');
    if (postElement) {
      await user.click(postElement);
    }

    expect(mockOnPostSelect).toHaveBeenCalledWith(mockPosts[0]);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onPostSelect with null when Start New Chain is clicked', async () => {
    mockWorkService.getWorksByCreator.mockResolvedValue({
      works: mockPosts,
      page: 1,
      limit: 100,
      total: 2,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    });

    const user = userEvent.setup();
    render(
      <PostSelector
        onPostSelect={mockOnPostSelect}
        selectedPost={null}
        onClose={mockOnClose}
        mode="mosaic"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('🆕 Start New Chain')).toBeInTheDocument();
    });

    const startNewChainButton = screen.getByText('🆕 Start New Chain');
    await user.click(startNewChainButton);

    expect(mockOnPostSelect).toHaveBeenCalledWith(null);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows error state when loading fails', async () => {
    mockWorkService.getWorksByCreator.mockRejectedValue(new Error('Failed to load'));

    render(
      <PostSelector
        onPostSelect={mockOnPostSelect}
        selectedPost={null}
        onClose={mockOnClose}
        mode="mosaic"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load posts. Please try again.')).toBeInTheDocument();
    });

    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('shows no posts message when no posts match filters', async () => {
    mockWorkService.getWorksByCreator.mockResolvedValue({
      works: mockPosts,
      page: 1,
      limit: 100,
      total: 2,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    });

    const user = userEvent.setup();
    render(
      <PostSelector
        onPostSelect={mockOnPostSelect}
        selectedPost={null}
        onClose={mockOnClose}
        mode="mosaic"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search posts...');
    await user.type(searchInput, 'nonexistent');

    expect(screen.getByText('No posts match your search criteria.')).toBeInTheDocument();
  });
});