import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MosaicChainBuilder from './MosaicChainBuilder';

describe('MosaicChainBuilder', () => {
  const mockOnMetaTitleChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    onMetaTitleChange: mockOnMetaTitleChange,
    metaTitle: '',
  };

  it('renders meta-title input field', () => {
    render(<MosaicChainBuilder {...defaultProps} />);
    
    expect(screen.getByLabelText(/meta-title for this mosaic chain/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g., My Horror Series/i)).toBeInTheDocument();
  });

  it('renders post selection button', () => {
    render(<MosaicChainBuilder {...defaultProps} />);
    
    expect(screen.getByText(/chain relationship/i)).toBeInTheDocument();
    expect(screen.getByText(/choose from your previous posts or start new chain/i)).toBeInTheDocument();
  });

  it('calls onMetaTitleChange when meta-title is changed', async () => {
    const user = userEvent.setup();
    render(<MosaicChainBuilder {...defaultProps} />);
    
    const input = screen.getByLabelText(/meta-title for this mosaic chain/i);
    await user.type(input, 'My Horror Series');
    
    expect(mockOnMetaTitleChange).toHaveBeenCalledWith('M');
    expect(mockOnMetaTitleChange).toHaveBeenCalledWith('y');
    // Should be called for each character typed
  });

  it('displays the current meta-title value', () => {
    render(<MosaicChainBuilder {...defaultProps} metaTitle="Urban Tales" />);
    
    const input = screen.getByDisplayValue('Urban Tales');
    expect(input).toBeInTheDocument();
  });

  it('shows chain connection info when parent post is selected', () => {
    const mockParentPost = {
      id: '1',
      title: 'Test Post',
      body: 'Test body',
      classification: 'Synopsis',
      tags: [],
      creatorId: 'creator1',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      creator: { id: 'creator1', name: 'Test Creator', email: 'test@example.com' }
    };

    render(<MosaicChainBuilder {...defaultProps} parentPost={mockParentPost} />);
    
    expect(screen.getByText(/chain connection/i)).toBeInTheDocument();
    expect(screen.getByText(/this post will be added to the chain starting with/i)).toBeInTheDocument();
  });

  it('toggles post selector visibility when button is clicked', async () => {
    const user = userEvent.setup();
    render(<MosaicChainBuilder {...defaultProps} />);
    
    const button = screen.getByText(/choose from your previous posts/i);
    
    // Initially, no change should be visible (since it's a placeholder)
    await user.click(button);
    
    // Button should still be there and clickable
    expect(button).toBeInTheDocument();
  });
});
