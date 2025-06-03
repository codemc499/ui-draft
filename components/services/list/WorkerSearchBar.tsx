'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RiSearchLine } from '@remixicon/react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface WorkerSearchBarProps {
  onSearch?: (term: string) => void;
  searchTerm?: string;
  resetKey?: number;
}

export function WorkerSearchBar({
  onSearch,
  searchTerm: externalSearchTerm,
  resetKey = 0
}: WorkerSearchBarProps) {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const prevSearchTerm = useRef(searchTerm);
  const isInitialMount = useRef(true);

  // Reset search input when resetKey changes
  useEffect(() => {
    if (resetKey > 0) {
      setSearchTerm('');
    }
  }, [resetKey]);

  // Update internal state when external search term changes
  useEffect(() => {
    if (externalSearchTerm !== undefined && externalSearchTerm !== searchTerm) {
      setSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);

  // Implement improved debounced search
  useEffect(() => {
    // Skip if no search handler provided
    if (!onSearch) return;

    // Skip if it's the initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevSearchTerm.current = searchTerm;
      return;
    }

    // Skip if the search term hasn't changed
    if (prevSearchTerm.current === searchTerm) {
      return;
    }

    // Update previous search term
    prevSearchTerm.current = searchTerm;

    // Clear previous timeout if it exists
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
      searchTimeout.current = null;
    }

    // Set new timeout to trigger search after 2 seconds
    searchTimeout.current = setTimeout(() => {
      onSearch(searchTerm);
    }, 2000);

    // Cleanup function
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
        searchTimeout.current = null;
      }
    };
  }, [searchTerm]); // Removed onSearch from dependencies

  return (
    <div className="mb-4 mx-[16px]">
      <div className="relative w-full">
        <RiSearchLine
          className="absolute left-[12px] top-1/2 w-[20px] h-[20px] -translate-y-1/2 text-[#99A0AE]"
        />
        <Input
          type="search"
          placeholder={t('workers.search.placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`
            w-full
            h-[40px]
            rounded-[10px]
            border border-[#CACFD8]
            bg-[#FFFFFF]
            pl-[40px]  /* 12px padding + 20px icon + 8px gap */
            pr-[10px]  /* right padding 10px */
            text-[14px] leading-[20px]
            text-[#99A0AE]
            placeholder:text-[#99A0AE]
            hover:bg-[#F6F8FA]
          `}
        />
      </div>
    </div>
  );
}