'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RiSearchLine } from '@remixicon/react';
import { Input } from '@/components/ui/input';
import * as SelectPrimitive from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface ProjectSearchBarProps {
  onSearch: (term: string) => void;
  onFilterChange?: (filterType: string, value: string) => void;
  searchTerm?: string;
  resetKey?: number;
}

export function ProjectSearchBar({
  onSearch,
  onFilterChange,
  searchTerm: externalSearchTerm,
  resetKey = 0
}: ProjectSearchBarProps) {
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

    // Only set timeout if there's a search term or it was cleared
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

  // Handle filter changes (add logic here if needed)
  const handleFilterChange = (filterType: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(filterType, value);
    }
  };

  return (
    <div className='mb-4 rounded-xl bg-[#E1E4EA] px-6 py-5'> {/* Adjust background color if needed */}
      <div className='flex flex-nowrap items-center gap-[8px]'>
        {/* Search Input */}
        <div className='relative flex-grow sm:flex-grow-0 sm:basis-1/3 max-w-[310px] '>
          <RiSearchLine className='absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#525866]' />
          <Input
            type='search'
            placeholder={t('projects.search.placeholder')}
            className='hover:border-none hover:placeholder:text-[#525866] w-full max-w-[310px] rounded-[10px] border font-[400] border-[#CACFD8] bg-white py-2 pl-9 pr-3 text-[14px] text-[#99A0AE] hover:bg-[#F6F8FA] placeholder:text-[#99A0AE]' // Adjusted styles
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Deadline Dropdown */}
        <SelectPrimitive.Root onValueChange={(value) => handleFilterChange('deadline', value)}>
          <SelectPrimitive.Trigger className='w-full sm:flex-none sm:w-[200px] rounded-[0.6rem] bg-white px-3 py-2 text-[14px] data-[placeholder]:!text-[#000000] hover:text-[#525866]'>
            <SelectPrimitive.Value className='hover:text-[#525866]' placeholder={t('projects.search.deadline')} />
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Content>
            <SelectPrimitive.Item value='urgent'>{t('projects.search.urgent')}</SelectPrimitive.Item>
            <SelectPrimitive.Item value='week'>{t('projects.search.withinWeek')}</SelectPrimitive.Item>
            <SelectPrimitive.Item value='month'>{t('projects.search.withinMonth')}</SelectPrimitive.Item>
          </SelectPrimitive.Content>
        </SelectPrimitive.Root>

        {/* Purpose Dropdown */}
        <SelectPrimitive.Root onValueChange={(value) => handleFilterChange('purpose', value)}>
          <SelectPrimitive.Trigger
            className='w-full sm:flex-none sm:w-[200px] rounded-[0.6rem] border border-[#E1E4EA] bg-white px-3 py-2 text-[14px] data-[placeholder]:!text-[#000000] hover:text-[#525866]'>
            <SelectPrimitive.Value className='hover:text-[#525866]' placeholder={t('projects.search.purpose')} />
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Content>
            <SelectPrimitive.Item value='mixing'>{t('projects.search.mixing')}</SelectPrimitive.Item>
            <SelectPrimitive.Item value='mastering'>{t('projects.search.mastering')}</SelectPrimitive.Item>
            <SelectPrimitive.Item value='songwriting'>{t('projects.search.songwriting')}</SelectPrimitive.Item>
          </SelectPrimitive.Content>
        </SelectPrimitive.Root>

        {/* Posting Date Dropdown */}
        <SelectPrimitive.Root onValueChange={(value) => handleFilterChange('postingDate', value)}>
          <SelectPrimitive.Trigger className='w-full sm:flex-none sm:w-[200px] rounded-[0.6rem] bg-white px-3 py-2 text-[14px] data-[placeholder]:!text-[#000000] hover:text-[#525866]'>
            <SelectPrimitive.Value className='hover:text-[#525866]' placeholder={t('projects.search.postingDate')} />
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Content>
            <SelectPrimitive.Item value='today'>{t('projects.search.today')}</SelectPrimitive.Item>
            <SelectPrimitive.Item value='last_week'>{t('projects.search.last7Days')}</SelectPrimitive.Item>
            <SelectPrimitive.Item value='last_month'>{t('projects.search.last30Days')}</SelectPrimitive.Item>
          </SelectPrimitive.Content>
        </SelectPrimitive.Root>
      </div>
    </div>
  );
}
