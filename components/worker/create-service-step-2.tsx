'use client';

import React, { useEffect } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
  CreateServiceFormData,
  isStep2Complete,
} from '@/app/[lang]/worker/services/create/schema';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import {
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiAddLine,
  RiDeleteBinLine,
} from '@remixicon/react';
import * as LinkButton from '@/components/ui/link-button';
import * as FancyButton from '@/components/ui/fancy-button';
import { useTranslation } from 'react-i18next';

// Dummy currency options - replace with actual data source if available
const currencyOptions = [
  { value: 'USD', label: 'USD', icon: 'https://alignui.com/flags/US.svg' },
  { value: 'EUR', label: 'EUR', icon: 'https://alignui.com/flags/EU.svg' },
  { value: 'GBP', label: 'GBP', icon: 'https://alignui.com/flags/GB.svg' },
  { value: 'CNY', label: 'CNY', icon: 'https://alignui.com/flags/CN.svg' },
];

interface Step2PricingProps {
  formMethods: UseFormReturn<CreateServiceFormData>;
  nextStep: () => void;
  prevStep: () => void;
}

export function Step2Pricing({
  formMethods,
  nextStep,
  prevStep,
}: Step2PricingProps) {
  const { t } = useTranslation('common');
  const {
    register,
    setValue,
    getValues,
    watch,
    control,
    trigger,
    formState: { errors, isValid },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalServices',
  });

  const [currency, price, leadTime] = watch([
    'currency',
    'price',
    'lead_time',
  ]);

  useEffect(() => {
    trigger(['price', 'lead_time']);
  }, [price, leadTime, trigger]);

  const addAdditionalService = () => {
    append({ name: '', price: 0 });
  };

  return (
    <div className='shadow-sm mx-auto max-w-2xl rounded-xl border border-stroke-soft-200 bg-bg-white-0'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-stroke-soft-200 p-4'>
        <div>
          <h2 className='font-semibold text-[#0E121B] text-[16px]'>{t('worker.services.create.page.title')}</h2>
          <p className='text-[12px] text-[#525866]'>{t('worker.services.create.page.steps.terms')}</p>
        </div>
        <Button.Root variant='neutral' mode='ghost' size='medium'>
          <Button.Icon as={RiCloseLine} />
        </Button.Root>
      </div>

      {/* Form Fields */}
      <div className='space-y-6 p-6'>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {/* Pricing Field */}
          <div className='flex flex-col gap-1'>
            <Label.Root className='flex items-center gap-1 text-[14px] font-medium text-[#0E121B]'>
              {t('worker.services.create.step2.pricing')}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7 13.25C10.4518 13.25 13.25 10.4518 13.25 7C13.25 3.54822 10.4518 0.75 7 0.75C3.54822 0.75 0.75 3.54822 0.75 7C0.75 10.4518 3.54822 13.25 7 13.25ZM8.11584 10.2086L8.21565 9.8006C8.16399 9.82486 8.0807 9.85258 7.96649 9.88414C7.85197 9.9157 7.7489 9.93177 7.65831 9.93177C7.46536 9.93177 7.32952 9.90014 7.25065 9.83657C7.17236 9.773 7.13331 9.65342 7.13331 9.47827C7.13331 9.40887 7.14509 9.30542 7.16973 9.17003C7.19361 9.03373 7.22108 8.91261 7.25161 8.80666L7.62419 7.48759C7.66068 7.36653 7.68571 7.23344 7.69916 7.08818C7.71292 6.94325 7.71932 6.84185 7.71932 6.78429C7.71932 6.50614 7.62182 6.28041 7.42676 6.10629C7.2317 5.93229 6.95393 5.84529 6.59396 5.84529C6.39365 5.84529 6.18188 5.88088 5.95776 5.952C5.73363 6.02294 5.49933 6.1084 5.25421 6.2082L5.15415 6.6165C5.22719 6.58949 5.31419 6.56043 5.41598 6.53034C5.51732 6.50038 5.61674 6.48489 5.71347 6.48489C5.91096 6.48489 6.04399 6.51856 6.1137 6.58488C6.18342 6.65139 6.21844 6.7697 6.21844 6.93883C6.21844 7.03236 6.20736 7.13626 6.18438 7.24919C6.16172 7.36282 6.13342 7.48298 6.10013 7.6098L5.72595 8.93419C5.69266 9.07336 5.66834 9.19787 5.65304 9.30843C5.63786 9.41886 5.63057 9.52724 5.63057 9.63262C5.63057 9.90482 5.73114 10.1292 5.93222 10.3063C6.13329 10.4826 6.41523 10.5714 6.77769 10.5714C7.01372 10.5714 7.22088 10.5406 7.39917 10.4785C7.57727 10.4167 7.81644 10.3268 8.11584 10.2086ZM8.04946 4.8502C8.22352 4.68882 8.31014 4.49254 8.31014 4.26272C8.31014 4.03341 8.22365 3.83675 8.04946 3.67331C7.87584 3.51032 7.66657 3.42857 7.4219 3.42857C7.17646 3.42857 6.96635 3.51013 6.79107 3.67331C6.61579 3.83675 6.52796 4.03334 6.52796 4.26272C6.52796 4.49254 6.61579 4.68875 6.79107 4.8502C6.96667 5.01217 7.17639 5.09321 7.4219 5.09321C7.66664 5.09321 7.87584 5.01217 8.04946 4.8502Z" fill="#CACFD8" />
              </svg>
            </Label.Root>
            <div className='flex items-center gap-0'>
              <Input.Root className='flex-grow rounded-r-none'>
                <Input.Wrapper>
                  <div className='text-text-sub-600'>
                    {currency === 'USD'
                      ? '$'
                      : currency === 'EUR'
                        ? '€'
                        : currency === 'GBP'
                          ? '£'
                          : currency === 'CNY'
                            ? '¥'
                            : '$'}
                  </div>
                  <Input.Input
                    type='number'
                    placeholder='0.00'
                    min='1'
                    step='0.01'
                    {...register('price', { valueAsNumber: true })}
                  />
                </Input.Wrapper>
              </Input.Root>
              <Select.Root
                value={currency}
                onValueChange={(value) =>
                  setValue('currency', value, { shouldValidate: true })
                }
              >
                <Select.Trigger className='w-[100px] rounded-l-none border-l-0'>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {currencyOptions.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        <Select.ItemIcon
                          style={{
                            backgroundImage: `url(${item.icon})`,
                          }}
                        />
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
            {errors.price && (
              <p className='text-[11px] text-red-500'>
                {errors.price.message?.toString()}
              </p>
            )}
            {errors.currency && (
              <p className='text-[11px] text-red-500'>
                {errors.currency.message?.toString()}
              </p>
            )}
          </div>

          {/* Lead Time Field */}
          <div className='flex flex-col gap-1'>
            <Label.Root className='text-[14px] font-medium text-[#0E121B]'>
              {t('worker.services.create.step2.leadTime')} <span className='text-[#525866] text-[14px] whitespace-nowrap'> {"  (days)"}</span>
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  type='number'
                  placeholder={t('worker.services.create.step2.leadTimePlaceholder')}
                  min='1'
                  step='1'
                  {...register('lead_time', { valueAsNumber: true })}
                />
              </Input.Wrapper>
            </Input.Root>
            {errors.lead_time && (
              <p className='text-[11px] text-red-500'>
                {errors.lead_time.message?.toString()}
              </p>
            )}
          </div>
        </div>


        <div className='space-y-4'>

          {fields.map((item, index) => (
            <div
              key={item.id}
              className='flex flex-col gap-4 rounded-md sm:flex-row sm:items-end'
            >
              <div className='flex flex-grow flex-col gap-1'>
                <Label.Root
                  htmlFor={`additionalServices.${index}.name`}
                  className='text-label-sm text-text-strong-950'
                >
                  {t('worker.services.create.step2.additionalServiceName')}
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id={`additionalServices.${index}.name`}
                      placeholder={t('worker.services.create.step2.additionalServicePlaceholder')}
                      {...register(`additionalServices.${index}.name` as const)}
                    />
                  </Input.Wrapper>
                </Input.Root>
                <div className='h-4'>
                  {errors.additionalServices?.[index]?.name && (
                    <p className='text-[11px] text-red-500'>
                      {
                        errors.additionalServices?.[index]?.name?.message?.toString()
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className='flex w-full flex-col gap-1 sm:w-[120px]'>
                <Label.Root
                  htmlFor={`additionalServices.${index}.price`}
                  className='text-[14px] font-medium text-[#0E121B]'
                >
                  {t('worker.services.create.step2.pricing')} ({currency})
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <div className='px-2 text-text-sub-600'>
                      {currency === 'USD'
                        ? '$'
                        : currency === 'EUR'
                          ? '€'
                          : currency === 'GBP'
                            ? '£'
                            : currency === 'CNY'
                              ? '¥'
                              : '$'}
                    </div>
                    <Input.Input
                      id={`additionalServices.${index}.price`}
                      type='number'
                      placeholder='0.00'
                      min='1'
                      step='0.01'
                      {...register(
                        `additionalServices.${index}.price` as const,
                        {
                          valueAsNumber: true,
                        },
                      )}
                    />
                  </Input.Wrapper>
                </Input.Root>
                <div className='h-4'>
                  {errors.additionalServices?.[index]?.price && (
                    <p className='text-[11px] text-red-500'>
                      {
                        errors.additionalServices?.[index]?.price?.message?.toString()
                      }
                    </p>
                  )}
                </div>
              </div>

              <Button.Root
                variant='neutral'
                mode='ghost'
                size='small'
                onClick={() => remove(index)}
                className='mb-4 h-9 w-full flex-shrink-0 sm:w-auto'
                type='button'
              >
                <Button.Icon as={RiDeleteBinLine} className='text-red-500' />
              </Button.Root>
            </div>
          ))}

          <LinkButton.Root
            onClick={addAdditionalService}
            className='text-[14px] text-[#335CFF] font-medium'
            type='button'
          >
            <span>{t('worker.services.create.step2.addAdditionalService')}</span>
          </LinkButton.Root>
        </div>
      </div>

      {/* Footer / Navigation */}
      <div className='flex items-center justify-between border-t border-stroke-soft-200 p-4'>
        {/* Step Indicators */}
        <div className='flex gap-1.5'>
          <span className='block h-1.5 w-1.5 rounded-full bg-[#EBEBEB]'></span>
          <span className='block h-1.5 w-1.5 rounded-full bg-[#122368]'></span>
          <span className='block h-1.5 w-1.5 rounded-full bg-[#EBEBEB]'></span>
        </div>
        {/* Action Buttons */}
        <div className='flex gap-3  border-stroke-soft-200 p-4'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            onClick={prevStep}
            className='flex-1'
          >
            {t('worker.services.create.step2.previous')}
          </Button.Root>
          <FancyButton.Root
            variant='neutral'
            onClick={nextStep}
            className='flex-1'
            disabled={
              !!errors.price ||
              !!errors.lead_time ||
              fields.some((_, index) =>
                !getValues(`additionalServices.${index}.name`) ||
                !getValues(`additionalServices.${index}.price`) ||
                !!errors.additionalServices?.[index]?.name ||
                !!errors.additionalServices?.[index]?.price
              )
            }
          >
            {t('worker.services.create.step2.next')}
          </FancyButton.Root>
        </div>
      </div>
    </div>
  );
}
