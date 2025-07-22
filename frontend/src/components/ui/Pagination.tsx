// components/ui/Pagination.tsx
import React from 'react';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaAngleDoubleLeft, 
  FaAngleDoubleRight 
} from 'react-icons/fa';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  loading?: boolean;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalResults,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 20, 50, 100]
}) => {
  // Calculate visible page numbers
  const getVisiblePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7; // Adjust as needed
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 4) {
        // Near beginning
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near end
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          if (i > 1) pages.push(i);
        }
      } else {
        // In the middle
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageSizeChange && newPageSize !== pageSize) {
      onPageSizeChange(newPageSize);
    }
  };

  // Calculate current range
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalResults);

  if (totalResults === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#343B4F] rounded-lg text-white">
      {/* Results info */}
      <div className="text-sm text-gray-300">
        Showing {startItem} to {endItem} of {totalResults} results
      </div>

      {/* Page size selector */}
      {showPageSizeSelector && onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Show:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            disabled={loading}
            className="bg-[#444b61] text-white px-2 py-1 rounded border border-gray-600 focus:border-[#CB3CFF] focus:outline-none disabled:opacity-50"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-300">per page</span>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || loading}
          className="p-2 rounded hover:bg-[#444b61] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="First page"
        >
          <FaAngleDoubleLeft />
        </button>

        {/* Previous page */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="p-2 rounded hover:bg-[#444b61] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <FaChevronLeft />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  disabled={loading}
                  className={`px-3 py-2 rounded min-w-[40px] transition-colors ${
                    currentPage === page
                      ? 'bg-[#CB3CFF] text-white'
                      : 'hover:bg-[#444b61] disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next page */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="p-2 rounded hover:bg-[#444b61] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <FaChevronRight />
        </button>

        {/* Last page */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || loading}
          className="p-2 rounded hover:bg-[#444b61] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Last page"
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;