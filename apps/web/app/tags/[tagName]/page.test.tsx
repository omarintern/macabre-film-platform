import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TagResultsPage from './page';

// Mock the TagWorksGallery component
jest.mock('../../../components/features/TagWorksGallery', () => {
  return function MockTagWorksGallery({ tagName }: { tagName: string }) {
    return <div data-testid="tag-works-gallery">Tag Works Gallery for: {tagName}</div>;
  };
});

describe('TagResultsPage', () => {
  const mockParams = Promise.resolve({
    tagName: 'action',
  });

  it('should render the page with correct tag name', async () => {
    render(await TagResultsPage({ params: mockParams }));
    
    expect(screen.getByText('Works tagged "#action"')).toBeInTheDocument();
    expect(screen.getByText('Browse all works associated with this tag')).toBeInTheDocument();
    expect(screen.getByTestId('tag-works-gallery')).toBeInTheDocument();
  });

  it('should display breadcrumb navigation', async () => {
    render(await TagResultsPage({ params: mockParams }));
    
    expect(screen.getByText('Index')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('#action')).toBeInTheDocument();
  });

  it('should handle URL-encoded tag names', async () => {
    const encodedParams = Promise.resolve({
      tagName: 'sci-fi',
    });
    
    render(await TagResultsPage({ params: encodedParams }));
    
    expect(screen.getByText('Works tagged "#sci-fi"')).toBeInTheDocument();
    expect(screen.getByText('#sci-fi')).toBeInTheDocument();
  });

  it('should handle special characters in tag names', async () => {
    const specialParams = Promise.resolve({
      tagName: 'action%20adventure',
    });
    
    render(await TagResultsPage({ params: specialParams }));
    
    expect(screen.getByText('Works tagged "#action adventure"')).toBeInTheDocument();
    expect(screen.getByText('#action adventure')).toBeInTheDocument();
  });

  it('should pass tag name to TagWorksGallery component', async () => {
    render(await TagResultsPage({ params: mockParams }));
    
    const gallery = screen.getByTestId('tag-works-gallery');
    expect(gallery).toHaveTextContent('Tag Works Gallery for: action');
  });

  it('should have proper page structure', async () => {
    render(await TagResultsPage({ params: mockParams }));
    
    // Check for main container
    expect(screen.getByText('Works tagged "#action"')).toBeInTheDocument();
    
    // Check for breadcrumb link
    const indexLink = screen.getByText('Index');
    expect(indexLink).toHaveAttribute('href', '/index');
  });
});

