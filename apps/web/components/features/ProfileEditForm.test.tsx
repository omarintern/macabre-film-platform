import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileEditForm from './ProfileEditForm';

describe('ProfileEditForm', () => {
  const defaultProps = {
    initialName: '',
    initialBio: '',
    onSave: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with initial values', () => {
    render(
      <ProfileEditForm
        {...defaultProps}
        initialName="John Creator"
        initialBio="A creative professional"
      />
    );

    expect(screen.getByDisplayValue('John Creator')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A creative professional')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('updates form values when user types', async () => {
    const user = userEvent.setup();
    render(<ProfileEditForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/display name/i);
    const bioInput = screen.getByLabelText(/bio/i);

    await user.type(nameInput, 'New Name');
    await user.type(bioInput, 'New bio content');

    expect(nameInput).toHaveValue('New Name');
    expect(bioInput).toHaveValue('New bio content');
  });

  it('shows character counts', async () => {
    const user = userEvent.setup();
    render(<ProfileEditForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/display name/i);
    await user.type(nameInput, 'Test');

    expect(screen.getByText('4/100 characters')).toBeInTheDocument();
    expect(screen.getByText('0/1000 characters')).toBeInTheDocument();
  });

  it('validates name length', async () => {
    const user = userEvent.setup();
    render(<ProfileEditForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/display name/i);
    const longName = 'a'.repeat(101);
    
    await user.type(nameInput, longName);
    
    const submitButton = screen.getByRole('button', { name: /save profile/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name must be 100 characters or less')).toBeInTheDocument();
    });

    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  it('validates bio length', async () => {
    const user = userEvent.setup();
    render(<ProfileEditForm {...defaultProps} />);

    const bioInput = screen.getByLabelText(/bio/i);
    const longBio = 'a'.repeat(1001);
    
    await user.type(bioInput, longBio);
    
    const submitButton = screen.getByRole('button', { name: /save profile/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Bio must be 1000 characters or less')).toBeInTheDocument();
    });

    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  it('calls onSave with trimmed values when form is valid', async () => {
    const user = userEvent.setup();
    const mockOnSave = jest.fn().mockResolvedValue(undefined);
    
    render(<ProfileEditForm {...defaultProps} onSave={mockOnSave} />);

    const nameInput = screen.getByLabelText(/display name/i);
    const bioInput = screen.getByLabelText(/bio/i);
    
    await user.type(nameInput, '  John Creator  ');
    await user.type(bioInput, '  A creative professional  ');
    
    const submitButton = screen.getByRole('button', { name: /save profile/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'John Creator',
        bio: 'A creative professional',
      });
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    let resolvePromise: (value?: any) => void;
    const mockOnSave = jest.fn(() => new Promise(resolve => {
      resolvePromise = resolve;
    }));
    
    render(<ProfileEditForm {...defaultProps} onSave={mockOnSave} />);

    const submitButton = screen.getByRole('button', { name: /save profile/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    resolvePromise!();
  });

  it('shows error message when save fails', async () => {
    const user = userEvent.setup();
    const mockOnSave = jest.fn().mockRejectedValue(new Error('Save failed'));
    
    render(<ProfileEditForm {...defaultProps} onSave={mockOnSave} />);

    const submitButton = screen.getByRole('button', { name: /save profile/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Save failed')).toBeInTheDocument();
    });
  });

  it('resets form to initial values when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ProfileEditForm
        {...defaultProps}
        initialName="Initial Name"
        initialBio="Initial Bio"
      />
    );

    const nameInput = screen.getByLabelText(/display name/i);
    const bioInput = screen.getByLabelText(/bio/i);
    
    // Change values
    await user.clear(nameInput);
    await user.type(nameInput, 'Changed Name');
    await user.clear(bioInput);
    await user.type(bioInput, 'Changed Bio');

    expect(nameInput).toHaveValue('Changed Name');
    expect(bioInput).toHaveValue('Changed Bio');

    // Reset
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    expect(nameInput).toHaveValue('Initial Name');
    expect(bioInput).toHaveValue('Initial Bio');
  });

  it('clears field errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<ProfileEditForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/display name/i);
    const longName = 'a'.repeat(101);
    
    // Trigger validation error
    await user.type(nameInput, longName);
    const submitButton = screen.getByRole('button', { name: /save profile/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name must be 100 characters or less')).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.clear(nameInput);
    await user.type(nameInput, 'Valid Name');

    expect(screen.queryByText('Name must be 100 characters or less')).not.toBeInTheDocument();
  });

  it('disables form when isLoading prop is true', () => {
    render(<ProfileEditForm {...defaultProps} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /save profile/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });

    expect(submitButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(<ProfileEditForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/display name/i);
    const bioInput = screen.getByLabelText(/bio/i);

    expect(nameInput).toHaveAttribute('id', 'name');
    expect(bioInput).toHaveAttribute('id', 'bio');
    expect(nameInput).toHaveAttribute('placeholder', 'Enter your display name');
    expect(bioInput).toHaveAttribute('placeholder', 'Tell others about yourself...');
  });
});
