import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import AdminPage from './page';
import { useAuth } from '../../../stores/userSessionStore';

// Mock dependencies
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock('../../../stores/userSessionStore', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../components/features/admin/UserPromotionForm', () => {
  return function MockUserPromotionForm({ onSuccess }: { onSuccess?: (user: any) => void }) {
    return (
      <div data-testid="user-promotion-form">
        <button 
          onClick={() => onSuccess?.({
            id: 'user-1',
            email: 'test@example.com',
            role: 'CREATOR',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          })}
          data-testid="mock-promote-button"
        >
          Mock Promote
        </button>
      </div>
    );
  };
});

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('AdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading spinner when auth is loading', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: true,
      });

      render(<AdminPage />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Authentication and Authorization', () => {
    it('should redirect to login if not authenticated', async () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });

      render(<AdminPage />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login?redirect=/admin');
      });
    });

    it('should redirect to home if not admin', async () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: {
          id: 'user-1',
          email: 'user@example.com',
          role: 'CLIENT',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        isLoading: false,
      });

      render(<AdminPage />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should render admin dashboard for admin users', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: {
          id: 'admin-1',
          email: 'admin@example.com',
          role: 'ADMIN',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        isLoading: false,
      });

      render(<AdminPage />);

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Manage user roles and permissions')).toBeInTheDocument();
    });
  });

  describe('Admin Dashboard Content', () => {
    beforeEach(() => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: {
          id: 'admin-1',
          email: 'admin@example.com',
          role: 'ADMIN',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        isLoading: false,
      });
    });

    it('should display admin information', () => {
      render(<AdminPage />);

      expect(screen.getByText('Admin Information')).toBeInTheDocument();
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
      expect(screen.getByText('ADMIN')).toBeInTheDocument();
    });

    it('should display user promotion form', () => {
      render(<AdminPage />);

      expect(screen.getByTestId('user-promotion-form')).toBeInTheDocument();
    });

    it('should display recent promotions section', () => {
      render(<AdminPage />);

      expect(screen.getByText('Recent Promotions')).toBeInTheDocument();
      expect(screen.getByText('No recent promotions')).toBeInTheDocument();
    });

    it('should display admin actions section', () => {
      render(<AdminPage />);

      expect(screen.getByText('Admin Actions')).toBeInTheDocument();
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Content Moderation')).toBeInTheDocument();
      expect(screen.getByText('System Analytics')).toBeInTheDocument();
    });

    it('should display instructions section', () => {
      render(<AdminPage />);

      expect(screen.getByText('How to Use')).toBeInTheDocument();
      expect(screen.getByText(/Enter a user's email address or ID to search for them/)).toBeInTheDocument();
    });
  });

  describe('Recent Promotions Functionality', () => {
    beforeEach(() => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: {
          id: 'admin-1',
          email: 'admin@example.com',
          role: 'ADMIN',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        isLoading: false,
      });
    });

    it('should update recent promotions when user is promoted', async () => {
      render(<AdminPage />);

      // Initially should show "No recent promotions"
      expect(screen.getByText('No recent promotions')).toBeInTheDocument();

      // Click the mock promote button to trigger onSuccess
      const promoteButton = screen.getByTestId('mock-promote-button');
      promoteButton.click();

      // Should now show the promoted user
      await waitFor(() => {
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText('CREATOR')).toBeInTheDocument();
        expect(screen.getByText('Just promoted')).toBeInTheDocument();
      });

      // Should no longer show "No recent promotions"
      expect(screen.queryByText('No recent promotions')).not.toBeInTheDocument();
    });
  });
});
