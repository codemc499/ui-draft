'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import * as Button from '@/components/ui/button';
import * as Tag from '@/components/ui/tag';
import { CreateJobFormData } from '@/app/[lang]/jobs/create/schema';
import { RiLoader4Line } from '@remixicon/react';
import { cn } from '@/utils/cn';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Divider from '@/components/ui/divider';
import { format } from 'date-fns';
import {
  Root as Tooltip,
  Content as TooltipContent,
  Trigger as TooltipTrigger,
} from '@/components/ui/tooltip';

interface Step4Props {
  formMethods: UseFormReturn<CreateJobFormData>;
  prevStep: () => void;
  submitForm: (data: CreateJobFormData) => void;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

const Step4Preview: React.FC<Step4Props> = ({
  formMethods,
  prevStep,
  submitForm,
  isSubmitting,
  error,
  success,
}) => {
  const { t } = useTranslation('common');
  const { getValues, handleSubmit, formState: { isValid, errors } } = formMethods;

  const formData = getValues();

  const discountCode = 'codeabcde';
  const discountAmount = 20;

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return '-';
    try {
      return format(new Date(deadline), 'MMMM d, yyyy');
    } catch (e) {
      return '-';
    }
  };

  const getUsageDescription = (option?: string) => {
    if (option === 'private')
      return t('jobs.create.usage.private.description');
    if (option === 'business')
      return t('jobs.create.usage.business.description');
    return t('jobs.create.usage.notSpecified');
  };

  const getPrivacyDescription = (option?: string) => {
    if (option === 'public') return t('jobs.create.privacy.public.description');
    if (option === 'private')
      return t('jobs.create.privacy.private.description');
    return t('jobs.create.privacy.notSpecified');
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return `$${value.toFixed(2)}`;
  };

  const finalAmount = (formData.budget || 0) - discountAmount;
  console.log(formData)

  // Get missing required fields
  const getMissingFields = () => {
    const missingFields = [];
    if (!formData.title) missingFields.push(t('jobs.create.step1.subject'));
    if (!formData.description) missingFields.push(t('jobs.create.step1.detail'));
    if (!formData.budget || formData.budget <= 0) missingFields.push(t('jobs.create.step1.amount'));
    if (!formData.skill_levels?.length) missingFields.push(t('jobs.create.step2.skillLevels'));
    if (!formData.candidate_sources?.length) missingFields.push(t('jobs.create.step2.candidateSources'));
    return missingFields;
  };

  const missingFields = getMissingFields();
  const isFormValid = isValid && missingFields.length === 0;

  return (
    <div className='flex flex-col'>
      {/* Step 1 Basic */}

      <div className='flex flex-col'>
        <div className='w-full bg-[#F5F7FA] text-[#99A0AE] text-[12px] py-2 px-4'>
          {t('jobs.create.step1.title')}
        </div>
        <div className='p-4'>
          <p className='text-[14px] text-[#525866] font-medium'>
            {formData.description || t('jobs.create.step1.descriptionPlaceholder')}
          </p>
        </div>

      </div>
      <div className='flex flex-col'>
        <div className='w-full bg-[#F5F7FA] text-[#99A0AE] text-[12px] py-2 px-4'>
          {t('jobs.create.step2.title')}
        </div>
        <div className='p-2 flex flex-col gap-3 p-4'>
          <div className='flex flex-row justify-between items-start'>
            <p className='text-[#525866] text-[14px]'>{t('jobs.create.step2.experienceLevels')}</p>
            <div className='flex flex-wrap gap-2 max-w-[200px] justify-end'>
              {formData.skill_levels.map((skillLevel) => (
                <Tag.Root key={skillLevel} variant='stroke'>
                  {skillLevel}
                </Tag.Root>
              ))}
            </div>
          </div>
          <div className='flex flex-row justify-between items-start'>
            <p className='text-[#525866] text-[14px]'>{t('jobs.create.step2.candidateSources')}</p>
            <div className='flex flex-wrap gap-2 max-w-[200px] justify-end'>
              {formData.candidate_sources.map((candidateSource) => (
                <Tag.Root key={candidateSource} variant='stroke'>
                  {candidateSource}
                </Tag.Root>
              ))}
            </div>
          </div>
          <div className='flex flex-row justify-between items-start'>
            <p className='text-[#525866] text-[14px]'>{t('jobs.create.step2.files')}</p>
            <div className='flex flex-col gap-1'>
              {formData.files.map((file) => (
                <p key={file.url} className='text-[#525866] text-[14px]'>{file.name}</p>
              ))}
            </div>
          </div>

        </div>
      </div>
      <div className='flex flex-col'>
        <div className='w-full bg-[#F5F7FA] text-[#99A0AE] text-[12px] py-2 px-4'>
          {t('jobs.create.step3.title')}
        </div>
        <div className='p-2 flex flex-col gap-3 p-4'>
          <div className='flex flex-col gap-1'>
            <p className='text-[#525866] text-[14px] font-medium capitalize'>{formData.usageOption}</p>
            <p className='text-[#525866] text-[12px]'>{getUsageDescription(formData.usageOption)}</p>
          </div>
          <div className='flex flex-col gap-1'>
            <p className='text-[#525866] text-[14px] font-medium capitalize'>{formData.privacyOption}</p>
            <p className='text-[#525866] text-[12px]'>{getPrivacyDescription(formData.privacyOption)}</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='w-full bg-[#F5F7FA] text-[#99A0AE] text-[12px] py-2 px-4'>
          {t('jobs.create.step4.title')}
        </div>
        <div className='p-2 flex flex-col gap-2 p-4'>
          <div className='flex flex-row justify-between items-center'>
            <p className='text-[#525866] font-normal text-[14px]'>{t('jobs.create.step4.deadline')}</p>
            <p className='text-[#0E121B] text-[14px]'>{formatDeadline(formData.deadline)}</p>
          </div>
          <div className='flex flex-row justify-between items-center'>
            <p className='text-[#525866] font-normal text-[14px]'>{t('jobs.create.step4.orderAmount')}</p>
            <p className='text-[#0E121B] text-[14px]'>{formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : formData.currency === 'GBP' ? '£' : '$'}{formData.budget || '-'}</p>
          </div>
          <div className='flex flex-row justify-between items-center'>
            <p className='text-[#525866] font-normal text-[14px]'>{t('jobs.create.step4.discount')} <span className='font-normal text-[#99A0AE] text-[12px]'>{discountCode}</span></p>
            <p className='text-[#0E121B] text-[14px]'>-{formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : '$'}{discountAmount || '-'}</p>
          </div>
          <div className='flex flex-row justify-between items-end mt-2'>
            <p className='text-[#525866] text-[14px]'>{t('jobs.create.step4.amountPaid')}</p>
            <p className='text-[#0E121B] text-[24px]'>{formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : formData.currency === 'GBP' ? '£' : '$'}{formData.budget - discountAmount || '-'}</p>
          </div>

        </div>
      </div>


      {/* Display Error Message */}
      {error && (
        <div className='text-sm rounded-md border border-red-200 bg-red-50 p-3 text-red-700'>
          <p>{t('jobs.create.error')}: {error}</p>
        </div>
      )}

      {/* Display Success Message */}
      {success && (
        <div className='text-sm rounded-md border border-green-200 bg-green-50 p-3 text-green-700'>
          <p>{t('jobs.create.success')}</p>
        </div>
      )}

      <Divider.Root className='w-full' />

      {/* Navigation/Action Buttons */}
      <div className='flex justify-between gap-3 px-4 pt-4'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          onClick={prevStep}
          className='flex-1 !rouneded-[8px]'
          type='button'
          disabled={isSubmitting}
        >
          {t('jobs.create.draft')}
        </Button.Root>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex-1">
              <FancyButton.Root
                variant='neutral'
                onClick={handleSubmit(submitForm)}
                className='flex w-full items-center !rouneded-[8px] justify-center'
                type='submit'
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? (
                  <RiLoader4Line className='mr-2 size-4 animate-spin' />
                ) : null}
                {isSubmitting ? t('jobs.create.posting') : t('jobs.create.post')}
              </FancyButton.Root>
            </div>
          </TooltipTrigger>
          {!isFormValid && (
            <TooltipContent>
              <p className="text-sm">
                {t('jobs.create.requiredFields')}: {missingFields.join(', ')}
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
};

export default Step4Preview;
