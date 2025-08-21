import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkSubmissionForm, { Work } from './WorkSubmissionForm';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('WorkSubmissionForm', () => {
  const mockOnSubmissionSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    onSubmissionSuccess: mockOnSubmissionSuccess,
  };

  it('renders all form fields correctly', () => {
    render(<WorkSubmissionForm {...defaultProps} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/classification/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/body/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit work/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('shows character counter for body field', () => {
    render(<WorkSubmissionForm {...defaultProps} />);

    const bodyField = screen.getByLabelText(/body/i);
    const counter = screen.getByText(/1000 characters remaining/i);

    expect(counter).toBeInTheDocument();

    // Type some text and check counter updates
    fireEvent.change(bodyField, { target: { value: 'Hello world' } });
    expect(screen.getByText(/989 characters remaining/i)).toBeInTheDocument();
  });

  it('shows classification options correctly', () => {
    render(<WorkSubmissionForm {...defaultProps} />);

    expect(screen.getByRole('option', { name: 'Select classification' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Synopsis' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Scene Description' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Other' })).toBeInTheDocument();
  });

  it('validates required fields on submission', async () => {
    const user = userEvent.setup();
    render(<WorkSubmissionForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /submit work/i });
    await user.click(submitButton);

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/body is required/i)).toBeInTheDocument();
    expect(screen.getByText(/classification is required/i)).toBeInTheDocument();
  });

  it('validates body character limit', async () => {
    const user = userEvent.setup();
    render(<WorkSubmissionForm {...defaultProps} />);

    const bodyField = screen.getByLabelText(/body/i);
    const longText = 'a'.repeat(1001);
    
    await user.type(bodyField, longText);
    
    const submitButton = screen.getByRole('button', { name: /submit work/i });
    await user.click(submitButton);

    expect(screen.getByText(/body must be 1000 characters or less/i)).toBeInTheDocument();
  });

  it('clears field errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<WorkSubmissionForm {...defaultProps} />);

    // Trigger validation errors
    const submitButton = screen.getByRole('button', { name: /submit work/i });
    await user.click(submitButton);

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();

    // Start typing in title field
    const titleField = screen.getByLabelText(/title/i);
    await user.type(titleField, 'Test title');

    // Error should be cleared
    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
  });

  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup();
    const mockWork: Work = {
      id: 'work_123',
      title: 'Test Work',
      body: 'Test body content',
      classification: 'Synopsis',
      tags: ['drama', 'thriller'],
      creatorId: 'user_123',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      creator: {
        id: 'user_123',
        name: 'Test Creator',
        email: 'creator@example.com',
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, work: mockWork }),
    } as Response);

    render(<WorkSubmissionForm {...defaultProps} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/title/i), 'Test Work');
    await user.selectOptions(screen.getByLabelText(/classification/i), 'Synopsis');
    await user.type(screen.getByLabelText(/body/i), 'Test body content');
    await user.type(screen.getByLabelText(/tags/i), 'drama, thriller');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit work/i });
    await user.click(submitButton);

    // Wait for submission
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Work',
          body: 'Test body content',
          classification: 'Synopsis',
          tags: ['drama', 'thriller'],
        }),
      });
    });

    // Check success state
    expect(screen.getByText(/work submitted successfully/i)).toBeInTheDocument();
    expect(mockOnSubmissionSuccess).toHaveBeenCalledWith(mockWork);
  });

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup();
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Server error occurred' }),
    } as Response);

    render(<WorkSubmissionForm {...defaultProps} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/title/i), 'Test Work');
    await user.selectOptions(screen.getByLabelText(/classification/i), 'Synopsis');
    await user.type(screen.getByLabelText(/body/i), 'Test body content');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit work/i });
    await user.click(submitButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/server error occurred/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    
    // Mock a delayed response
    mockFetch.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true, work: {} }),
      } as Response), 100))
    );

    render(<WorkSubmissionForm {...defaultProps} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/title/i), 'Test Work');
    await user.selectOptions(screen.getByLabelText(/classification/i), 'Synopsis');
    await user.type(screen.getByLabelText(/body/i), 'Test body content');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit work/i });
    await user.click(submitButton);

    // Check loading state
    expect(screen.getByText(/submitting.../i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText(/work submitted successfully/i)).toBeInTheDocument();
    });
  });

  it('resets form when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<WorkSubmissionForm {...defaultProps} />);

    // Fill out the form
    const titleField = screen.getByLabelText(/title/i);
    const classificationField = screen.getByLabelText(/classification/i);
    const bodyField = screen.getByLabelText(/body/i);
    const tagsField = screen.getByLabelText(/tags/i);

    await user.type(titleField, 'Test Work');
    await user.selectOptions(classificationField, 'Synopsis');
    await user.type(bodyField, 'Test body content');
    await user.type(tagsField, 'drama, thriller');

    // Click reset
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    // Check fields are cleared
    expect(titleField).toHaveValue('');
    expect(classificationField).toHaveValue('');
    expect(bodyField).toHaveValue('');
    expect(tagsField).toHaveValue('');
  });

  it('handles network errors gracefully', async () => {
    const user = userEvent.setup();
    
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<WorkSubmissionForm {...defaultProps} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/title/i), 'Test Work');
    await user.selectOptions(screen.getByLabelText(/classification/i), 'Synopsis');
    await user.type(screen.getByLabelText(/body/i), 'Test body content');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit work/i });
    await user.click(submitButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', () => {
    render(<WorkSubmissionForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/title/i);
    const classificationSelect = screen.getByLabelText(/classification/i);
    const bodyTextarea = screen.getByLabelText(/body/i);
    const tagsInput = screen.getByLabelText(/tags/i);

    expect(titleInput).toHaveAttribute('id', 'title');
    expect(classificationSelect).toHaveAttribute('id', 'classification');
    expect(bodyTextarea).toHaveAttribute('id', 'body');
    expect(tagsInput).toHaveAttribute('id', 'tags');

    expect(titleInput).toHaveAttribute('placeholder', 'Enter the title of your work');
    expect(bodyTextarea).toHaveAttribute('placeholder', 'Enter your work content here...');
  });

  it('shows "Submit Another Work" button after successful submission', async () => {
    const user = userEvent.setup();
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, work: {} }),
    } as Response);

    render(<WorkSubmissionForm {...defaultProps} />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/title/i), 'Test Work');
    await user.selectOptions(screen.getByLabelText(/classification/i), 'Synopsis');
    await user.type(screen.getByLabelText(/body/i), 'Test body content');
    
    const submitButton = screen.getByRole('button', { name: /submit work/i });
    await user.click(submitButton);

    // Wait for success state
    await waitFor(() => {
      expect(screen.getByText(/work submitted successfully/i)).toBeInTheDocument();
    });

    // Check for "Submit Another Work" button
    const anotherWorkButton = screen.getByRole('button', { name: /submit another work/i });
    expect(anotherWorkButton).toBeInTheDocument();

    // Click it to return to form
    await user.click(anotherWorkButton);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });
});
