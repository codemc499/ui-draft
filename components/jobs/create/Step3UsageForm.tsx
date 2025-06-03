'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn, Controller } from 'react-hook-form';
import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import { CreateJobFormData } from '@/app/[lang]/jobs/create/schema';
import FormFieldError from './FormFieldError';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Divider from '@/components/ui/divider';

interface Step3Props {
  formMethods: UseFormReturn<CreateJobFormData>;
  nextStep: () => void;
  prevStep: () => void;
}

const Step3UsageForm: React.FC<Step3Props> = ({
  formMethods,
  nextStep,
  prevStep,
}) => {
  const { t } = useTranslation('common');
  const {
    control,
    formState: { errors },
  } = formMethods;

  return (
    <form onSubmit={(e) => e.preventDefault()} className='space-y-3'>
      {/* Usage Section - Using Controller for custom radio group */}
      <Controller
        name='usageOption'
        control={control}
        render={({ field }) => (
          <div className='px-5'>
            <h3 className='mb-2 mt-1 text-[12px] text-[#99A0AE] font-medium uppercase bg-[#F5F7FA] rounded-md w-full px-3 py-2' style={{ letterSpacing: '0.05em', lineHeight: '16px' }}>
              {t('jobs.create.usage.title')}
            </h3>
            <div className=''>
              {/* Private Usage Option */}
              <label
                className='flex cursor-pointer items-start gap-3 rounded-lg py-2 transition-colors'
                data-checked={field.value === 'private'}
              >
                <Checkbox.Root
                  id='usage-private'
                  value='private'
                  checked={field.value === 'private'}
                  className='mt-[-2px]'
                  onCheckedChange={() => field.onChange('private')}
                  ref={field.ref}
                />
                <div className='grid gap-1'>
                  <span className='text-[14px] font-medium text-[#525866] leading-none'>
                    {t('jobs.create.usage.private.title')}
                  </span>
                  <span className='text-[12px] text-[#525866] font-normal'>
                    {t('jobs.create.usage.private.description')}
                  </span>
                </div>
              </label>
              {/* Business Usage Option */}
              <label
                className='flex cursor-pointer items-start gap-3 rounded-lg py-2 transition-colors'
                data-checked={field.value === 'business'}
              >
                <Checkbox.Root
                  id='usage-business'
                  value='business'
                  className='mt-[-2px]'
                  checked={field.value === 'business'}
                  onCheckedChange={() => field.onChange('business')}
                />
                <div className='grid gap-1'>
                  <span className='text-[14px] font-medium text-[#525866] leading-none'>
                    {t('jobs.create.usage.business.title')}
                  </span>
                  <span className='text-[12px] text-[#525866] font-normal'>
                    {t('jobs.create.usage.business.description')}
                  </span>
                </div>
              </label>
            </div>
            <FormFieldError error={errors.usageOption} />
          </div>
        )}
      />

      {/* Privacy Section - Using Controller */}
      <Controller
        name='privacyOption'
        control={control}
        render={({ field }) => (
          <div className='px-5'>
            <h3 className='mb-2 text-[12px] text-[#99A0AE] font-medium uppercase bg-[#F5F7FA] rounded-md w-full px-3 py-2' style={{ letterSpacing: '0.05em', lineHeight: '16px' }}>
              {t('jobs.create.privacy.title')}
            </h3>
            <div className=''>
              {/* Public Privacy Option */}
              <label
                className=' flex cursor-pointer items-start gap-3 rounded-lg py-2 transition-colors '
                data-checked={field.value === 'public'}
              >
                <Checkbox.Root
                  id='privacy-public'
                  value='public'
                  className='mt-[-2px]'
                  checked={field.value === 'public'}
                  onCheckedChange={() => field.onChange('public')}
                  ref={field.ref}
                />
                <div className='grid gap-1'>
                  <span className='text-[14px] font-medium text-[#525866] leading-none'>
                    {t('jobs.create.privacy.public.title')}
                  </span>
                  <span className='text-[12px] text-[#525866] font-normal'>
                    {t('jobs.create.privacy.public.description')}
                  </span>
                </div>
              </label>
              {/* Private Privacy Option */}
              <label
                className='flex cursor-pointer items-start gap-3 rounded-lg py-2 transition-colors'
                data-checked={field.value === 'private'}
              >
                <Checkbox.Root
                  id='privacy-private'
                  className='mt-[-2px]'
                  value='private'
                  checked={field.value === 'private'}
                  onCheckedChange={() => field.onChange('private')}
                />
                <div className='grid gap-1'>
                  <span className='text-[14px] font-medium text-[#525866] leading-none'>
                    {t('jobs.create.privacy.private.title')}
                  </span>
                  <span className='text-[12px] text-[#525866] font-normal'>
                    {t('jobs.create.privacy.private.description')}
                  </span>
                </div>
              </label>
            </div>
            <FormFieldError error={errors.privacyOption} />
          </div>
        )}
      />

      <Divider.Root className='w-full' />

      {/* Navigation */}
      <div className='flex justify-between !mt-4 px-4'>
        <Button.Root variant='neutral' mode='stroke' onClick={prevStep}>
          {t('jobs.create.previous')}
        </Button.Root>
        <FancyButton.Root variant='neutral' onClick={nextStep}>
          {t('jobs.create.next')}
        </FancyButton.Root>
      </div>
    </form>
  );
};

export default Step3UsageForm;
