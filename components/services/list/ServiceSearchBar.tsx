'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RiSearchLine } from '@remixicon/react'; // Removed RiArrowDownSLine as Select likely includes it
import { Input } from '@/components/ui/input';
import * as SelectPrimitive from '@/components/ui/select'; // Import as namespace
import { useTranslation } from 'react-i18next';

interface ServiceSearchBarProps {
  onSearch: (term: string) => void;
  onFilterChange?: (filterType: string, value: string) => void;
  searchTerm?: string; // Add prop to receive search term value
  resetKey?: number; // Add prop to trigger reset when filters are cleared
}


export function ServiceSearchBar({
  onSearch,
  onFilterChange,
  searchTerm: externalSearchTerm,
  resetKey = 0
}: ServiceSearchBarProps) {
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
    // Skip if it's the initial mount or if the search term hasn't changed
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

    // Only set timeout if there's a search term or it was cleared (to handle empty search)
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

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(filterType, value);
    }
  };


  return (
    <div className='mb-[24px] rounded-lg bg-[#E1E4EA] px-6 py-5'>
      <div className='flex flex-nowrap items-center gap-[8px]'>
        {/* Search Input */}
        <div className='relative flex-grow sm:flex-grow-0 sm:basis-1/3 max-w-[310px]'>
          <RiSearchLine className='absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#525866]' />
          <Input
            type="search"
            placeholder={t('services.search.placeholder')}
            className="w-full max-w-[310px] rounded-[10px] border font-[400] border-gray-300 bg-white py-2 pl-9 pr-3 text-[14px] text-[#99A0AE] hover:bg-[#F6F8FA] hover:text-text-strong-950 transition-colors duration-150"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Real-time Dropdown */}
        <SelectPrimitive.Root onValueChange={(value) => handleFilterChange('leadTime', value)}>
          <SelectPrimitive.Trigger className="w-full sm:flex-none sm:w-[200px] rounded-[0.6rem] border border-[#E1E4EA] bg-white px-3 py-2 text-[14px] data-[placeholder]:!text-[#000000] group-data-[placeholder]/trigger:!text-black-400">
            <SelectPrimitive.Value placeholder={t('services.search.leadTime')} />
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Content>
            <SelectPrimitive.Item value="7">{t('services.search.days', { count: 7 })}</SelectPrimitive.Item>
            <SelectPrimitive.Item value="14">{t('services.search.days', { count: 14 })}</SelectPrimitive.Item>
            <SelectPrimitive.Item value="30">{t('services.search.days', { count: 30 })}</SelectPrimitive.Item>
          </SelectPrimitive.Content>
        </SelectPrimitive.Root>

        {/* Price Range Dropdown */}
        <SelectPrimitive.Root onValueChange={(value) => handleFilterChange('priceRange', value)}>
          <SelectPrimitive.Trigger className="w-full sm:flex-none sm:w-[200px] rounded-[0.6rem] border border-[#E1E4EA] bg-white px-3 py-2 text-[14px] data-[placeholder]:!text-[#000000]">
            <SelectPrimitive.Value placeholder={t('services.search.priceRange')} />
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Content>
            <SelectPrimitive.Item value="low">{t('services.search.priceRanges.low')}</SelectPrimitive.Item>
            <SelectPrimitive.Item value="medium">{t('services.search.priceRanges.medium')}</SelectPrimitive.Item>
            <SelectPrimitive.Item value="high">{t('services.search.priceRanges.high')}</SelectPrimitive.Item>
          </SelectPrimitive.Content>
        </SelectPrimitive.Root>

        {/* Sort Dropdown */}
        <SelectPrimitive.Root onValueChange={(value) => handleFilterChange('sort', value)}>
          <SelectPrimitive.Trigger className="w-full sm:flex-none sm:w-[200px] rounded-[0.6rem] border border-[#E1E4EA] bg-white px-3 py-2 text-[14px] data-[placeholder]:!text-[#000000]">
            <SelectPrimitive.Value placeholder={t('services.search.sortBy')} />
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Content>
            <SelectPrimitive.Item value="newest">{t('services.search.sortOptions.newest')}</SelectPrimitive.Item>
            <SelectPrimitive.Item value="oldest">{t('services.search.sortOptions.oldest')}</SelectPrimitive.Item>
            <SelectPrimitive.Item value="price_asc">{t('services.search.sortOptions.priceAsc')}</SelectPrimitive.Item>
            <SelectPrimitive.Item value="price_desc">{t('services.search.sortOptions.priceDesc')}</SelectPrimitive.Item>
          </SelectPrimitive.Content>
        </SelectPrimitive.Root>
      </div>
    </div>
  );
}
