import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignupPage from './page';
import { authService } from '../../../lib/services/authService';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock authService
jest.mock('../../../lib/services/authService', () => ({
  authService: {
    signup: jest.fn(),
  },
}));

describe('SignupPage', () => {
  const mockPush = jest.fn();
  const mockedAuthService = authService as jest.Mocked<typeof authService>;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it('renders signup form with all required fields', () => {
    render(<SignupPage />);

    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<SignupPage />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email format', async () => {
    render(<SignupPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    render(<SignupPage />);

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    });
  });

  it('shows validation error for password without complexity', async () => {
    render(<SignupPage />);

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must contain at least one lowercase letter, one uppercase letter, and one number')).toBeInTheDocument();
    });
  });

  it('clears field errors when user starts typing', async () => {
    render(<SignupPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Trigger validation error
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    // Start typing to clear error
    fireEvent.change(emailInput, { target: { value: 'test@' } });
    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });

  it('submits form with valid data and redirects on success', async () => {
    mockedAuthService.signup.mockResolvedValue({
      success: true,
      message: 'Account created successfully!',
    });

    render(<SignupPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAuthService.signup).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('shows error message on signup failure', async () => {
    mockedAuthService.signup.mockResolvedValue({
      success: false,
      error: 'An account with this email already exists',
    });

    render(<SignupPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('An account with this email already exists')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows loading state during form submission', async () => {
    // Create a promise that we can control
    let resolveSignup: (value: { success: boolean; message?: string; error?: string }) => void;
    const signupPromise = new Promise((resolve) => {
      resolveSignup = resolve;
    });
    
    mockedAuthService.signup.mockReturnValue(signupPromise);

    render(<SignupPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    // Resolve the promise
    resolveSignup!({ success: true, message: 'Success' });

    await waitFor(() => {
      expect(screen.queryByText(/creating account/i)).not.toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', () => {
    render(<SignupPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('autoComplete', 'email');
    expect(emailInput).toHaveAttribute('required');

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('autoComplete', 'new-password');
    expect(passwordInput).toHaveAttribute('required');
  });
});
