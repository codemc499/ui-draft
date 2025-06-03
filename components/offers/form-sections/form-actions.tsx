'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Root as Button } from '@/components/ui/button';
// import { Loader2 } from 'lucide-react'; // Or your preferred spinner
import * as FancyButton from '@/components/ui/fancy-button';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel?: () => void; // Optional cancel handler
}

export function FormActions({ isSubmitting, onCancel }: FormActionsProps) {
  const { t } = useTranslation('common');

  return (
    <div className='flex gap-2 w-full'>
      <Button
        type='button'
        disabled={isSubmitting}
        className='text-black w-1/2 rounded-md border border-[#E1E4EA] bg-white px-4 py-2 hover:bg-gray-50 hover:border-none hover:bg-[#F5F7FA]'
        onClick={onCancel} // Add cancel handler if provided
      >
        {t('offers.formActions.cancel')}
      </Button>
      <FancyButton.Root
        type='submit'
        disabled={isSubmitting}
        className='w-1/2 min-w-[100px]' // Added min-width
      >
        {isSubmitting ? (
          <>
            {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
            <span className='animate-pulse'>{t('offers.formActions.sending')}</span>
          </>
        ) : (
          t('offers.formActions.continue')
        )}
      </FancyButton.Root>
    </div>
  );
}
