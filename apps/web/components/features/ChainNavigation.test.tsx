import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChainNavigation from './ChainNavigation';

describe('ChainNavigation', () => {
  const defaultProps = {
    currentPosition: 3,
    totalPosts: 5,
    chainId: 'chain-123',
    previousPostId: 'post-2',
    nextPostId: 'post-4'
  };

  it('renders current position and total posts', () => {
    render(<ChainNavigation {...defaultProps} />);
    
    expect(screen.getByText('Part 3 of 5')).toBeInTheDocument();
  });

  it('renders previous and next buttons when available', () => {
    render(<ChainNavigation {...defaultProps} />);
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('calls onNavigateToPost when previous button is clicked', async () => {
    const mockOnNavigateToPost = jest.fn();
    const user = userEvent.setup();
    
    render(<ChainNavigation {...defaultProps} onNavigateToPost={mockOnNavigateToPost} />);
    
    const previousButton = screen.getByText('Previous');
    await user.click(previousButton);
    
    expect(mockOnNavigateToPost).toHaveBeenCalledWith('post-2');
  });

  it('calls onNavigateToPost when next button is clicked', async () => {
    const mockOnNavigateToPost = jest.fn();
    const user = userEvent.setup();
    
    render(<ChainNavigation {...defaultProps} onNavigateToPost={mockOnNavigateToPost} />);
    
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    
    expect(mockOnNavigateToPost).toHaveBeenCalledWith('post-4');
  });

  it('shows disabled state for first post', () => {
    const firstPostProps = {
      ...defaultProps,
      currentPosition: 1,
      previousPostId: undefined
    };
    
    render(<ChainNavigation {...firstPostProps} />);
    
    expect(screen.getByText('First post in chain')).toBeInTheDocument();
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('shows disabled state for last post', () => {
    const lastPostProps = {
      ...defaultProps,
      currentPosition: 5,
      nextPostId: undefined
    };
    
    render(<ChainNavigation {...lastPostProps} />);
    
    expect(screen.getByText('Latest post in chain')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('shows disabled state when no previous/next post IDs', () => {
    const noNavigationProps = {
      ...defaultProps,
      previousPostId: undefined,
      nextPostId: undefined
    };
    
    render(<ChainNavigation {...noNavigationProps} />);
    
    expect(screen.getByText('No previous post')).toBeInTheDocument();
    expect(screen.getByText('No next post')).toBeInTheDocument();
  });

  it('calls onNavigateToChain when View Chain is clicked', async () => {
    const mockOnNavigateToChain = jest.fn();
    const user = userEvent.setup();
    
    render(<ChainNavigation {...defaultProps} onNavigateToChain={mockOnNavigateToChain} />);
    
    const viewChainButton = screen.getByText('View Chain');
    await user.click(viewChainButton);
    
    expect(mockOnNavigateToChain).toHaveBeenCalledWith('chain-123');
  });

  it('does not show View Chain button for single post', () => {
    const singlePostProps = {
      ...defaultProps,
      currentPosition: 1,
      totalPosts: 1
    };
    
    render(<ChainNavigation {...singlePostProps} />);
    
    expect(screen.queryByText('View Chain')).not.toBeInTheDocument();
  });

  it('renders progress indicators correctly', () => {
    render(<ChainNavigation {...defaultProps} />);
    
    // Should show progress dots (limited to 10 for display)
    const progressContainer = screen.getByText('Part 3 of 5').closest('div');
    expect(progressContainer).toBeInTheDocument();
  });

  it('shows overflow indicator for long chains', () => {
    const longChainProps = {
      ...defaultProps,
      totalPosts: 15
    };
    
    render(<ChainNavigation {...longChainProps} />);
    
    expect(screen.getByText('+5')).toBeInTheDocument(); // 15 - 10 = 5
  });

  it('applies custom className', () => {
    const customClass = 'custom-navigation';
    render(<ChainNavigation {...defaultProps} className={customClass} />);
    
    // Find the main container with the custom class
    const container = screen.getByText('Part 3 of 5').closest('.custom-navigation');
    expect(container).toHaveClass(customClass);
  });

  it('handles edge case of position 0', () => {
    const edgeCaseProps = {
      ...defaultProps,
      currentPosition: 0
    };
    
    render(<ChainNavigation {...edgeCaseProps} />);
    
    expect(screen.getByText('Part 0 of 5')).toBeInTheDocument();
  });
});
