'use client';

import React from 'react';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Badge from '@/components/ui/badge'; // Assuming Badge is used for awards/tags
import {
  RiStarFill,
  RiGoogleFill,
  RiTwitchFill,
  RiTwitterXFill,
  // Add other icons if needed for social links
} from '@remixicon/react';
import Link from 'next/link';
import { User } from '@/utils/supabase/types'; // Import User type
import { useTranslation } from 'react-i18next';

// Define types for the data needed by the sidebar - REMOVE THESE
// interface WorkerSkill {
//   name: string;
//   details?: string;
//   price?: string;
//   contactForPricing?: boolean;
// }
//
// interface WorkerSidebarData {
//   name: string;
//   avatar: string;
//   rating: number;
//   reviewCount: number;
//   isGoogle: boolean;
//   socialLinks?: string[]; // Array of social platform names e.g., ['twitch', 'twitter']
//   skills: WorkerSkill[];
//   awards: string[];
//   // Add other fields like 'about description snippet' if needed
// }

interface ProfileSidebarProps {
  // worker: WorkerSidebarData; // Change prop type
  user: User; // Use User type
  // Add action handlers if needed e.g., onContact, onHire
}

export function ProfileSidebar({ user }: ProfileSidebarProps) { // Destructure user
  const { t } = useTranslation('common');

  // Helper to get social icon (simplified)
  // const getSocialIcon = (platform: string) => { // Keep for now, but won't be used immediately
  //   switch (platform) {
  //     case 'twitch':
  //       return <RiTwitchFill className='size-5 text-[#6441A5]' />;
  //     case 'twitter':
  //       return <RiTwitterXFill className='size-5 text-black' />;
  //     case 'google':
  //       return <RiGoogleFill className='text-icon-secondary-400 size-5' />;
  //     default:
  //       return null;
  //   }
  // };

  // --- Placeholder data until fetched ---
  const placeholderRating = 4.5; // Example
  const placeholderReviewCount = 0; // Example
  // const placeholderSkills: { name: string, details?: string, price?: string, contactForPricing?: boolean }[] = []; // Remove this placeholder
  // const placeholderAwards: string[] = []; // Remove this placeholder
  const placeholderSocialLinks: string[] = []; // Keep this for now
  const placeholderIsGoogleVerified = false; // Keep this for now
  // --- End Placeholder data ---

  // --- Restore Mock Skills & Awards ---
  const mockSkills = [
    { name: 'Singer', details: 'Female', price: '$150 per song' },
    { name: 'Songwriter', details: 'Lyric', contactForPricing: true },
    {
      name: 'Top-line writer',
      details: 'vocal melody',
      contactForPricing: true,
    },
    { name: 'Vocal Tuning', details: '', contactForPricing: true },
  ];
  const mockAwards = [
    'Grammy',
    'Billboard Music',
    'American Music',
    'BRIT',
    'MTV Music',
    'Eurovision Awards',
  ];
  // --- End Restore Mock Skills & Awards ---


  return (
    <div className='shadow-sm rounded-xl border border-stroke-soft-200 bg-bg-white-0'>
      {/* Profile Section */}
      <div className='flex flex-col items-center border-b border-stroke-soft-200 p-6 text-center'>
        <Avatar.Root size='80'>
          {/* Use user.avatar_url, provide fallback */}
          <Avatar.Image src={user.avatar_url || '/images/default-avatar.png'} alt={user.full_name || user.username} />
          <Avatar.Indicator
            position='bottom'
            className='translate-x-1 translate-y-1'
          >
            <div className='size-4 rounded-full bg-green-500 ring-2 ring-white' />
          </Avatar.Indicator>
        </Avatar.Root>

        <h1 className='text-xl mt-3 font-semibold text-text-strong-950'>
          {/* Use user.full_name or username */}
          {user.full_name || user.username}
        </h1>

        <div className='mt-1 flex items-center gap-1'>
          <RiStarFill className='size-4 text-yellow-400' />
          <span className='text-sm text-text-secondary-600'>
            {placeholderRating.toFixed(1)} ({t('worker.profile.reviews', { count: placeholderReviewCount })})
          </span>
        </div>

        {/* Placeholder/Conditional for Google Verified */}
        {placeholderIsGoogleVerified && (
          <div className='text-sm text-text-secondary-600 mt-1 flex items-center gap-1'>
            <RiGoogleFill className='size-4 text-red-500' />
            <span>{t('worker.profile.google')}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className='mt-4 flex w-full gap-2'>
          <Button.Root variant='primary' mode='filled' className='flex-1'>
            {t('worker.profile.actions.hire')}
            {/* <Button.Icon as={RiExternalLinkLine} /> */}
          </Button.Root>
          <Button.Root variant='neutral' mode='stroke' className='flex-1'>
            {t('worker.profile.actions.contact')}
            {/* <Button.Icon as={RiExternalLinkLine} /> */}
          </Button.Root>
        </div>
        {/* Social Links - Placeholder/Conditional */}
        {placeholderSocialLinks && placeholderSocialLinks.length > 0 && (
          <div className='mt-4 flex items-center justify-center gap-3'>
            {/* {placeholderSocialLinks.map((link) => (
              <Link key={link} href='#' className='hover:opacity-80'>
                {' '}
                {getSocialIcon(link)}
              </Link>
            ))} */}
            <span className="text-xs text-text-secondary-400">{t('worker.profile.socialLinksUnavailable')}</span>
          </div>
        )}
      </div>

      {/* Skills Section - Restore original structure with mock data */}
      <div className='border-b border-stroke-soft-200 p-4'>
        <h2 className='mb-3 text-label-lg font-medium text-text-strong-950'>
          {t('worker.profile.skills')}
        </h2>
        <div className='space-y-2'>
          {mockSkills.map((skill, idx) => (
            <div key={idx}>
              <p className='text-sm font-medium text-text-strong-950'>
                {skill.name}
                {skill.details ? ` - ${skill.details}` : ''}
              </p>
              {skill.price && (
                <p className='text-xs text-text-secondary-600'>{skill.price}</p>
              )}
              {skill.contactForPricing && (
                <p className='text-xs text-text-primary-600'>
                  {t('worker.profile.contactForPricing')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Awards Section - Restore original structure with mock data */}
      <div className='p-4'>
        <h2 className='mb-3 text-label-lg font-medium text-text-strong-950'>
          {t('worker.profile.awards')}
        </h2>
        <div className='flex flex-wrap gap-1.5'>
          {mockAwards.map((award, idx) => (
            <Badge.Root key={idx} variant='light' size='small'>
              {award}
            </Badge.Root>
          ))}
        </div>
      </div>

      {/* Consider adding About snippet here if needed */}
    </div>
  );
}
