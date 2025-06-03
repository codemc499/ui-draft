'use client';

import React from 'react';
import Link from 'next/link';
import * as Tabs from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import * as DatePicker from '@/components/ui/datepicker';
import * as Dropdown from '@/components/ui/dropdown';
import * as Button from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  RiCalendarLine,
  RiFilter3Line,
  RiSortAsc,
  RiSearch2Line,
  RiArrowDownSLine,      // ← search icon
} from '@remixicon/react';
import Image from 'next/image';
import calendarIcon from '@/assets/images/icons/calendar.svg';

interface Props {
  activeTab: string;
  setActiveTab: (v: string) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (d: Date | undefined) => void;
  sortOption: string;
  setSortOption: (v: string) => void;
  isBuyer: boolean;
  onSellerFilter?: () => void;
}

/* ------------------------------------------------------------ */
/* Tabs row + search + filters / sort                            */
/* ------------------------------------------------------------ */
export default function TabsFiltersBar({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  setSortOption,
  isBuyer,
  onSellerFilter,
}: Props) {
  const { t } = useTranslation('common');

  return (
    <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        {/* ---------------- Tabs ---------------- */}
        <Tabs.List className="flex rounded-lg bg-[#F5F7FA] p-1 h-auto">
          {['all', ...(isBuyer ? ['inProgress', 'completed'] : ['active', 'inactive'])].map(
            (key) => (
              <Tabs.Trigger
                key={key}
                value={key}
                className={
                  key === 'all'
                    ? 'rounded-lg px-12 py-1.5 text-[14px] text-[#99A0AE] font-medium data-[state=active]:bg-white data-[state=active]:text-[#0E121B] !data-[state=active]:shadow-md hover:text-[#525866]'
                    : key === 'inProgress'
                      ? 'rounded-lg px-4 py-1.5 text-[14px] text-[#99A0AE] font-medium data-[state=active]:bg-white data-[state=active]:text-[#0E121B] !data-[state=active]:shadow-md hover:text-[#525866]'
                      : key === 'completed'
                        ? 'rounded-lg px-4 py-1.5 text-[14px] text-[#99A0AE] font-medium data-[state=active]:bg-white data-[state=active]:text-[#0E121B] !data-[state=active]:shadow-md hover:text-[#525866]'
                        : 'rounded-lg px-8 py-1.5 text-[14px] text-[#99A0AE] font-medium data-[state=active]:bg-white data-[state=active]:text-[#0E121B] !data-[state=active]:shadow-md hover:text-[#525866]  '}
              >
                {t(`tabsFiltersBar.tabs.${key}`)}
              </Tabs.Trigger>
            ),
          )}
        </Tabs.List>

        {/* -------- Search + filters -------- */}
        <div className="flex gap-2 items-center">
          {/* Search */}
          <div className="relative lg:w-[300px] !hover:text-[#525866] !hover:placeholder:text-[#525866] hover:bg-[#F5F7FA] rounded-lg !hover:border-none text-[#868C98] group">
            <RiSearch2Line className=" absolute left-2 top-1/2 -translate-y-1/2 size-4 text-[#868C98] group-hover:text-[#525866]" />
            <Input
              placeholder={t('tabsFiltersBar.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#E1E4EA] hover:border-none hover:placeholder:text-[#525866] pl-8 pr-3 text-[12px] placeholder:text-[#868C98] focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {isBuyer ? (
            /* Buyer – date picker */
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <button className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-2 text-[14px] text-gray-500 transition-colors hover:bg-bg-neutral-subtle-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:border-white hover:bg-[#F5F7FA] hover:text-[#0E121B]">
                  {/* <Image src={calendarIcon} alt={t('tabsFiltersBar.calendar.alt')} width={20} height={20} /> */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.332 1.66667V4.16667" stroke="#868C98" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M2.91797 7.575H17.0846" stroke="#868C98" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M17.5 7.08334V14.1667C17.5 16.6667 16.25 18.3333 13.3333 18.3333H6.66667C3.75 18.3333 2.5 16.6667 2.5 14.1667V7.08334C2.5 4.58334 3.75 2.91667 6.66667 2.91667H13.3333C16.25 2.91667 17.5 4.58334 17.5 7.08334Z" stroke="#868C98" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M13.0801 11.4167H13.0875" stroke="#868C98" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M13.0801 13.9167H13.0875" stroke="#868C98" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9.99803 11.4167H10.0055" stroke="#868C98" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9.99803 13.9167H10.0055" stroke="#868C98" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.91209 11.4167H6.91957" stroke="#868C98" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.91209 13.9167H6.91957" stroke="#868C98" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  {selectedDate ? selectedDate.toLocaleDateString() : t('tabsFiltersBar.calendar.selectDate')}
                </button>
              </Dropdown.Trigger>
              <Dropdown.Content align="start" className="w-auto p-0">
                <DatePicker.Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </Dropdown.Content>
            </Dropdown.Root>
          ) : (
            /* Seller – Filter button */
            <Button.Root variant='neutral' mode='stroke' size='small' className='text-gray-500 text-[14px] font-medium'>
              <Button.Icon as={RiFilter3Line} className="w-5 h-5 text-gray-600" />
              {t('tabsFiltersBar.filter')}
            </Button.Root>
          )}

          {/* Sort */}
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <Button.Root variant='neutral' mode='stroke' size='small' className='text-gray-500 text-[14px] font-normal'>
                <Button.Icon as={RiSortAsc} className="w-4 h-5 text-gray-600" />
                {t('tabsFiltersBar.sort.label')}
                <Button.Icon as={RiArrowDownSLine} className='w-4 h-5 text-[#99A0AE]' />
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align="end">
              <Dropdown.Item onSelect={() => setSortOption('date_asc')}>
                {t('tabsFiltersBar.sort.dateAsc')}
              </Dropdown.Item>
              <Dropdown.Item onSelect={() => setSortOption('date_desc')}>
                {t('tabsFiltersBar.sort.dateDesc')}
              </Dropdown.Item>
              <Dropdown.Item onSelect={() => setSortOption('name_asc')}>
                {t('tabsFiltersBar.sort.nameAsc')}
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      </div>
    </Tabs.Root>
  );
}
