import React from 'react';
import { render, screen } from '@testing-library/react';
import TagCard from './TagCard';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('TagCard', () => {
  const mockTag = {
    name: 'action',
    count: 3,
  };

  it('should render tag information correctly', () => {
    render(<TagCard tag={mockTag} />);
    
    expect(screen.getByText('#action')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('3 works')).toBeInTheDocument();
    expect(screen.getByText('View works →')).toBeInTheDocument();
  });

  it('should render singular form for single work', () => {
    const singleWorkTag = { name: 'drama', count: 1 };
    render(<TagCard tag={singleWorkTag} />);
    
    expect(screen.getByText('1 work')).toBeInTheDocument();
  });

  it('should have correct link href', () => {
    render(<TagCard tag={mockTag} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/spaces?tag=action');
  });

  it('should have proper accessibility attributes', () => {
    render(<TagCard tag={mockTag} />);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    
    // Check that the tag name is accessible
    expect(screen.getByText('#action')).toBeInTheDocument();
  });

  it('should handle special characters in tag names', () => {
    const specialTag = { name: 'sci-fi', count: 2 };
    render(<TagCard tag={specialTag} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/spaces?tag=sci-fi');
    expect(screen.getByText('#sci-fi')).toBeInTheDocument();
  });

  it('should handle empty tag name', () => {
    const emptyTag = { name: '', count: 1 };
    render(<TagCard tag={emptyTag} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/spaces?tag=');
    expect(screen.getByText('#')).toBeInTheDocument();
  });
});
