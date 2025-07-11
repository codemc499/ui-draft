'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn, Controller } from 'react-hook-form';
import {
  Root as Select,
  Content as SelectContent,
  Item as SelectItem,
  Trigger as SelectTrigger,
  Value as SelectValue,
} from '@/components/ui/select';
import * as Tag from '@/components/ui/tag';
import * as Input from '@/components/ui/input';
import * as Textarea from '@/components/ui/textarea';
import * as Avatar from '@/components/ui/avatar';
import { Root as Label } from '@/components/ui/label';
import { SendOfferFormData } from '../schema';
import { cn } from '@/utils/cn';
import type { User, Job } from '@/utils/supabase/types'; // Import User and Job types
import { RiCloseLine } from '@remixicon/react';

// Use Omit to exclude handleSubmit and other methods not needed directly here
type FormMethods = Omit<UseFormReturn<SendOfferFormData>, 'handleSubmit'>;

// Update props interface
interface JobDetailsSectionProps {
  form: FormMethods;
  sellers: Pick<User, 'id' | 'username' | 'full_name'>[]; // Add sellers prop
  jobs: Pick<Job, 'id' | 'title'>[]; // Add jobs prop
  isLoading: boolean; // Add isLoading prop
  sellerId: string;
}

export function JobDetailsSection({
  form,
  sellers,
  jobs,
  isLoading, // Destructure new props
  sellerId,
}: JobDetailsSectionProps) {
  const { t } = useTranslation('common');

  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;
  const inputStyles = Input.inputVariants();

  const description = watch('description');
  const contractTitle = watch('contractTitle');
  type SkillLevel = 'Trainee' | 'Director' | 'Skilled' | 'Expert';
  const skillLevelOptions = [
    { label: 'Trainee', value: 'Trainee' as SkillLevel },
    { label: 'Director', value: 'Director' as SkillLevel },
    { label: 'Skilled', value: 'Skilled' as SkillLevel },
    { label: 'Expert', value: 'Expert' as SkillLevel },
  ];

  useEffect(() => {
    if (sellerId && sellers.find(s => s.id === sellerId)) {
      setValue('sendTo', sellerId);
    }
  }, [sellerId, sellers, setValue]);

  const handleSkillLevelSelect = (value: string) => {
    const currentSkillLevels = getValues('skillLevels') || [];
    if (!currentSkillLevels.includes(value as SkillLevel)) {
      setValue('skillLevels', [...currentSkillLevels, value as SkillLevel], {
        shouldValidate: true,
      });
    }
  };
  const handleRemoveSkillLevel = (value: SkillLevel) => {
    const currentSkillLevels = getValues('skillLevels') || [];
    setValue(
      'skillLevels',
      currentSkillLevels.filter((level) => level !== value),
      { shouldValidate: true },
    );
  };

  const watchSkillLevels = watch('skillLevels') || [];

  return (
    <div className='space-y-6'>
      <h2 className='text-[32px] font-semibold text-[#0E121B]'>{t('offers.jobDetails.title')}</h2>

      {/* Send & Select Order */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='flex flex-col gap-1'>
          <Label htmlFor='sendTo' className='text-[#0E121B] text-[14px] font-medium'>{t('offers.jobDetails.sendTo')}</Label>
          <Controller
            name='sendTo'
            control={control}

            defaultValue={sellerId}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}

                disabled={isLoading || sellers.length === 0}
              >
                <SelectTrigger className='hover:bg-white hover:border hover:border-[#E1E4EA] !border-[#E1E4EA]'>
                  <SelectValue
                    placeholder={
                      isLoading ? t('offers.jobDetails.loadingSellers') : t('offers.jobDetails.selectRecipient')
                    }
                  >
                    <Tag.Root variant='stroke' className='border-[#E1E4EA] hover:border-none hover:bg-[#F5F7FA] !pointer-events-auto'>
                      <div className='flex items-center gap-1 rounded-md p-1'>
                        <Avatar.Root className='size-4 text-[10px]' color='yellow'>
                          {sellers.find((seller) => seller.id === field.value)?.full_name.charAt(0)}
                        </Avatar.Root>
                        <p>{sellers.find((seller) => seller.id === field.value)?.full_name}</p>
                      </div>
                    </Tag.Root>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {sellers.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.full_name}
                    </SelectItem>
                  ))}
                  {!isLoading && sellers.length === 0 && (
                    <div className='text-sm text-text-tertiary-500 px-2 py-1.5'>
                      {t('offers.jobDetails.noSellers')}
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.sendTo && (
            <p className='text-sm mt-1 text-red-500 text-[14px]'>{errors.sendTo.message}</p>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <Label htmlFor='selectOrder' className='text-[#0E121B] text-[14px] font-medium'>{t('offers.jobDetails.relatedJob')}</Label>
          <Controller
            name='selectOrder'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading || jobs.length === 0}
              >
                <SelectTrigger className=''>
                  <SelectValue
                    placeholder={
                      isLoading ? t('offers.jobDetails.loadingJobs') : t('offers.jobDetails.selectJobTitle')
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                  {!isLoading && jobs.length === 0 && (
                    <div className='text-sm text-text-tertiary-500 px-2 py-1.5'>
                      {t('offers.jobDetails.noJobs')}
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.selectOrder && (
            <p className='text-sm mt-1 text-red-500 text-[14px]'>
              {errors.selectOrder.message}
            </p>
          )}
        </div>
      </div>

      {/* Contract Title */}
      <div className='flex flex-col gap-1 mt-[20px]'>
        <Label htmlFor='contractTitle' className='text-[#0E121B] text-[14px] font-medium'>{t('offers.jobDetails.contractTitle')}</Label>

        <Input.Root>
          <Input.Wrapper>
            <Input.Input
              id='contractTitle'
              placeholder={t('offers.jobDetails.contractTitlePlaceholder')}
              {...register('contractTitle')}
            />
          </Input.Wrapper>
        </Input.Root>
        {errors.contractTitle && (
          <p className='text-sm mt-1 text-red-500 text-[14px]'>
            {errors.contractTitle.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className='flex flex-col gap-1 mt-[20px]'>
        <Label htmlFor='description' className='text-[#0E121B] text-[14px] font-medium'>{t('offers.jobDetails.description')}</Label>
        <Textarea.Root
          id='description'
          rows={4}
          placeholder={t('offers.jobDetails.descriptionPlaceholder')}
          className='resize-none'
          {...register('description')}
        >
          <Textarea.CharCounter current={description?.length || 0} max={1000} />
        </Textarea.Root>
        {errors.description && (
          <p className='text-sm mt-1 text-red-500 text-[14px]'>
            {errors.description.message}
          </p>
        )}
      </div>

      <div className='flex flex-col gap-1 mt-[20px]'>
        <div className='flex items-center gap-1'>
          <Label htmlFor='description' className='text-[#525866] text-[14px] font-medium'>{t('offers.jobDetails.skillLevels')}</Label>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7 13.25C10.4518 13.25 13.25 10.4518 13.25 7C13.25 3.54822 10.4518 0.75 7 0.75C3.54822 0.75 0.75 3.54822 0.75 7C0.75 10.4518 3.54822 13.25 7 13.25ZM8.11584 10.2086L8.21565 9.8006C8.16399 9.82486 8.0807 9.85258 7.96649 9.88414C7.85197 9.9157 7.7489 9.93177 7.65831 9.93177C7.46536 9.93177 7.32952 9.90014 7.25065 9.83657C7.17236 9.773 7.13331 9.65342 7.13331 9.47827C7.13331 9.40887 7.14509 9.30542 7.16973 9.17003C7.19361 9.03373 7.22108 8.91261 7.25161 8.80666L7.62419 7.48759C7.66068 7.36653 7.68571 7.23344 7.69916 7.08818C7.71292 6.94325 7.71932 6.84185 7.71932 6.78429C7.71932 6.50614 7.62182 6.28041 7.42676 6.10629C7.2317 5.93229 6.95393 5.84529 6.59396 5.84529C6.39365 5.84529 6.18188 5.88088 5.95776 5.952C5.73363 6.02294 5.49933 6.1084 5.25421 6.2082L5.15415 6.6165C5.22719 6.58949 5.31419 6.56043 5.41598 6.53034C5.51732 6.50038 5.61674 6.48489 5.71347 6.48489C5.91096 6.48489 6.04399 6.51856 6.1137 6.58488C6.18342 6.65139 6.21844 6.7697 6.21844 6.93883C6.21844 7.03236 6.20736 7.13626 6.18438 7.24919C6.16172 7.36282 6.13342 7.48298 6.10013 7.6098L5.72595 8.93419C5.69266 9.07336 5.66834 9.19787 5.65304 9.30843C5.63786 9.41886 5.63057 9.52724 5.63057 9.63262C5.63057 9.90482 5.73114 10.1292 5.93222 10.3063C6.13329 10.4826 6.41523 10.5714 6.77769 10.5714C7.01372 10.5714 7.22088 10.5406 7.39917 10.4785C7.57727 10.4167 7.81644 10.3268 8.11584 10.2086ZM8.04946 4.8502C8.22352 4.68882 8.31014 4.49254 8.31014 4.26272C8.31014 4.03341 8.22365 3.83675 8.04946 3.67331C7.87584 3.51032 7.66657 3.42857 7.4219 3.42857C7.17646 3.42857 6.96635 3.51013 6.79107 3.67331C6.61579 3.83675 6.52796 4.03334 6.52796 4.26272C6.52796 4.49254 6.61579 4.68875 6.79107 4.8502C6.96667 5.01217 7.17639 5.09321 7.4219 5.09321C7.66664 5.09321 7.87584 5.01217 8.04946 4.8502Z" fill="#CACFD8" />
          </svg>
        </div>
        <Controller
          name='skillLevels'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col gap-1'>
              <Select value='' onValueChange={handleSkillLevelSelect}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={t('offers.jobDetails.selectSkillLevels')} />
                </SelectTrigger>
                <SelectContent>
                  {skillLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className='mt-2 flex flex-wrap gap-2'>
                {watchSkillLevels.map((level) => (
                  <Tag.Root key={level} variant='stroke'>
                    {level}
                    <button
                      type='button'
                      onClick={() => handleRemoveSkillLevel(level)}
                      className='ml-1 inline-flex items-center text-[#99A0AE] hover:text-[#525866]'
                      aria-label={t('offers.jobDetails.remove')}

                    >
                      <RiCloseLine size={14} className='' />
                    </button>
                  </Tag.Root>
                ))}
              </div>

              {errors.skillLevels && (
                <p className='text-xs mt-1 text-red-500 text-[14px]'>
                  {Array.isArray(errors.skillLevels)
                    ? errors.skillLevels[0]?.message
                    : errors.skillLevels.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}
