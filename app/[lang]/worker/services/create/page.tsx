'use client';

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Step1BasicInfo } from '@/components/worker/create-service-step-1';
import { Step2Pricing } from '@/components/worker/create-service-step-2';
import { Step3Review } from '@/components/worker/create-service-step-3';
import { useCreateServiceForm } from '@/hooks/useCreateServiceForm';
import { Stepper } from '@/components/worker/stepper';
import { useTranslation } from 'react-i18next';

export default function CreateServicePage() {
  const {
    activeStep,
    formMethods,
    onSubmit,
    nextStep,
    prevStep,
    isSubmitting,
  } = useCreateServiceForm();

  const { t } = useTranslation();

  const steps = [
    t('worker.services.create.page.steps.terms'),
    t('worker.services.create.page.steps.submit'),
    t('worker.services.create.page.steps.review')
  ];

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <Step1BasicInfo formMethods={formMethods} nextStep={nextStep} />;
      case 2:
        return (
          <Step2Pricing
            formMethods={formMethods}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Step3Review
            formMethods={formMethods}
            prevStep={prevStep}
            submitForm={formMethods.handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='px-4 py-2 md:px-10'>

      {activeStep < 3 && (
        <Stepper
          steps={steps}
          currentStep={activeStep}
        />
      )}
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          {renderStep()}
        </form>
      </FormProvider>
    </div>
  );
}
