import React from 'react';
import { Button } from './design-system';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav 
      className="flex items-center justify-center space-x-2 py-8"
      role="navigation"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        variant="ghost"
        size="sm"
        className="min-w-[80px] font-medium"
        aria-label={`Go to previous page, page ${currentPage - 1}`}
      >
        ← Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span 
                className="px-3 py-2 text-sm text-muted-foreground font-medium"
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <Button
                onClick={() => onPageChange(page as number)}
                variant={currentPage === page ? 'primary' : 'ghost'}
                size="sm"
                className={`min-w-[40px] h-10 font-medium transition-all duration-200`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        variant="ghost"
        size="sm"
        className="min-w-[80px] font-medium"
        aria-label={`Go to next page, page ${currentPage + 1}`}
      >
        Next →
      </Button>
    </nav>
  );
};

export default Pagination;
