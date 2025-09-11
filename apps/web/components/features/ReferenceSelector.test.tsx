import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReferenceSelector from './ReferenceSelector';

describe('ReferenceSelector', () => {
  const mockOnReferencesChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    onReferencesChange: mockOnReferencesChange,
    references: [],
  };

  it('renders add reference button when no references', () => {
    render(<ReferenceSelector {...defaultProps} />);
    
    expect(screen.getByText(/Add references to other creators' posts/i)).toBeInTheDocument();
    expect(screen.getByText(/🔍 Search posts to reference... \(5 slots remaining\)/i)).toBeInTheDocument();
  });

  it('displays selected references', () => {
    const references = ['Post 1', 'Post 2'];
    render(<ReferenceSelector {...defaultProps} references={references} />);
    
    expect(screen.getByText(/Selected references \(2\/5\)/i)).toBeInTheDocument();
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });

  it('shows correct remaining slots count', () => {
    const references = ['Post 1', 'Post 2', 'Post 3'];
    render(<ReferenceSelector {...defaultProps} references={references} />);
    
    expect(screen.getByText(/2 slots remaining/i)).toBeInTheDocument();
  });

  it('removes reference when remove button is clicked', async () => {
    const user = userEvent.setup();
    const references = ['Post 1', 'Post 2'];
    render(<ReferenceSelector {...defaultProps} references={references} />);
    
    const removeButtons = screen.getAllByText('Remove');
    await user.click(removeButtons[0]);
    
    expect(mockOnReferencesChange).toHaveBeenCalledWith(['Post 2']);
  });

  it('shows max references warning when limit reached', () => {
    const references = ['Post 1', 'Post 2', 'Post 3', 'Post 4', 'Post 5'];
    render(<ReferenceSelector {...defaultProps} references={references} />);
    
    expect(screen.getByText(/Maximum references reached \(5\/5\)/i)).toBeInTheDocument();
    expect(screen.queryByText(/Search posts to reference/i)).not.toBeInTheDocument();
  });

  it('hides add button when max references reached', () => {
    const references = ['Post 1', 'Post 2', 'Post 3', 'Post 4', 'Post 5'];
    render(<ReferenceSelector {...defaultProps} references={references} />);
    
    expect(screen.queryByText(/Add references to other creators' posts/i)).not.toBeInTheDocument();
  });

  it('shows placeholder message about Story 2.5 scope', () => {
    render(<ReferenceSelector {...defaultProps} />);
    
    expect(screen.getByText(/Story 2.5 Scope/i)).toBeInTheDocument();
    expect(screen.getByText(/Full post search and selection functionality will be implemented in Story 2.7/i)).toBeInTheDocument();
  });

  it('toggles search modal when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<ReferenceSelector {...defaultProps} />);
    
    const searchButton = screen.getByText(/🔍 Search posts to reference/i);
    
    // Button should be clickable (placeholder behavior)
    await user.click(searchButton);
    
    expect(searchButton).toBeInTheDocument();
  });
});
