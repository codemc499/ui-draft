'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Button from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { RiArrowRightSLine, RiHeadphoneLine } from '@remixicon/react';
import { notification } from '@/hooks/use-notification';

// --- Vertical Stepper Component ---
interface VerticalStepperProps {
  currentStep: number;
  steps: string[];
  onStepClick: (step: number) => void;
}

const VerticalStepper = ({
  currentStep,
  steps,
  onStepClick,
}: VerticalStepperProps) => {
  const { t } = useTranslation('common');

  const handleContactClick = () => {
    notification({
      description: t('jobs.create.stepper.contactSuccess.description'),
    });
  };

  return (
    <aside className='pt-6 shadow-sm sticky top-20 hidden h-[calc(100vh-10rem)] w-64 shrink-0 flex-col justify-between rounded-xl bg-[#F5F7FA] p-4 lg:flex xl:w-72 max-w-[264px]'>
      <div className=''>
        <p className='text-[16px] text-[#99A0AE] mb-4 font-medium'>
          {t('jobs.create.stepper.sequence')}
        </p>
        <nav>
          <ul className='flex flex-col gap-1'>
            {steps.map((label, index) => {
              const stepNumber = index + 1;
              return (
                <li key={label}>
                  <button
                    onClick={() => onStepClick(stepNumber)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-label-md transition-colors duration-200',
                      stepNumber === currentStep
                        ? 'bg-white font-medium text-[#0E121B] text-[14px]'
                        : 'font-medium text-[#525866] text-[14px]',
                    )}
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={cn(
                          'flex size-6 items-center justify-center rounded-full text-label-xs font-medium',
                          stepNumber === currentStep
                            ? 'text-[12px] text-white bg-black'
                            : 'text-[12px] text-[#525866] bg-white',
                        )}
                      >
                        {String(stepNumber)}
                      </div>
                      {label}
                    </div>
                    {stepNumber === currentStep && (
                      <RiArrowRightSLine className='text-[#525866] size-5' />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      {/* Contact Button */}
      <div className='mt-auto pt-4'>
        <p className='text-[14px] text-[#525866] mb-4 text-center'>
          {t('jobs.create.stepper.trouble')}
        </p>
        <Button.Root
          variant='neutral'
          mode='stroke'
          className='w-full font-medium text-[#525866]'
          onClick={handleContactClick}
        >
          <Button.Icon as={RiHeadphoneLine} />
          {t('jobs.create.stepper.contact')}
        </Button.Root>
      </div>
    </aside>
  );
};

export default VerticalStepper;
