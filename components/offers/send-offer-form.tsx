'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { SendOfferFormData } from './schema';
import { useSendOfferForm } from '@/hooks/useSendOfferForm';
import { jobOperations } from '@/utils/supabase/database';

// Import UI components
// Import Root as Alert based on ui/alert.tsx structure
import { Root as Alert } from '@/components/ui/alert';
// Remove lucide-react import - not found and Alert might handle icons
// import { Terminal } from 'lucide-react';
// Spinner component not found in ui directory - Placeholder needed
// import { Spinner } from '@/components/ui/spinner';

// Import section components
import { JobDetailsSection } from './form-sections/job-details-section';
import { ContractTermsSection } from './form-sections/contract-terms-section';
import { AttachmentsSection } from './form-sections/attachments-section';
import { AgreementSection } from './form-sections/agreement-section';
import { FormActions } from './form-sections/form-actions';

interface SendOfferFormProps {
  sellerId?: string; // Make sellerId optional if it's not always needed or comes from route
  // Add other props like default values, user details etc. if necessary
}

export function SendOfferForm({ sellerId }: SendOfferFormProps) {
  const { t } = useTranslation('common');

  // Use the custom hook to manage form state and logic
  const {
    formMethods,
    onSubmit,
    isSubmitting,
    isLoadingSellers,
    isLoadingJobs,
    error,
    success,
    sellers,
    jobs,
    isUploadingFiles,
    setIsUploadingFiles,
  } = useSendOfferForm();

  // Add null check for formMethods
  if (!formMethods) {
    // Handle the case where the hook hasn't returned the methods yet
    // You might want a more sophisticated loading indicator
    return <div>{t('offers.sendOfferForm.loading')}</div>;
  }

  // Get watch function to monitor paymentType changes
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    register,
    formState,
  } = formMethods;
  const { errors } = formState; // Explicitly get errors from formState
  const paymentType = watch('paymentType'); // Watch paymentType from react-hook-form state

  // ADD THIS LOG:
  console.log('Form Validation Errors:', errors);

  // Optional: Handle Cancel action
  const handleCancel = () => {
    console.log('Form cancelled');
    // Add navigation logic if needed (e.g., router.back() from next/navigation)
  };

  const isLoadingData = isLoadingSellers || isLoadingJobs;


  // 1) watch the selected job ID
  const selectedJobId = watch('selectOrder');

  // 2) fetch when it changes
  useEffect(() => {
    if (!selectedJobId) return;
    console.log('→ selectedJobId changed:', selectedJobId);

    jobOperations.getJobById(selectedJobId).then((job) => {
      console.log('→ fetched job record:', job);

      if (!job) return;
      // before setValue, log what you're about to set:
      console.log('→ populating form with:',
        {
          contractTitle: job.title,
          description: job.description,
          amount: job.budget,
          currency: job.currency,
          deadline: job.deadline,
          attachments: job.files,
        }
      );

      setValue('attachments', []);
      setValue('contractTitle', job.title);
      setValue('description', job.description || '');
      setValue('amount', job.budget ?? 0);
      setValue('currency', job.currency);
      setValue('deadline', job.deadline ? new Date(job.deadline) : undefined);
      setValue('attachments', job.files || []);
    });
  }, [selectedJobId, setValue]);


  return (
    // Pass formMethods down, sections can destructure what they need
    <form onSubmit={handleSubmit(onSubmit)} className='relative space-y-8'>
      {/* Loading Overlay - Placeholder for Spinner */}
      {isLoadingData && (
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/50'>
          {/* <Spinner size="large" /> */}
          <p>{t('offers.sendOfferForm.loadingData')}</p> {/* Removed ml-2 as spinner is missing */}
        </div>
      )}

      {/* Error Alert - Using Root as Alert */}
      {error && (
        <Alert status='error' size='small' className='items-center'>
          <div>
            <p className='font-medium'>{t('offers.sendOfferForm.error')}</p>
            <p className='text-sm'>{error}</p>
          </div>
        </Alert>
      )}

      {/* Success Alert - Using Root as Alert */}
      {success && (
        <Alert status='success' size='small' className='items-center'>
          <div>
            <p className='font-medium'>{t('offers.sendOfferForm.success')}</p>
            <p className='text-sm'>{t('offers.sendOfferForm.offerSent')}</p>
          </div>
        </Alert>
      )}

      {/* Disable form sections while loading initial data */}
      <fieldset
        disabled={isLoadingData || isSubmitting || isUploadingFiles}
        className='space-y-8'
      >
        <JobDetailsSection
          form={formMethods}
          sellers={sellers}
          jobs={jobs}
          isLoading={isLoadingData}
          sellerId={sellerId ?? ''}
        />

        <ContractTermsSection form={formMethods} paymentType={paymentType} />

        <AttachmentsSection
          form={formMethods}
          setIsUploadingFiles={setIsUploadingFiles}
        />

        <AgreementSection form={formMethods} />
      </fieldset>

      <FormActions
        isSubmitting={isSubmitting || isUploadingFiles}
        onCancel={handleCancel}
      />
    </form>
  );
}
