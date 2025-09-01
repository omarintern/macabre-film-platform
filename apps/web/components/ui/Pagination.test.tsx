import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders pagination controls correctly', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    expect(screen.getByText('← Previous')).toBeInTheDocument();
    expect(screen.getByText('Next →')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onPageChange when Previous button is clicked', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    fireEvent.click(screen.getByText('← Previous'));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when Next button is clicked', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    fireEvent.click(screen.getByText('Next →'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when page number is clicked', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    fireEvent.click(screen.getByText('3'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('disables Previous button when on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    const prevButton = screen.getByText('← Previous');
    // Since the Button component renders as a span, we need to check the parent button element
    const buttonElement = prevButton.closest('button');
    expect(buttonElement).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables Next button when on last page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={3}
        onPageChange={mockOnPageChange}
        hasNext={false}
        hasPrev={true}
      />
    );

    const nextButton = screen.getByText('Next →');
    // Since the Button component renders as a span, we need to check the parent button element
    const buttonElement = nextButton.closest('button');
    expect(buttonElement).toHaveAttribute('aria-disabled', 'true');
  });

  it('highlights current page correctly', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const currentPageButton = screen.getByText('2');
    // Since the Button component renders as a span, we need to check the parent button element
    const buttonElement = currentPageButton.closest('button');
    expect(buttonElement).toHaveClass('bg-blue-600');
    expect(buttonElement).toHaveClass('text-white');
  });

  it('shows ellipsis for large page ranges', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const ellipsisElements = screen.getAllByText('...');
    expect(ellipsisElements.length).toBeGreaterThan(0);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('handles single page correctly', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        hasNext={false}
        hasPrev={false}
      />
    );

    const pageButtons = screen.getAllByText('1');
    expect(pageButtons.length).toBeGreaterThan(0);
    
    // Since the Button component renders as a span, we need to check the parent button element
    const prevButtonElement = screen.getByText('← Previous').closest('button');
    const nextButtonElement = screen.getByText('Next →').closest('button');
    expect(prevButtonElement).toHaveAttribute('aria-disabled', 'true');
    expect(nextButtonElement).toHaveAttribute('aria-disabled', 'true');
  });

  it('applies correct styling to disabled buttons', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    const prevButton = screen.getByText('← Previous');
    // Since the Button component renders as a span, we need to check the parent button element
    const buttonElement = prevButton.closest('button');
    expect(buttonElement).toHaveAttribute('aria-disabled', 'true');
  });

  it('applies correct styling to enabled buttons', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const nextButton = screen.getByText('Next →');
    // Since the Button component renders as a span, we need to check the parent button element
    const buttonElement = nextButton.closest('button');
    expect(buttonElement).toHaveClass('bg-transparent');
    expect(buttonElement).toHaveClass('text-gray-700');
    expect(buttonElement).toHaveClass('hover:bg-gray-100');
  });

  it('has proper accessibility attributes', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    // Check navigation role
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Pagination');

    // Check current page indicator - look for aria-current on the button element
    const currentPageButton = screen.getByText('2');
    const buttonElement = currentPageButton.closest('button');
    expect(buttonElement).toHaveAttribute('aria-current', 'page');

    // Check aria-labels for navigation buttons
    const prevButton = screen.getByText('← Previous');
    const prevButtonElement = prevButton.closest('button');
    expect(prevButtonElement).toHaveAttribute('aria-label', 'Go to previous page, page 1');

    const nextButton = screen.getByText('Next →');
    const nextButtonElement = nextButton.closest('button');
    expect(nextButtonElement).toHaveAttribute('aria-label', 'Go to next page, page 3');
  });
});
