import React from 'react';
import { render, screen } from '@testing-library/react';
import PublicProfile from './PublicProfile';
import { PublicProfile as PublicProfileType } from '../../lib/services/profileService';

describe('PublicProfile', () => {
  const mockProfile: PublicProfileType = {
    id: 'user_123',
    name: 'John Creator',
    bio: 'A creative professional working on film projects.',
    role: 'CREATOR',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  it('renders profile with complete information', () => {
    render(<PublicProfile profile={mockProfile} />);

    expect(screen.getByText('John Creator')).toBeInTheDocument();
    expect(screen.getByText('creator')).toBeInTheDocument();
    expect(screen.getByText('A creative professional working on film projects.')).toBeInTheDocument();
    expect(screen.getByText('Member since January 1, 2024')).toBeInTheDocument();
  });

  it('renders profile with minimal information', () => {
    const minimalProfile: PublicProfileType = {
      id: 'user_456',
      name: null,
      bio: null,
      role: 'CREATOR',
      createdAt: '2024-06-15T00:00:00.000Z',
    };

    render(<PublicProfile profile={minimalProfile} />);

    expect(screen.getByText('Anonymous Creator')).toBeInTheDocument();
    expect(screen.getByText('creator')).toBeInTheDocument();
    expect(screen.getByText("This creator hasn't added a bio yet.")).toBeInTheDocument();
    expect(screen.getByText('Member since June 15, 2024')).toBeInTheDocument();
  });

  it('displays correct avatar initial', () => {
    render(<PublicProfile profile={mockProfile} />);

    const avatar = screen.getByText('J');
    expect(avatar).toBeInTheDocument();
  });

  it('displays question mark for anonymous users', () => {
    const anonymousProfile: PublicProfileType = {
      ...mockProfile,
      name: null,
    };

    render(<PublicProfile profile={anonymousProfile} />);

    const avatar = screen.getByText('?');
    expect(avatar).toBeInTheDocument();
  });

  it('displays bio with proper formatting', () => {
    const profileWithMultilineBio: PublicProfileType = {
      ...mockProfile,
      bio: 'Line 1\n\nLine 2 with some content\n\nLine 3',
    };

    render(<PublicProfile profile={profileWithMultilineBio} />);

    const bioElement = screen.getByText(/Line 1/);
    expect(bioElement).toHaveClass('whitespace-pre-wrap');
  });

  it('shows works placeholder section', () => {
    render(<PublicProfile profile={mockProfile} />);

    expect(screen.getByText('Works')).toBeInTheDocument();
    expect(screen.getByText('No works yet')).toBeInTheDocument();
    expect(screen.getByText("This creator hasn't submitted any works yet. Check back later!")).toBeInTheDocument();
  });

  it('shows stats section with zero values', () => {
    render(<PublicProfile profile={mockProfile} />);

    const statsValues = screen.getAllByText('0');
    expect(statsValues).toHaveLength(3);

    expect(screen.getByText('Works Published')).toBeInTheDocument();
    expect(screen.getByText('Collaborations')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    const profileWithSpecificDate: PublicProfileType = {
      ...mockProfile,
      createdAt: '2023-12-25T10:30:00.000Z',
    };

    render(<PublicProfile profile={profileWithSpecificDate} />);

    expect(screen.getByText('Member since December 25, 2023')).toBeInTheDocument();
  });

  it('handles different roles correctly', () => {
    const adminProfile: PublicProfileType = {
      ...mockProfile,
      role: 'ADMIN',
    };

    render(<PublicProfile profile={adminProfile} />);

    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('renders About section header', () => {
    render(<PublicProfile profile={mockProfile} />);

    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<PublicProfile profile={mockProfile} />);

    // Check for heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('John Creator');

    const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(sectionHeadings).toHaveLength(2);
    expect(sectionHeadings[0]).toHaveTextContent('About');
    expect(sectionHeadings[1]).toHaveTextContent('Works');
  });

  it('displays empty bio message with proper styling', () => {
    const profileWithoutBio: PublicProfileType = {
      ...mockProfile,
      bio: null,
    };

    render(<PublicProfile profile={profileWithoutBio} />);

    const emptyBioMessage = screen.getByText("This creator hasn't added a bio yet.");
    expect(emptyBioMessage).toHaveClass('text-gray-500', 'italic');
  });

  it('handles empty string bio same as null bio', () => {
    const profileWithEmptyBio: PublicProfileType = {
      ...mockProfile,
      bio: '',
    };

    render(<PublicProfile profile={profileWithEmptyBio} />);

    // Empty string should still show the placeholder message
    expect(screen.getByText("This creator hasn't added a bio yet.")).toBeInTheDocument();
  });
});
