import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MosaicChainManager from './MosaicChainManager';
import { firebaseDataService } from '../../lib/firebase/dataService';
import { useAuth } from '../../stores/userSessionStore';

// Mock the services
jest.mock('../../lib/firebase/dataService');
jest.mock('../../stores/userSessionStore');

const mockFirebaseDataService = firebaseDataService as jest.Mocked<typeof firebaseDataService>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('MosaicChainManager', () => {
  const mockUser = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'CREATOR' as const
  };

  const mockChains = [
    {
      id: 'chain1',
      metaTitle: 'Horror Series',
      creatorId: 'user1',
      postCount: 3,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-15',
      creator: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com'
      }
    },
    {
      id: 'chain2',
      metaTitle: 'Urban Tales',
      creatorId: 'user1',
      postCount: 2,
      createdAt: '2023-02-01',
      updatedAt: '2023-02-10',
      creator: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com'
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: mockUser });
  });

  it('renders loading state initially', () => {
    mockFirebaseDataService.getMosaicChainsByCreator.mockResolvedValue([]);

    render(<MosaicChainManager />);

    expect(screen.getByText('Loading chains...')).toBeInTheDocument();
  });

  it('renders chains list when chains exist', async () => {
    mockFirebaseDataService.getMosaicChainsByCreator.mockResolvedValue(mockChains);

    render(<MosaicChainManager />);

    await waitFor(() => {
      expect(screen.getByText('Mosaic Chains')).toBeInTheDocument();
    });

    expect(screen.getByText('Horror Series')).toBeInTheDocument();
    expect(screen.getByText('Urban Tales')).toBeInTheDocument();
    expect(screen.getByText('3 posts')).toBeInTheDocument();
    expect(screen.getByText('2 posts')).toBeInTheDocument();
  });

  it('renders empty state when no chains exist', async () => {
    mockFirebaseDataService.getMosaicChainsByCreator.mockResolvedValue([]);

    render(<MosaicChainManager />);

    await waitFor(() => {
      expect(screen.getByText('No mosaic chains yet')).toBeInTheDocument();
    });

    expect(screen.getByText('Create your first mosaic chain by connecting posts when submitting new work.')).toBeInTheDocument();
  });

  it('shows error state when loading fails', async () => {
    mockFirebaseDataService.getMosaicChainsByCreator.mockRejectedValue(new Error('Failed to load'));

    render(<MosaicChainManager />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load chains. Please try again.')).toBeInTheDocument();
    });

    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('enters edit mode when Edit Title is clicked', async () => {
    mockFirebaseDataService.getMosaicChainsByCreator.mockResolvedValue(mockChains);

    const user = userEvent.setup();
    render(<MosaicChainManager />);

    await waitFor(() => {
      expect(screen.getByText('Horror Series')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit Title');
    await user.click(editButtons[0]);

    expect(screen.getByDisplayValue('Horror Series')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('cancels edit mode when Cancel is clicked', async () => {
    mockFirebaseDataService.getMosaicChainsByCreator.mockResolvedValue(mockChains);

    const user = userEvent.setup();
    render(<MosaicChainManager />);

    await waitFor(() => {
      expect(screen.getByText('Horror Series')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit Title');
    await user.click(editButtons[0]);

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(screen.queryByDisplayValue('Horror Series')).not.toBeInTheDocument();
    expect(screen.getByText('Horror Series')).toBeInTheDocument();
  });

  it('saves meta-title when Save is clicked', async () => {
    mockFirebaseDataService.getMosaicChainsByCreator.mockResolvedValue(mockChains);
    mockFirebaseDataService.updateMosaicChain.mockResolvedValue();

    const user = userEvent.setup();
    render(<MosaicChainManager />);

    await waitFor(() => {
      expect(screen.getByText('Horror Series')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit Title');
    await user.click(editButtons[0]);

    const input = screen.getByDisplayValue('Horror Series');
    await user.clear(input);
    await user.type(input, 'Updated Horror Series');

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    expect(mockFirebaseDataService.updateMosaicChain).toHaveBeenCalledWith('chain1', 'Updated Horror Series');
  });

  it('calls onViewChain when View Chain is clicked', async () => {
    const mockOnViewChain = jest.fn();
    mockFirebaseDataService.getMosaicChainsByCreator.mockResolvedValue(mockChains);

    const user = userEvent.setup();
    render(<MosaicChainManager onViewChain={mockOnViewChain} />);

    await waitFor(() => {
      expect(screen.getByText('Horror Series')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByText('View Chain');
    await user.click(viewButtons[0]);

    expect(mockOnViewChain).toHaveBeenCalledWith('chain1');
  });

  it('does not show View Chain buttons when onViewChain is not provided', async () => {
    mockFirebaseDataService.getMosaicChainsByCreator.mockResolvedValue(mockChains);

    render(<MosaicChainManager />);

    await waitFor(() => {
      expect(screen.getByText('Horror Series')).toBeInTheDocument();
    });

    expect(screen.queryByText('View Chain')).not.toBeInTheDocument();
  });

  it('refreshes chains when Refresh button is clicked', async () => {
    mockFirebaseDataService.getMosaicChainsByCreator.mockResolvedValue(mockChains);

    const user = userEvent.setup();
    render(<MosaicChainManager />);

    await waitFor(() => {
      expect(screen.getByText('Horror Series')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    await user.click(refreshButton);

    expect(mockFirebaseDataService.getMosaicChainsByCreator).toHaveBeenCalledTimes(2);
  });

  it('disables Save button when meta-title is empty', async () => {
    mockFirebaseDataService.getMosaicChainsByCreator.mockResolvedValue(mockChains);

    const user = userEvent.setup();
    render(<MosaicChainManager />);

    await waitFor(() => {
      expect(screen.getByText('Horror Series')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit Title');
    await user.click(editButtons[0]);

    const input = screen.getByDisplayValue('Horror Series');
    await user.clear(input);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();
  });

  it('applies custom className', () => {
    const customClass = 'custom-manager';
    mockFirebaseDataService.getMosaicChainsByCreator.mockResolvedValue([]);

    render(<MosaicChainManager className={customClass} />);

    // Find the container with the custom class
    const container = screen.getByText('Loading chains...').closest('.custom-manager');
    expect(container).toHaveClass(customClass);
  });
});
