import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MosaicChainHeader from './MosaicChainHeader';

describe('MosaicChainHeader', () => {
  const defaultProps = {
    metaTitle: 'My Horror Series',
    currentPosition: 2,
    totalPosts: 5,
    chainId: 'chain-123'
  };

  it('renders meta-title and position information', () => {
    render(<MosaicChainHeader {...defaultProps} />);
    
    expect(screen.getByText('My Horror Series')).toBeInTheDocument();
    expect(screen.getByText('Part 2 of 5')).toBeInTheDocument();
    expect(screen.getByText('Mosaic Chain')).toBeInTheDocument();
  });

  it('renders progress indicators', () => {
    render(<MosaicChainHeader {...defaultProps} />);
    
    // Should have 5 progress dots (totalPosts)
    const progressDots = screen.getAllByTitle(/Part \d+/);
    expect(progressDots).toHaveLength(5);
  });

  it('highlights current position in progress indicators', () => {
    render(<MosaicChainHeader {...defaultProps} />);
    
    // The current position (2) should be highlighted with blue-400 and ring
    // Note: index 1 (Part 2) gets the current position styling
    const currentDot = screen.getByTitle('Part 2');
    expect(currentDot).toHaveClass('bg-blue-400', 'ring-2', 'ring-blue-200');
  });

  it('shows completed positions in progress indicators', () => {
    render(<MosaicChainHeader {...defaultProps} />);
    
    // Position 1 should be completed (blue-600)
    const completedDot = screen.getByTitle('Part 1');
    expect(completedDot).toHaveClass('bg-blue-600');
  });

  it('shows future positions in progress indicators', () => {
    render(<MosaicChainHeader {...defaultProps} />);
    
    // Positions 3, 4, 5 should be future (gray-300)
    const futureDots = [screen.getByTitle('Part 3'), screen.getByTitle('Part 4'), screen.getByTitle('Part 5')];
    futureDots.forEach(dot => {
      expect(dot).toHaveClass('bg-gray-300');
    });
  });

  it('calls onNavigateToChain when chain link is clicked', async () => {
    const mockOnNavigateToChain = jest.fn();
    const user = userEvent.setup();
    
    render(<MosaicChainHeader {...defaultProps} onNavigateToChain={mockOnNavigateToChain} />);
    
    const chainLink = screen.getByText('View all posts in this chain');
    await user.click(chainLink);
    
    expect(mockOnNavigateToChain).toHaveBeenCalledWith('chain-123');
  });

  it('does not show chain link when onNavigateToChain is not provided', () => {
    render(<MosaicChainHeader {...defaultProps} />);
    
    expect(screen.queryByText('View all posts in this chain')).not.toBeInTheDocument();
  });

  it('handles single post chain correctly', () => {
    const singlePostProps = {
      ...defaultProps,
      currentPosition: 1,
      totalPosts: 1
    };
    
    render(<MosaicChainHeader {...singlePostProps} />);
    
    expect(screen.getByText('Part 1 of 1')).toBeInTheDocument();
    
    // Should have only one progress dot
    const progressDots = screen.getAllByTitle(/Part \d+/);
    expect(progressDots).toHaveLength(1);
  });

  it('applies correct styling classes', () => {
    render(<MosaicChainHeader {...defaultProps} />);
    
    // Find the main container with the gradient background
    const container = screen.getByText('My Horror Series').closest('.bg-gradient-to-r');
    expect(container).toHaveClass('bg-gradient-to-r', 'from-blue-50', 'to-indigo-50');
  });
});
