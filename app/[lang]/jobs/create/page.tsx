'use client';

import React, { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { usePathname } from 'next/navigation';
import VerticalStepper from '@/components/jobs/create/VerticalStepper';
import CreateJobMainContent from '@/components/jobs/create/CreateJobMainContent';
import Step1BasicInfoForm from '@/components/jobs/create/Step1BasicInfoForm';
import Step2SkillsForm from '@/components/jobs/create/Step2SkillsForm';
import Step3UsageForm from '@/components/jobs/create/Step3UsageForm';
import Step4Preview from '@/components/jobs/create/Step4Preview';
import { useCreateJobForm } from '@/hooks/useCreateJobForm';
import * as AlertUI from '@/components/ui/alert';
import { RiErrorWarningLine, RiCheckboxCircleLine } from '@remixicon/react';

// Alert component for form submission status
const FormAlert = ({
  error,
  success,
}: {
  error: string | null;
  success: boolean;
}) => {
  const { t } = useTranslation('common');

  if (error) {
    return (
      <AlertUI.Root
        className='mb-4'
        status='error'
        variant='lighter'
        size='small'
      >
        <AlertUI.Icon as={RiErrorWarningLine} />
        <div className='flex flex-col space-y-1'>
          <h5 className='font-medium'>{t('jobs.create.page.error')}</h5>
          <p className='text-paragraph-xs'>{error}</p>
        </div>
      </AlertUI.Root>
    );
  }

  if (success) {
    return (
      <AlertUI.Root
        className='mb-4'
        status='success'
        variant='lighter'
        size='small'
      >
        <AlertUI.Icon as={RiCheckboxCircleLine} />
        <div className='flex flex-col space-y-1'>
          <h5 className='font-medium'>{t('jobs.create.page.success')}</h5>
          <p className='text-paragraph-xs'>
            {t('jobs.create.page.successMessage')}
          </p>
        </div>
      </AlertUI.Root>
    );
  }

  return null;
};

export default function CreateJobPage() {
  const { t } = useTranslation('common');
  const pathname = usePathname();
  const [, lang] = pathname.split('/');

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const {
    activeStep,
    setActiveStep,
    formMethods,
    onSubmit,
    nextStep,
    prevStep,
    isSubmitting,
    error,
    success,
  } = useCreateJobForm();

  // Define steps configuration using extracted components
  const stepsConfig = [
    {
      title: t('jobs.create.page.steps.basicInfo'),
      content: (
        <Step1BasicInfoForm formMethods={formMethods} nextStep={nextStep} />
      ),
    },
    {
      title: t('jobs.create.page.steps.skills'),
      content: (
        <Step2SkillsForm
          formMethods={formMethods}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      ),
    },
    {
      title: t('jobs.create.page.steps.usage'),
      content: (
        <Step3UsageForm
          formMethods={formMethods}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      ),
    },
    {
      title: t('jobs.create.page.steps.preview'),
      content: (
        <Step4Preview
          formMethods={formMethods}
          prevStep={prevStep}
          submitForm={onSubmit}
          isSubmitting={isSubmitting}
          error={error}
          success={success}
        />
      ),
    },
  ];

  const stepLabels = stepsConfig.map((s) => s.title);

  return (
    <FormProvider {...formMethods}>
      <FormAlert error={error} success={success} />

      <div className='bg-bg-subtle-100 flex flex-1 gap-6 px-4 py-6 md:px-10'>
        <VerticalStepper
          currentStep={activeStep}
          steps={stepLabels}
          onStepClick={setActiveStep}
        />
        <CreateJobMainContent
          steps={stepsConfig}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </div>
    </FormProvider>
  );
}
