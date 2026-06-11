import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

const DOTS = '...';

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
}) => {
  const paginationRange = useMemo(() => {
    // Total page numbers we show in the pagination (siblingCount + firstPage + lastPage + currentPage + 2*DOTS)
    const totalPageNumbers = siblingCount * 2 + 5;

    // Case 1: If the number of pages is less than the page numbers we want to show, return the range [1..totalPages]
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate left and right sibling index
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Determine if we show dots on either side
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots to show, but right dots to show
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPages];
    }

    // Case 3: No right dots to show, but left dots to show
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + 1 + i
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots to show
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return [];
  }, [totalPages, siblingCount, currentPage]);

  // If there's only 1 page or less, don't show the pagination controls
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (currentPage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <nav
      className={`flex items-center justify-between border-t border-border px-4 py-3 sm:px-6 select-none ${className}`}
      aria-label="Pagination Navigation"
    >
      {/* Mobile View: Compact Previous/Next controls */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/50 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 active:scale-95 cursor-pointer"
        >
          Previous
        </button>
        <span className="text-sm font-medium text-foreground/80 flex items-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/50 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 active:scale-95 cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* Desktop View: Full Pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-foreground/85">
            Showing page <span className="font-semibold text-primary">{currentPage}</span> of{' '}
            <span className="font-semibold text-foreground">{totalPages}</span> pages
          </p>
        </div>
        <div>
          <div
            className="relative z-0 inline-flex items-center -space-x-px gap-1.5"
            aria-label="Pagination"
          >
            {/* Go to First Page */}
            <button
              onClick={handleFirst}
              disabled={currentPage === 1}
              title="First Page"
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-surface text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-95 cursor-pointer"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              title="Previous Page"
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-surface text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Buttons */}
            {paginationRange.map((pageNumber, index) => {
              if (pageNumber === DOTS) {
                return (
                  <span
                    key={`dots-${index}`}
                    className="relative inline-flex items-center justify-center w-9 h-9 text-sm font-semibold text-foreground/50"
                  >
                    &#8230;
                  </span>
                );
              }

              const isCurrent = pageNumber === currentPage;
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber as number)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-95 cursor-pointer ${
                    isCurrent
                      ? 'bg-primary text-white border-0 shadow-md shadow-primary/25 hover:bg-accent scale-105'
                      : 'border border-border bg-surface text-foreground hover:bg-muted/50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next Page */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              title="Next Page"
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-surface text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Go to Last Page */}
            <button
              onClick={handleLast}
              disabled={currentPage === totalPages}
              title="Last Page"
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-surface text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-95 cursor-pointer"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;
