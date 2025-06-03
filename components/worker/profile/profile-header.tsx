'use client';

import React from 'react';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import { RiStarFill, RiGoogleFill, RiExternalLinkLine } from '@remixicon/react';
import { useTranslation } from 'react-i18next';

// Define a type for the worker data subset needed by the header
interface WorkerHeaderData {
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  isGoogle: boolean;
  // Add other fields if needed, e.g., social links
}

interface ProfileHeaderProps {
  worker: WorkerHeaderData;
  // Add any necessary action handlers as props, e.g., onContact, onHire
}

export function ProfileHeader({ worker }: ProfileHeaderProps) {
  const { t } = useTranslation('common');

  return (
    <div className='mb-8 flex flex-col items-center gap-4 md:flex-row md:items-start'>
      <Avatar.Root size='80'>
        <Avatar.Image src={worker.avatar} alt={worker.name} />
        {/* Static online indicator for now */}
        <Avatar.Indicator
          position='bottom'
          className='translate-x-1 translate-y-1'
        >
          <div className='size-5 rounded-full bg-green-500 ring-2 ring-white' />
        </Avatar.Indicator>
      </Avatar.Root>
      <div className='flex-1 text-center md:text-left'>
        <h1 className='text-2xl md:text-3xl font-semibold text-text-strong-950'>
          {worker.name}
        </h1>
        <div className='text-sm text-text-secondary-600 mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 md:justify-start'>
          <div className='flex items-center gap-1'>
            <RiStarFill className='size-4 text-yellow-400' />
            <span>
              {worker.rating} ({t('worker.profile.reviews', { count: worker.reviewCount })})
            </span>
          </div>
          {worker.isGoogle && (
            <div className='flex items-center gap-1'>
              <RiGoogleFill className='size-4 text-red-500' />
              <span>{t('worker.profile.googleVerified')}</span>
            </div>
          )}
          {/* Add other indicators like location, joined date etc. */}
        </div>
        {/* TODO: Add Social Links display */}
      </div>
      <div className='flex gap-2'>
        {/* TODO: Add onClick handlers */}
        <Button.Root variant='neutral' mode='stroke'>
          {t('worker.profile.actions.contact')}
        </Button.Root>
        <Button.Root variant='primary' mode='filled'>
          {t('worker.profile.actions.hire')}
        </Button.Root>
        {/* Add more action buttons like Follow, Share etc. */}
      </div>
    </div>
  );
}
