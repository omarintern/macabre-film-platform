/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

// Mock WorkSubmissionForm component
jest.mock('../../../components/features/WorkSubmissionForm', () => {
  return function MockWorkSubmissionForm({ onSubmissionSuccess }: { onSubmissionSuccess?: (work: any) => void }) {
    return (
      <div data-testid="work-submission-form">
        <button 
          onClick={() => onSubmissionSuccess && onSubmissionSuccess({ id: 'test-work' })}
        >
          Mock Submit
        </button>
      </div>
    );
  };
});

// We need to import the component after mocking
import SubmitPage from './page';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockJwtVerify = jwt.verify as jest.MockedFunction<typeof jwt.verify>;

describe('Submit Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    
    // Mock console.log to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
    jest.restoreAllMocks();
  });

  it('renders submit page for authenticated CREATOR', async () => {
    // Mock authenticated CREATOR user
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    };
    mockCookies.mockResolvedValue(mockCookieStore);
    
    mockJwtVerify.mockReturnValue({
      userId: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
    });

    const SubmitPageComponent = await SubmitPage();
    render(SubmitPageComponent);

    expect(screen.getByText('Submit New Work')).toBeInTheDocument();
    expect(screen.getByText(/Share your creative work with the community/)).toBeInTheDocument();
    expect(screen.getByTestId('work-submission-form')).toBeInTheDocument();
    expect(screen.getByText('Submission Guidelines')).toBeInTheDocument();
  });

  it('redirects to login when no auth token', async () => {
    // Mock no auth token
    const mockCookieStore = {
      get: jest.fn().mockReturnValue(undefined),
    };
    mockCookies.mockResolvedValue(mockCookieStore);

    await SubmitPage();

    expect(mockRedirect).toHaveBeenCalledWith('/login');
  });

  it('redirects to login when JWT token is invalid', async () => {
    // Mock invalid token
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'invalid-token' }),
    };
    mockCookies.mockResolvedValue(mockCookieStore);
    
    mockJwtVerify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    try {
      await SubmitPage();
    } catch {
      // The redirect will throw in the test environment, that's expected
    }

    expect(mockRedirect).toHaveBeenCalledWith('/login');
  });

  it('redirects to home when user is not CREATOR', async () => {
    // Mock authenticated CLIENT user
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    };
    mockCookies.mockResolvedValue(mockCookieStore);
    
    mockJwtVerify.mockReturnValue({
      userId: 'user_123',
      email: 'client@example.com',
      role: 'CLIENT',
    });

    await SubmitPage();

    expect(mockRedirect).toHaveBeenCalledWith('/');
  });

  it('redirects to home when user is ADMIN', async () => {
    // Mock authenticated ADMIN user
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    };
    mockCookies.mockResolvedValue(mockCookieStore);
    
    mockJwtVerify.mockReturnValue({
      userId: 'user_123',
      email: 'admin@example.com',
      role: 'ADMIN',
    });

    await SubmitPage();

    expect(mockRedirect).toHaveBeenCalledWith('/');
  });

  it('displays breadcrumb navigation', async () => {
    // Mock authenticated CREATOR user
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    };
    mockCookies.mockResolvedValue(mockCookieStore);
    
    mockJwtVerify.mockReturnValue({
      userId: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
    });

    const SubmitPageComponent = await SubmitPage();
    render(SubmitPageComponent);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Submit Work')).toBeInTheDocument();
  });

  it('displays submission guidelines', async () => {
    // Mock authenticated CREATOR user
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    };
    mockCookies.mockResolvedValue(mockCookieStore);
    
    mockJwtVerify.mockReturnValue({
      userId: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
    });

    const SubmitPageComponent = await SubmitPage();
    render(SubmitPageComponent);

    expect(screen.getByText('Submission Guidelines')).toBeInTheDocument();
    expect(screen.getByText(/Keep your work under 1,000 characters/)).toBeInTheDocument();
    expect(screen.getByText(/Choose the most appropriate classification/)).toBeInTheDocument();
    expect(screen.getByText(/Use relevant tags to help others discover/)).toBeInTheDocument();
    expect(screen.getByText(/Ensure your content is original/)).toBeInTheDocument();
  });

  it('handles missing JWT_SECRET gracefully', async () => {
    delete process.env.JWT_SECRET;

    // Mock authenticated user
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    };
    mockCookies.mockResolvedValue(mockCookieStore);

    try {
      await SubmitPage();
    } catch (error) {
      expect(error).toEqual(new Error('JWT_SECRET not configured'));
    }
  });

  it('has proper page structure and accessibility', async () => {
    // Mock authenticated CREATOR user
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    };
    mockCookies.mockResolvedValue(mockCookieStore);
    
    mockJwtVerify.mockReturnValue({
      userId: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
    });

    const SubmitPageComponent = await SubmitPage();
    render(SubmitPageComponent);

    // Check main heading
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('Submit New Work');

    // Check breadcrumb navigation
    const breadcrumbNav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(breadcrumbNav).toBeInTheDocument();

    // Check guidelines section
    const guidelinesHeading = screen.getByRole('heading', { level: 2 });
    expect(guidelinesHeading).toHaveTextContent('Submission Guidelines');
  });

  it('passes onSubmissionSuccess callback to WorkSubmissionForm', async () => {
    // Mock authenticated CREATOR user
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    };
    mockCookies.mockResolvedValue(mockCookieStore);
    
    mockJwtVerify.mockReturnValue({
      userId: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
    });

    const SubmitPageComponent = await SubmitPage();
    render(SubmitPageComponent);

    // Trigger the mock submission success
    const mockSubmitButton = screen.getByText('Mock Submit');
    mockSubmitButton.click();

    // Check that console.log was called (from the handleSubmissionSuccess function)
    expect(console.log).toHaveBeenCalledWith('Work submitted successfully:', { id: 'test-work' });
  });
});
