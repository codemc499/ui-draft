'use client';

import React from 'react';
import * as Pagination from '@/components/ui/pagination';
import { RiArrowLeftDoubleLine, RiArrowLeftSLine, RiArrowRightDoubleLine, RiArrowRightSLine } from '@remixicon/react';

/* ------------------------------------------------------------------ */
interface Props {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  setCurrentPage: (page: number) => void;
}

/* ------------------------------------------------------------------ */
/** Simple previous / current / next control used in Orders view. */
export default function PaginationBar({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onFirst,
  onLast,
  setCurrentPage,
}: Props) {
  /* Hide the bar when there's only one page */
  if (totalPages <= 1) return null;

  // Calculate the range of pages to display
  // The pages are displayed as <Pagination.Item>2</Pagination.Item>
  // The current page is displayed as <Pagination.Item current>4</Pagination.Item>
  // There should be ... between the pages if there are more than 5 pages

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const currentPageIndex = pages.indexOf(currentPage);

  // Calculate which pages to display
  const getPagesToDisplay = () => {
    const maxVisiblePages = 10; // Maximum number of page numbers to show
    const pagesToShow: (number | '...')[] = [];

    // If total pages is less than or equal to maxVisiblePages, show all pages
    if (totalPages <= maxVisiblePages) {
      return pages;
    }

    // Always show first page
    pagesToShow.push(1);

    // Calculate how many pages to show on each side of current page
    const sidePages = Math.floor((maxVisiblePages - 3) / 2); // -3 for first, last, and current page
    const startPage = Math.max(2, currentPage - sidePages);
    const endPage = Math.min(totalPages - 1, currentPage + sidePages);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pagesToShow.push('...');
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pagesToShow.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pagesToShow.push('...');
    }

    // Always show last page
    pagesToShow.push(totalPages);

    return pagesToShow;
  };

  const pagesToDisplay = getPagesToDisplay();

  return (
    <div className="mt-4 flex items-center justify-center border-t border-stroke-soft-200 pt-4">
      <Pagination.Root>
        <Pagination.NavButton onClick={onFirst}>
          <Pagination.NavIcon as={RiArrowLeftDoubleLine} />
        </Pagination.NavButton>
        <Pagination.NavButton onClick={onPrev}>
          <Pagination.NavIcon as={RiArrowLeftSLine} />
        </Pagination.NavButton>

        {/* pages */}
        {pagesToDisplay.map((page, index) => (
          page === '...' ? (
            <Pagination.Item key={`ellipsis-${index}`} disabled>
              ...
            </Pagination.Item>
          ) : (
            <Pagination.Item
              key={page}
              current={page === currentPage}
              onClick={() => setCurrentPage(page as number)}
            >
              {page}
            </Pagination.Item>
          )
        ))}


        <Pagination.NavButton onClick={onNext}>
          <Pagination.NavIcon as={RiArrowRightSLine} />
        </Pagination.NavButton>
        <Pagination.NavButton onClick={onLast}>
          <Pagination.NavIcon as={RiArrowRightDoubleLine} />
        </Pagination.NavButton>
      </Pagination.Root>
    </div>
  );
}
