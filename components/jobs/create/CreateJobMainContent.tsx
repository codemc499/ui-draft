'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Accordion from '@/components/ui/accordion';
import { RiArrowDownSLine } from '@remixicon/react';

// --- Main Content Component ---
interface CreateJobMainContentProps {
  steps: { title: string; content?: React.ReactNode }[];
  activeStep: number;
  setActiveStep: (step: number) => void;
}

const CreateJobMainContent = ({
  steps,
  activeStep,
  setActiveStep,
}: CreateJobMainContentProps) => {
  const { t } = useTranslation('common');

  // Local state for the accordion's open item value
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    `item-${activeStep}`,
  );

  // Effect to sync accordion when activeStep prop changes (e.g., from VerticalStepper)
  useEffect(() => {
    setAccordionValue(`item-${activeStep}`);
  }, [activeStep]);

  // Handle accordion changes locally
  const handleValueChange = (value: string) => {
    setAccordionValue(value); // Directly set the accordion value (can be empty string to close)
    // Do NOT call setActiveStep here - let VerticalStepper manage the main step
  };

  return (
    <main className='mx-auto flex-1 px-4 pb-6 md:px-10 flex flex-col items-center max-w-[600px] ml-[165px]'>
      {' '}
      {/* Added flex-1 */}
      <h1 className='text-[32px] font-medium text-[#0A0D14]'>
        {t('jobs.create.title')}
      </h1>
      <p className='text-[#525866] text-[18px] mb-8 font-medium'>
        {t('jobs.create.subtitle')}
      </p>
      <Accordion.Root
        type='single'
        collapsible
        className='w-full max-w-2xl space-y-9'
        value={accordionValue} // Controlled by local state
        onValueChange={handleValueChange} // Updates local state
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const itemValue = `item-${stepNumber}`;
          return (
            <Accordion.Item
              value={itemValue}
              key={stepNumber}
              className={`overflow-hidden rounded-3xl border !bg-white !border-[#E1E4EA] !px-0 data-[state=open]:shadow-[0px_2px_4px_#0E121B08,0px_6px_10px_#0E121B0F] data-[state=closed]:shadow-none !ring-0 !ring-offset-0`}
            >
              <Accordion.Trigger className='!p-4 !mx-0 group/trigger flex w-full items-center justify-between text-left' onClick={() => setActiveStep(stepNumber)}>
                {' '}
                {/* Added group */}
                <div className='flex items-center gap-3'>
                  <div className='flex size-10 items-center justify-center rounded-full bg-white text-[#0E121B] text-[14px] font-medium border border-[border-[#E1E4EA]'>
                    {String(stepNumber).padStart(2, '0')}
                  </div>
                  <span className='text-[14px] font-medium text-[#0E121B]'>
                    {step.title}
                  </span>
                </div>
                <div className='flex items-center justify-center size-6 rounded-md border border-[#E1E4EA] hover:bg-[#F6F8FA] hover:border-none'>
                  <RiArrowDownSLine className='text-[#525866] size-5 transition-transform duration-200 group-data-[state=open]/trigger:rotate-180' />{' '}
                </div>
                {/* Use group state */}
              </Accordion.Trigger>
              <Accordion.Content className='pt-4 pb-0 mt-2 border-t border-[#E1E4EA] !shadow-xl'>
                {/* Render content only if this item is the active one conceptually */}
                {/* This prevents mounting/unmounting form state, but Accordion handles visibility */}
                {step.content || <p>{t('jobs.create.contentPlaceholder', { title: step.title })}</p>}
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </main>
  );
};

export default CreateJobMainContent;
