'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useNotification } from '@/hooks/use-notification';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

import * as Avatar from '@/components/ui/avatar';
import * as Divider from '@/components/ui/divider';
import * as Badge from '@/components/ui/badge';
import {
  RiStarFill,
  RiHomeLine,
  RiFileList2Line,
  RiBriefcaseLine,
  RiChat1Line,
  RiBuildingLine,
  RiCouponLine,
  RiQuestionLine,
  RiArticleLine,
  RiPencilLine,
  RiTwitchFill,
  RiTwitterXFill,
  RiGoogleFill,
} from '@remixicon/react';
import { cn } from '@/utils/cn';
import * as Tag from '@/components/ui/tag';
import { User } from '@/utils/supabase/types';
import SidebarLink from '@/components/layout/SidebarLink';

// --- Helper Components and Interfaces ---

// --- Worker Sidebar Props ---
interface WorkerSidebarProps {
  userProfile: User;
}

// --- Worker Dashboard Sidebar ---
export function WorkerSidebar({ userProfile }: WorkerSidebarProps) {
  const { notification } = useNotification();
  const { t, i18n: i18nInstance } = useTranslation('common');

  const user = {
    name: userProfile.full_name ?? 'User',
    avatarUrl: userProfile.avatar_url ?? '',
    rating: 4.9,
    reviews: 125,
  };

  const tags = [
    'Grammy',
    'Billboard Music',
    'American Music',
    'BRIT',
    'MTV Music',
    'Eurovision Awards',
  ];

  const handleComingSoonClick = () => {
    notification({
      description: t('worker.sidebar.comingSoon.description'),
    });
  };

  return (
    <aside className='hidden w-[300px] shrink-0 lg:block'>
      <div className='sticky top-20 flex flex-col gap-6 border border-stroke-soft-200 bg-bg-white-0 mb-6  max-w-[300px] max-h-[760px] rounded-[20px] pb-6 shadow-[0_2px_4px_0_rgba(14,18,27,0.03),0_6px_10px_0_rgba(14,18,27,0.06)]'>
        {/* Profile Section */}
        <div className='flex flex-col items-center gap-2  mt-6'>
          {user.avatarUrl && user.avatarUrl !== "" ? <Avatar.Root size='64'>
            <Avatar.Image src={user.avatarUrl} alt={user.name} />
            <Avatar.Indicator position='bottom'>
              <Avatar.Status status='online' />
            </Avatar.Indicator>
          </Avatar.Root> :
            <Avatar.Root size='64' color='yellow'>{user.name.charAt(0).toUpperCase()}</Avatar.Root>}
          <div className='text-center'>
            <h2 className='text-[16px] font-medium text-[#525866]'>
              {user.name}
            </h2>
            <div className='text-text-secondary-600 mt-1 flex items-center justify-center gap-1 text-paragraph-sm'>
              <RiStarFill className='size-4 text-yellow-500' />
              <span className='text-[#525866] text-[12px]'>
                {user.rating}({user.reviews})
              </span>
            </div>
          </div>
          <div className='text-text-secondary-600 flex items-center gap-2 mt-1 font-medium'>
            <span className='inline-flex items-center gap-0.5 text-[12px] text-[#525866] hover:bg-[#F6F8FA] rounded-md'>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.99978 5.38672V7.29339L7.32645 7.06005C6.98645 6.94005 6.77979 6.82672 6.77979 6.24672C6.77979 5.77339 7.13312 5.38672 7.56645 5.38672H7.99978Z" fill="#F27B2C" />
                <path d="M10.22 9.75321C10.22 10.2265 9.86667 10.6132 9.43333 10.6132H9V8.70654L9.67333 8.93988C10.0133 9.05988 10.22 9.17321 10.22 9.75321Z" fill="#F27B2C" />
                <path d="M11.2935 1.3335H5.70683C3.28016 1.3335 1.8335 2.78016 1.8335 5.20683V10.7935C1.8335 13.2202 3.28016 14.6668 5.70683 14.6668H11.2935C13.7202 14.6668 15.1668 13.2202 15.1668 10.7935V5.20683C15.1668 2.78016 13.7202 1.3335 11.2935 1.3335ZM10.0068 8.00016C10.5268 8.18016 11.2202 8.56016 11.2202 9.7535C11.2202 10.7802 10.4202 11.6135 9.4335 11.6135H9.00016V12.0002C9.00016 12.2735 8.7735 12.5002 8.50016 12.5002C8.22683 12.5002 8.00016 12.2735 8.00016 12.0002V11.6135H7.76016C6.66683 11.6135 5.78016 10.6868 5.78016 9.5535C5.78016 9.28016 6.00016 9.0535 6.28016 9.0535C6.5535 9.0535 6.78016 9.28016 6.78016 9.5535C6.78016 10.1402 7.22016 10.6135 7.76016 10.6135H8.00016V8.3535L6.9935 8.00016C6.4735 7.82016 5.78016 7.44016 5.78016 6.24683C5.78016 5.22016 6.58016 4.38683 7.56683 4.38683H8.00016V4.00016C8.00016 3.72683 8.22683 3.50016 8.50016 3.50016C8.7735 3.50016 9.00016 3.72683 9.00016 4.00016V4.38683H9.24016C10.3335 4.38683 11.2202 5.3135 11.2202 6.44683C11.2202 6.72016 11.0002 6.94683 10.7202 6.94683C10.4468 6.94683 10.2202 6.72016 10.2202 6.44683C10.2202 5.86016 9.78016 5.38683 9.24016 5.38683H9.00016V7.64683L10.0068 8.00016Z" fill="#F27B2C" />
              </svg>
              {' '}
              {t('worker.salary')}
            </span>
            <span className='inline-flex items-center gap-0.5 text-[12px] text-[#525866] hover:bg-[#F6F8FA] rounded-md'>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_24005_11186)">
                  <path d="M6.59977 4.99316C6.22644 4.99316 5.93311 5.29316 5.93311 5.65983C5.93311 6.0265 6.23311 6.3265 6.59977 6.3265C6.96644 6.3265 7.26644 6.0265 7.26644 5.65983C7.26644 5.29316 6.96644 4.99316 6.59977 4.99316Z" fill="#5A36BF" />
                  <path d="M14.8068 3.36016C14.2468 2.06016 13.0135 1.3335 11.2935 1.3335H5.70683C3.56683 1.3335 1.8335 3.06683 1.8335 5.20683V10.7935C1.8335 12.5135 2.56016 13.7468 3.86016 14.3068C3.98683 14.3602 4.1335 14.3268 4.22683 14.2335L14.7335 3.72683C14.8335 3.62683 14.8668 3.48016 14.8068 3.36016ZM7.52016 8.16016C7.26016 8.4135 6.92016 8.5335 6.58016 8.5335C6.24016 8.5335 5.90016 8.40683 5.64016 8.16016C4.96016 7.52016 4.2135 6.50016 4.50016 5.28683C4.7535 4.18683 5.72683 3.6935 6.58016 3.6935C7.4335 3.6935 8.40683 4.18683 8.66016 5.2935C8.94016 6.50016 8.1935 7.52016 7.52016 8.16016Z" fill="#5A36BF" />
                  <path d="M13.4798 13.6868C13.6264 13.8335 13.6064 14.0735 13.4264 14.1735C12.8398 14.5002 12.1264 14.6668 11.2931 14.6668H5.70643C5.5131 14.6668 5.4331 14.4402 5.56643 14.3068L9.5931 10.2802C9.72644 10.1468 9.9331 10.1468 10.0664 10.2802L13.4798 13.6868Z" fill="#5A36BF" />
                  <path d="M15.1667 5.20643V10.7931C15.1667 11.6264 15 12.3464 14.6733 12.9264C14.5733 13.1064 14.3333 13.1198 14.1867 12.9798L10.7733 9.56643C10.64 9.4331 10.64 9.22643 10.7733 9.0931L14.8 5.06643C14.94 4.9331 15.1667 5.0131 15.1667 5.20643Z" fill="#5A36BF" />
                </g>
                <defs>
                  <clipPath id="clip0_24005_11186">
                    <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
              {t('worker.work')}
            </span>
            <span className='inline-flex items-center gap-0.5 text-[12px] text-[#525866] hover:bg-[#F6F8FA] rounded-md'>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.65327 2.33977L10.8266 4.68643C10.9866 5.0131 11.4133 5.32643 11.7733 5.38643L13.8999 5.73977C15.2599 5.96643 15.5799 6.9531 14.5999 7.92643L12.9466 9.57977C12.6666 9.85977 12.5133 10.3998 12.5999 10.7864L13.0733 12.8331C13.4466 14.4531 12.5866 15.0798 11.1533 14.2331L9.15994 13.0531C8.79994 12.8398 8.20661 12.8398 7.83994 13.0531L5.84661 14.2331C4.41994 15.0798 3.55327 14.4464 3.92661 12.8331L4.39994 10.7864C4.48661 10.3998 4.33327 9.85977 4.05327 9.57977L2.39994 7.92643C1.42661 6.9531 1.73994 5.96643 3.09994 5.73977L5.22661 5.38643C5.57994 5.32643 6.00661 5.0131 6.16661 4.68643L7.33994 2.33977C7.97994 1.06643 9.01994 1.06643 9.65327 2.33977Z" fill="#253EA7" />
              </svg>
              {t('worker.special')}
            </span>
          </div>
        </div>
        <Divider.Root />
        {/* Navigation Section */}
        <nav className='max-w-[300px] max-h-[228px] px-4 '>
          <ul className='flex flex-col gap-1'>
            <li>
              <SidebarLink href={`/${i18n.language}/home`} icon={RiHomeLine} label={t('worker.sidebar.navigation.home')} />
            </li>
            <li>
              <SidebarLink
                href={`/${i18n.language}/settings`}
                icon={RiBriefcaseLine}
                label={t('worker.sidebar.navigation.order')}
              />
            </li>
            <li>
              <SidebarLink
                href={`/${i18n.language}/chats`}
                icon={RiBuildingLine}
                label={t('worker.sidebar.navigation.chat')}
              />
            </li>
            <li>
              <SidebarLink
                onClick={handleComingSoonClick}
                icon={RiBuildingLine}
                label={t('worker.sidebar.navigation.bonus')}
              />
            </li>
            <li>
              <SidebarLink
                onClick={handleComingSoonClick}
                icon={RiArticleLine}
                label={t('worker.sidebar.navigation.helpCenter')}
              />
            </li>
          </ul>
        </nav>
        <Divider.Root />
        {/* Tags Section */}
        <div className='px-4'>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='text-text-secondary-600 text-[#0A0D14] font-medium text-[12px]'>
              {t('worker.sidebar.tags.title')}
            </h3>
            {/* TODO: Implement edit functionality */}
            <button className='text-icon-secondary-400 hover:text-icon-primary-500'>
              <RiPencilLine className='size-5 text-[#99A0AE]' />
            </button>
          </div>
          <div className='flex flex-wrap gap-1.5'>
            {tags.map((tag, idx) => (
              <Tag.Root
                key={idx}
                className='text-[12px] text-[#525866] font-medium font-[500]'
              >
                {tag}
              </Tag.Root>
            ))}
          </div>
        </div>
        <Divider.Root />
        {/* Links Section */}
        <div className='px-5'>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='text-text-secondary-600  text-[#0A0D14]  text-[12px] font-[500]'>
              {t('worker.sidebar.links.title')}
            </h3>
            {/* TODO: Implement edit functionality */}
            <button className='text-icon-secondary-400 hover:text-icon-primary-500'>
              <RiPencilLine className='size-5 text-[#99A0AE]' />
            </button>
          </div>
          <div className='flex items-center gap-3'>
            {/* Placeholder Social Icons */}
            <Link
              href='#'
              className='text-icon-secondary-400 hover:text-icon-primary-500'
            >
              <RiTwitchFill className='size-7 text-[#6441A5]' />
            </Link>
            <Link
              href='#'
              className='text-icon-secondary-400 hover:text-icon-primary-500'
            >
              <RiTwitterXFill className='size-7' />
            </Link>
            <Link
              href='#'
              className='text-icon-secondary-400 hover:text-icon-primary-500'
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.2144 12.0911V16.1575H19.9806C19.7274 17.4652 18.9676 18.5725 17.828 19.317L21.3052 21.9612C23.3312 20.1285 24.5001 17.4366 24.5001 14.2389C24.5001 13.4944 24.4319 12.7784 24.3052 12.0912L14.2144 12.0911Z" fill="#4285F4" />
                <path d="M4.64927 9.29431C3.91879 10.707 3.5 12.3011 3.5 14.0002C3.5 15.6993 3.91879 17.2934 4.64927 18.7061C4.64927 18.7155 8.21429 15.9951 8.21429 15.9951C8 15.3651 7.87334 14.697 7.87334 14.0001C7.87334 13.3032 8 12.635 8.21429 12.005L4.64927 9.29431Z" fill="#FBBC05" />
                <path d="M14.2143 7.68093C15.7923 7.68093 17.1949 8.21546 18.315 9.24639L21.3832 6.2396C19.5228 4.54053 17.1072 3.5 14.2143 3.5C10.026 3.5 6.41241 5.85774 4.64941 9.29413L8.21432 12.0051C9.06168 9.5232 11.4286 7.68093 14.2143 7.68093Z" fill="#EA4335" />
                <path d="M8.20971 15.9987L7.42545 16.587L4.64941 18.7061C6.41241 22.1329 10.0258 24.5002 14.2141 24.5002C17.1069 24.5002 19.5322 23.5647 21.305 21.9611L17.8277 19.317C16.8732 19.947 15.6556 20.3288 14.2141 20.3288C11.4284 20.3288 9.06156 18.4866 8.21409 16.0047L8.20971 15.9987Z" fill="#34A853" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
