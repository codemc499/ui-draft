import React from 'react';
import { RiCheckLine } from '@remixicon/react';
import { cn } from '@/utils/cn';
import * as Divider from '@/components/ui/divider';
import Translate from '@/components/Translate';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className='flex flex-col items-center mt-10'>
      <div className='mb-2 flex items-center justify-center gap-4'>
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={label}>
              <div className='flex items-center gap-2'>
                <div
                  className={cn(
                    'flex size-6 items-center justify-center rounded-full text-[12px] font-medium',
                    isCompleted
                      ? 'bg-[#1FC16B] text-static-white' :
                      stepNumber === currentStep ? 'text-white bg-[#335CFF]'
                        : 'text-[#5C5C5C] bg-white border border-[#E1E4EA]',
                  )}
                >
                  {isCompleted ? <RiCheckLine className='size-5 ' /> : stepNumber}
                </div>
                <span
                  className={cn(
                    'text-[14px]',
                    isCompleted || stepNumber === currentStep
                      ? 'text-[#0E121B]'
                      : 'text-[#525866]',
                  )}
                >
                  <Translate id={`worker.services.create.stepper.step${stepNumber}`} />
                </span>
              </div>
              {stepNumber < steps.length && (
                <div className='h-px w-12 bg-stroke-soft-200'></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <Divider.Root className='w-[60%] pb-12' />
    </div>
  );
}
