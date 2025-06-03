'use client';

import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Group as RadioGroup,
  Item as RadioGroupItem,
} from '@/components/ui/radio';
import { Root as Label } from '@/components/ui/label';
import { SendOfferFormData } from '../schema';
import { OneTimePaymentDetails } from './one-time-payment-details';
import { InstallmentPaymentDetails } from './installment-payment-details';
import { cn } from '@/utils/cn';

type FormMethods = Omit<UseFormReturn<SendOfferFormData>, 'handleSubmit'>;

interface ContractTermsSectionProps {
  form: FormMethods;
  paymentType: 'one-time' | 'installment';
}

export function ContractTermsSection({
  form,
  paymentType,
}: ContractTermsSectionProps) {
  const { t } = useTranslation('common');
  const {
    control,
    formState: { errors },
    setValue,
  } = form;

  return (
    <div className='space-y-6'>
      <h2 className='text-[32px] text-[#0E121B] font-semibold'>{t('offers.contractTerms.title')}</h2>

      {/* Payment Type Selection */}
      <Controller
        name='paymentType'
        control={control}
        render={({ field }) => (
          <RadioGroup
            onValueChange={(value) => {
              const newPaymentType = value as 'one-time' | 'installment';
              field.onChange(newPaymentType);
              if (newPaymentType === 'one-time') {
                setValue('milestones', [], { shouldValidate: true });
              } else {
                setValue('amount', undefined, { shouldValidate: true });
                setValue('deadline', undefined);
                setValue(
                  'milestones',
                  [{ description: '', amount: 0, dueDate: undefined }],
                  { shouldValidate: true }
                );
              }
            }}
            defaultValue={field.value}
            className='grid grid-cols-1 gap-4 md:grid-cols-2'
          >
            <Label
              htmlFor='one-time'
              className={cn(
                'flex cursor-pointer flex-col items-start gap-6 rounded-md border-2 p-4 transition-colors',
                field.value === 'one-time'
                  ? 'border-[#2547D0] bg-[#F5F7FA]'
                  : 'border-[#E1E4EA] hover:border-[#2547D0]',
              )}
            >
              <RadioGroupItem
                value='one-time'
                id='one-time'
                className='sr-only hidden'
              />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.0476 3.01202C6.23964 1.06727 9.06963 -0.00460256 12 1.48563e-05C18.6276 1.48563e-05 24 5.37242 24 12C24.0039 14.4527 23.2527 16.8471 21.8484 18.858L18.6 12H21.6C21.6 10.0912 21.0311 8.22579 19.9657 6.64196C18.9004 5.05812 17.3872 3.82782 15.6192 3.1082C13.8513 2.38859 11.909 2.21234 10.0404 2.60197C8.17182 2.99159 6.4618 3.92941 5.1288 5.29562L4.0488 3.01322L4.0476 3.01202ZM19.9524 20.988C17.7604 22.9328 14.9304 24.0046 12 24C5.3724 24 0 18.6276 0 12C0 9.45002 0.7956 7.08601 2.1516 5.14201L5.4 12H2.4C2.39996 13.9088 2.96894 15.7742 4.03426 17.3581C5.09957 18.9419 6.61284 20.1722 8.38077 20.8918C10.1487 21.6114 12.091 21.7877 13.9596 21.3981C15.8282 21.0084 17.5382 20.0706 18.8712 18.7044L19.9512 20.9868L19.9524 20.988ZM13.2 13.842H16.8V16.242H13.2V18.642H10.8V16.242H7.2V13.842H10.8V12.642H7.2V10.242H10.3032L7.7568 7.69681L9.456 6.00002L12 8.54522L14.5452 6.00002L16.2432 7.69681L13.6968 10.2432H16.8V12.6432H13.2V13.8432V13.842Z" fill="#0E121B" />
              </svg>

              <div className='flex flex-col gap-0.5 items-start space-y-1'>
                <span className='text-[#0E121B] text-[20px] font-medium'>{t('offers.contractTerms.oneTime.title')}</span>
                <span className='text-[12px] text-[#525866]'>
                  {t('offers.contractTerms.oneTime.description')}
                </span>

                <span className='text-[12px] text-[#0E121B] underline font-medium'>
                  {t('offers.contractTerms.learnMore')}
                </span>
              </div>
            </Label>
            <Label
              htmlFor='installment'
              className={cn(
                'flex cursor-pointer flex-col items-start gap-6 rounded-md border-2 p-4 transition-colors',
                field.value === 'installment'
                  ? 'border-[#2547D0] bg-[#F5F7FA]'
                  : 'border-[#E1E4EA] hover:border-[#2547D0]',
              )}
            >
              <RadioGroupItem
                value='installment'
                id='installment'
                className='sr-only hidden'
              />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.0476 3.01202C6.23964 1.06727 9.06963 -0.00460256 12 1.48563e-05C18.6276 1.48563e-05 24 5.37242 24 12C24.0039 14.4527 23.2527 16.8471 21.8484 18.858L18.6 12H21.6C21.6 10.0912 21.0311 8.22579 19.9657 6.64196C18.9004 5.05812 17.3872 3.82782 15.6192 3.1082C13.8513 2.38859 11.909 2.21234 10.0404 2.60197C8.17182 2.99159 6.4618 3.92941 5.1288 5.29562L4.0488 3.01322L4.0476 3.01202ZM19.9524 20.988C17.7604 22.9328 14.9304 24.0046 12 24C5.3724 24 0 18.6276 0 12C0 9.45002 0.7956 7.08601 2.1516 5.14201L5.4 12H2.4C2.39996 13.9088 2.96894 15.7742 4.03426 17.3581C5.09957 18.9419 6.61284 20.1722 8.38077 20.8918C10.1487 21.6114 12.091 21.7877 13.9596 21.3981C15.8282 21.0084 17.5382 20.0706 18.8712 18.7044L19.9512 20.9868L19.9524 20.988ZM13.2 13.842H16.8V16.242H13.2V18.642H10.8V16.242H7.2V13.842H10.8V12.642H7.2V10.242H10.3032L7.7568 7.69681L9.456 6.00002L12 8.54522L14.5452 6.00002L16.2432 7.69681L13.6968 10.2432H16.8V12.6432H13.2V13.8432V13.842Z" fill="#0E121B" />
              </svg>

              <div className='flex flex-col gap-0.5 items-start space-y-1'>
                <span className='text-[#0E121B] text-[20px] font-medium'>{t('offers.contractTerms.installment.title')}</span>
                <span className='text-[12px] text-[#525866]'>
                  {t('offers.contractTerms.installment.description')}
                </span>
                <span className='text-[12px] text-[#0E121B] underline font-medium'>
                  {t('offers.contractTerms.learnMore')}
                </span>
              </div>
            </Label>
          </RadioGroup>
        )}
      />
      {errors.paymentType && (
        <p className='text-sm mt-1 text-red-500 text-[14px]'>
          {errors.paymentType.message}
        </p>
      )}

      {/* --- Add General Currency Selector Here --- */}
      {/* <div>
        <Label htmlFor='currency'>Contract Currency</Label>
        <Controller
          name='currency'
          control={control}
          defaultValue='USD' // Set a default if desired
          render={({ field }) => (
            <select
              id='currency'
              {...field}
              className='text-base focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 focus:outline-none' // Use standard select styles
            >
              <option value='' disabled>
                Select Currency
              </option>
              <option value='USD'>USD</option>
              <option value='EUR'>EUR</option>
              <option value='CNY'>CNY</option>
            </select>
          )}
        />
        {errors.currency && (
          <p className='text-sm mt-1 text-red-500'>{errors.currency.message}</p>
        )}
      </div> */}
      {/* --- End General Currency Selector --- */}

      {/* Conditional Payment Details */}
      {paymentType === 'one-time' && <OneTimePaymentDetails form={form} />}
      {paymentType === 'installment' && (
        <InstallmentPaymentDetails form={form} />
      )}
    </div>
  );
}
