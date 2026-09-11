import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { colors, spacing, radius } from '../../styles/design-tokens';

interface PLPPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export const PLPPagination: React.FC<PLPPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { language } = useStore();

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (totalPages <= 7) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first 3, ellipsis, last 3 around current
      pages.push(1, 2, 3);

      if (currentPage > 5) {
        pages.push('...');
      }

      const start = Math.max(4, currentPage - 1);
      const end = Math.min(totalPages - 3, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 4) {
        pages.push('...');
      }

      pages.push(totalPages - 2, totalPages - 1, totalPages);
    }

    // Remove duplicates
    return Array.from(new Set(pages));
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        margin: `${spacing.xl} 0`,
      }}
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        style={{
          padding: spacing.sm,
          borderRadius: radius.md,
          border: `1px solid ${colors.border}`,
          backgroundColor: currentPage === 1 ? colors['surface-container'] : colors.surface,
          color: currentPage === 1 ? colors['on-surface-variant'] : colors['on-background'],
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
      >
        {language === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Page Numbers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange?.(page)}
            disabled={page === '...'}
            style={{
              minWidth: '40px',
              height: '40px',
              padding: `0 ${spacing.sm}`,
              borderRadius: radius.md,
              border:
                currentPage === page
                  ? `2px solid ${colors.primary}`
                  : `1px solid ${colors.border}`,
              backgroundColor:
                currentPage === page
                  ? colors['primary-container']
                  : page === '...'
                    ? 'transparent'
                    : colors.surface,
              color: currentPage === page ? colors.primary : colors['on-background'],
              cursor: page === '...' || currentPage === page ? 'default' : 'pointer',
              fontWeight: currentPage === page ? 700 : 500,
              fontSize: '14px',
            }}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        style={{
          padding: spacing.sm,
          borderRadius: radius.md,
          border: `1px solid ${colors.border}`,
          backgroundColor: currentPage === totalPages ? colors['surface-container'] : colors.surface,
          color: currentPage === totalPages ? colors['on-surface-variant'] : colors['on-background'],
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: currentPage === totalPages ? 0.5 : 1,
        }}
      >
        {language === 'ar' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </div>
  );
};
