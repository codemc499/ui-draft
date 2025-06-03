'use client';

import React from 'react';
import Link from 'next/link';

import * as Avatar from '@/components/ui/avatar';
import * as Divider from '@/components/ui/divider';
import * as Badge from '@/components/ui/badge';
import {
  RiStarFill,
  RiHomeLine,
  RiFileList2Line,
  RiChat1Line,
  RiCouponLine,
  RiQuestionLine,
  RiPencilLine,
  RiTwitchFill,
  RiTwitterXFill,
  RiGoogleFill,
  RiMoneyDollarCircleLine,
  RiBriefcaseLine,
  RiSparklingLine,
} from '@remixicon/react';
import { cn } from '@/utils/cn';

// --- Helper Components and Interfaces ---
interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-label-md transition-colors duration-200',
        // Add active state styles if needed based on current route
      )}
    >
      <Icon className={cn('size-5')} />
      {label}
    </Link>
  );
};

// --- Worker Dashboard Sidebar ---
export function WorkerSidebar() {
  // TODO: Replace with actual user data fetching
  const user = {
    name: 'Cleve Music',
    avatarUrl: 'https://via.placeholder.com/80',
    rating: 4.9,
    reviews: 125,
  };

  // TODO: Replace with actual tags data fetching
  const tags = [
    'Grammy',
    'Billboard Music',
    'American Music',
    'BRIT',
    'MTV Music',
    'Eurovision Awards',
  ];

  return (
    <aside className='hidden w-64 shrink-0 lg:block xl:w-72'>
      <div className='shadow-sm sticky top-20 flex flex-col gap-6 rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-4 pb-4'>
        {/* Profile Section */}
        <div className='flex flex-col items-center gap-3 pb-6 pt-4'>
          <Avatar.Root size='80'>
            <Avatar.Image src={user.avatarUrl} alt={user.name} />
            <Avatar.Indicator position='bottom'>
              <Avatar.Status status='online' />
            </Avatar.Indicator>
          </Avatar.Root>
          <div className='text-center'>
            <h2 className='text-label-lg font-medium text-text-strong-950'>
              {user.name}
            </h2>
            <div className='text-text-secondary-600 mt-1 flex items-center justify-center gap-1 text-paragraph-sm'>
              <RiStarFill className='size-4 text-yellow-400' />
              <span>
                {user.rating} ({user.reviews})
              </span>
            </div>
          </div>
          <div className='text-text-secondary-600 flex items-center gap-1.5 text-[11px]'>
            <span className='inline-flex items-center gap-0.5'>
              <RiMoneyDollarCircleLine className='size-3 text-orange-500' />{' '}
              Salary
            </span>
            <span className='inline-flex items-center gap-0.5'>
              <RiBriefcaseLine className='size-3 text-blue-500' /> Work
            </span>
            <span className='inline-flex items-center gap-0.5'>
              <RiSparklingLine className='size-3 text-purple-500' /> Specia
            </span>
          </div>
        </div>
        <Divider.Root />
        {/* Navigation Section */}
        <nav>
          <ul className='flex flex-col gap-1'>
            <li>
              <SidebarLink href='/home' icon={RiHomeLine} label='Home' />
            </li>
            <li>
              <SidebarLink
                href='/worker/orders' // TODO: Update with correct path
                icon={RiFileList2Line}
                label='Order'
              />
            </li>
            <li>
              <SidebarLink
                href='/worker/chat' // TODO: Update with correct path
                icon={RiChat1Line}
                label='Chat'
              />
            </li>
            <li>
              <SidebarLink
                href='/worker/bonus' // TODO: Update with correct path
                icon={RiCouponLine}
                label='Bonus'
              />
            </li>
            <li>
              <SidebarLink
                href='/worker/help' // TODO: Update with correct path
                icon={RiQuestionLine}
                label='Help Center'
              />
            </li>
          </ul>
        </nav>
        <Divider.Root />
        {/* Tags Section */}
        <div>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='text-text-secondary-600 text-label-md font-medium'>
              Tags
            </h3>
            {/* TODO: Implement edit functionality */}
            <button className='text-icon-secondary-400 hover:text-icon-primary-500'>
              <RiPencilLine className='size-4' />
            </button>
          </div>
          <div className='flex flex-wrap gap-1.5'>
            {tags.map((tag, idx) => (
              <Badge.Root
                key={idx}
                variant='stroke'
                size='small'
                className='text-text-secondary-600'
              >
                {tag}
              </Badge.Root>
            ))}
          </div>
        </div>
        <Divider.Root />
        {/* Links Section */}
        <div>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='text-text-secondary-600 text-label-md font-medium'>
              Links
            </h3>
            {/* TODO: Implement edit functionality */}
            <button className='text-icon-secondary-400 hover:text-icon-primary-500'>
              <RiPencilLine className='size-4' />
            </button>
          </div>
          <div className='flex items-center gap-3'>
            {/* TODO: Replace '#' with actual links */}
            <Link href='#' className='text-[#6441A5] hover:opacity-80'>
              <RiTwitchFill className='size-5' />
            </Link>
            <Link href='#' className='text-black hover:opacity-80'>
              <RiTwitterXFill className='size-5' />
            </Link>
            <Link
              href='#'
              className='text-icon-secondary-400 hover:text-icon-primary-500'
            >
              <RiGoogleFill className='size-5' />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
