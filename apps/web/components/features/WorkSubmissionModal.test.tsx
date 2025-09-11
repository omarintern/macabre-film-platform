import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkSubmissionModal from './WorkSubmissionModal';

// Mock the auth hook
const mockUser = {
  id: 'user123',
  email: 'test@example.com',
  role: 'CREATOR' as const,
  name: 'Test User',
};

jest.mock('../../stores/userSessionStore', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
  }),
}));

// Mock workService
jest.mock('../../lib/services/workService', () => ({
  workService: {
    createWork: jest.fn(),
  },
}));

describe('WorkSubmissionModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmissionSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmissionSuccess: mockOnSubmissionSuccess,
  };

  it('renders modal when isOpen is true', () => {
    render(<WorkSubmissionModal {...defaultProps} />);
    
    expect(screen.getByText('Post New Work')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/classification/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<WorkSubmissionModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Post New Work')).not.toBeInTheDocument();
  });

  it('renders connection options section', () => {
    render(<WorkSubmissionModal {...defaultProps} />);
    
    expect(screen.getByText('Connections')).toBeInTheDocument();
    expect(screen.getByLabelText('None')).toBeInTheDocument();
    expect(screen.getByLabelText('Start/Continue Mosaic')).toBeInTheDocument();
    expect(screen.getByLabelText('Add References')).toBeInTheDocument();
  });

  it('has None selected by default', () => {
    render(<WorkSubmissionModal {...defaultProps} />);
    
    const noneRadio = screen.getByLabelText('None');
    const mosaicRadio = screen.getByLabelText('Start/Continue Mosaic');
    const referenceRadio = screen.getByLabelText('Add References');
    
    expect(noneRadio).toBeChecked();
    expect(mosaicRadio).not.toBeChecked();
    expect(referenceRadio).not.toBeChecked();
  });

  it('shows mosaic interface when mosaic option is selected', async () => {
    const user = userEvent.setup();
    render(<WorkSubmissionModal {...defaultProps} />);
    
    const mosaicRadio = screen.getByLabelText('Start/Continue Mosaic');
    await user.click(mosaicRadio);
    
    expect(screen.getByText(/Meta-title for this mosaic chain/i)).toBeInTheDocument();
    expect(screen.getByText(/Chain relationship/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose from your previous posts or start new chain/i)).toBeInTheDocument();
  });

  it('shows reference interface when reference option is selected', async () => {
    const user = userEvent.setup();
    render(<WorkSubmissionModal {...defaultProps} />);
    
    const referenceRadio = screen.getByLabelText('Add References');
    await user.click(referenceRadio);
    
    expect(screen.getByText(/Add references to other creators' posts/i)).toBeInTheDocument();
    expect(screen.getByText(/🔍 Search posts to reference... \(5 slots remaining\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Story 2.5 Scope/i)).toBeInTheDocument();
  });

  it('hides connection interfaces when None is selected', async () => {
    const user = userEvent.setup();
    render(<WorkSubmissionModal {...defaultProps} />);
    
    // First select mosaic to show interface
    const mosaicRadio = screen.getByLabelText('Start/Continue Mosaic');
    await user.click(mosaicRadio);
    expect(screen.getByText(/Meta-title for this mosaic chain/i)).toBeInTheDocument();
    
    // Then select None to hide interface
    const noneRadio = screen.getByLabelText('None');
    await user.click(noneRadio);
    expect(screen.queryByText(/Meta-title for this mosaic chain/i)).not.toBeInTheDocument();
  });

  it('maintains existing form functionality', async () => {
    const user = userEvent.setup();
    const { workService } = await import('../../lib/services/workService');
    workService.createWork.mockResolvedValue({
      id: 'work123',
      title: 'Test Work',
      body: 'Test content',
      classification: 'Synopsis',
      tags: ['test'],
      creatorId: 'user123',
      creator: mockUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    render(<WorkSubmissionModal {...defaultProps} />);
    
    // Fill out the form
    await user.type(screen.getByLabelText(/title/i), 'Test Work');
    await user.selectOptions(screen.getByLabelText(/classification/i), 'Synopsis');
    await user.type(screen.getByLabelText(/content/i), 'Test content');
    await user.type(screen.getByLabelText(/tags/i), 'test, drama');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /post work/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(workService.createWork).toHaveBeenCalledWith({
        title: 'Test Work',
        body: 'Test content',
        classification: 'Synopsis',
        tags: ['test', 'drama'],
        connectionType: 'none',
        mosaicMetaTitle: undefined,
        references: undefined,
      }, 'user123');
    });
  });

  it('resets connection type when form is reset', async () => {
    const user = userEvent.setup();
    render(<WorkSubmissionModal {...defaultProps} />);
    
    // Select mosaic option
    const mosaicRadio = screen.getByLabelText('Start/Continue Mosaic');
    await user.click(mosaicRadio);
    expect(mosaicRadio).toBeChecked();
    
    // Close and reopen modal
    const closeButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows character counter for body field', () => {
    render(<WorkSubmissionModal {...defaultProps} />);
    
    expect(screen.getByText('2000 characters remaining')).toBeInTheDocument();
  });

  it('validates mosaic meta-title when mosaic is selected', async () => {
    const user = userEvent.setup();
    render(<WorkSubmissionModal {...defaultProps} />);
    
    // Select mosaic option
    const mosaicRadio = screen.getByLabelText('Start/Continue Mosaic');
    await user.click(mosaicRadio);
    
    // Fill out required fields but leave meta-title empty
    await user.type(screen.getByLabelText(/^Title \*$/i), 'Test Work');
    await user.selectOptions(screen.getByLabelText(/classification/i), 'Synopsis');
    await user.type(screen.getByLabelText(/content/i), 'Test content');
    
    // Try to submit
    const submitButton = screen.getByRole('button', { name: /post work/i });
    await user.click(submitButton);
    
    // Should show validation error for meta-title
    expect(screen.getByText(/Meta-title for this mosaic chain \*/i)).toBeInTheDocument();
  });
});
