import React from 'react';
import { render, screen } from '@testing-library/react';
import TagResultsPage from './page';

// Mock the TagWorksGallery component
jest.mock('../../../components/features/TagWorksGallery', () => {
  return function MockTagWorksGallery({ tagName }: { tagName: string }) {
    return <div data-testid="tag-works-gallery">Tag Works Gallery for: {tagName}</div>;
  };
});

describe('TagResultsPage', () => {
  const mockParams = {
    tagName: 'action',
  };

  it('should render the page with correct tag name', () => {
    render(<TagResultsPage params={mockParams} />);
    
    expect(screen.getByText('Works tagged "#action"')).toBeInTheDocument();
    expect(screen.getByText('Browse all works associated with this tag')).toBeInTheDocument();
    expect(screen.getByTestId('tag-works-gallery')).toBeInTheDocument();
  });

  it('should display breadcrumb navigation', () => {
    render(<TagResultsPage params={mockParams} />);
    
    expect(screen.getByText('Index')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('#action')).toBeInTheDocument();
  });

  it('should handle URL-encoded tag names', () => {
    const encodedParams = {
      tagName: 'sci-fi',
    };
    
    render(<TagResultsPage params={encodedParams} />);
    
    expect(screen.getByText('Works tagged "#sci-fi"')).toBeInTheDocument();
    expect(screen.getByText('#sci-fi')).toBeInTheDocument();
  });

  it('should handle special characters in tag names', () => {
    const specialParams = {
      tagName: 'action%20adventure',
    };
    
    render(<TagResultsPage params={specialParams} />);
    
    expect(screen.getByText('Works tagged "#action adventure"')).toBeInTheDocument();
    expect(screen.getByText('#action adventure')).toBeInTheDocument();
  });

  it('should pass tag name to TagWorksGallery component', () => {
    render(<TagResultsPage params={mockParams} />);
    
    const gallery = screen.getByTestId('tag-works-gallery');
    expect(gallery).toHaveTextContent('Tag Works Gallery for: action');
  });

  it('should have proper page structure', () => {
    render(<TagResultsPage params={mockParams} />);
    
    // Check for main container
    expect(screen.getByText('Works tagged "#action"')).toBeInTheDocument();
    
    // Check for breadcrumb link
    const indexLink = screen.getByText('Index');
    expect(indexLink).toHaveAttribute('href', '/index');
  });
});
