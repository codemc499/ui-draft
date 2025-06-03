'use client';

import React, { useState } from 'react';
import { UseFormRegister, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Switch from '@/components/ui/switch';
import * as Textarea from '@/components/ui/textarea';
import { RiInformationLine, RiCalendarLine } from '@remixicon/react';
import { CreateJobFormData } from '@/app/[lang]/jobs/create/schema';
import FormFieldError from './FormFieldError'; // Assuming a general error component
import * as FancyButton from '@/components/ui/fancy-button';
import * as Divider from '@/components/ui/divider';
import { Calendar } from '@/components/ui/datepicker';
import {
  Root as Popover,
  Content as PopoverContent,
  Trigger as PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Controller } from 'react-hook-form';
import { cn } from '@/utils/cn';

interface Step1Props {
  formMethods: UseFormReturn<CreateJobFormData>;
  nextStep: () => void;
}

const currencies = [
  {
    icon: 'https://alignui.com/flags/US.svg',
    value: 'USD',
    label: 'USD',
    symbol: '$',
  },
  {
    icon: 'https://alignui.com/flags/CN.svg',
    value: 'CNY',
    label: 'CNY',
    symbol: '¥',
  },
  {
    icon: 'https://alignui.com/flags/GB.svg',
    value: 'GBP',
    label: 'GBP',
    symbol: '£',
  },
  {
    icon: 'https://alignui.com/flags/EU.svg',
    value: 'EUR',
    label: 'EUR',
    symbol: '€',
  },
];


const Step1BasicInfoForm: React.FC<Step1Props> = ({
  formMethods,
  nextStep,
}) => {
  const { t } = useTranslation('common');
  const {
    register,
    setValue,
    setError,
    control,
    formState: { errors },
    watch
  } = formMethods;

  const description = watch('description', '');
  const descriptionLength = description.length;
  const currency = watch('currency', 'CNY');
  console.log(currency);
  const budget = watch('budget', 0);
  console.log(budget);
  const [deadlineCalendarOpen, setDeadlineCalendarOpen] = useState(false);

  return (
    <form onSubmit={(e) => e.preventDefault()} className='flex flex-col gap-4 pb-0'>
      {/* Subject/Title */}
      <div className='flex flex-col gap-1.5 px-4'>
        <Label.Root
          htmlFor='title'
          className='text-[14px] text-[#525866] font-medium'
        >
          {t('jobs.create.step1.subject')}
        </Label.Root>
        <Input.Root>
          <Input.Wrapper>
            <Input.Input
              id='title'
              placeholder={t('jobs.create.step1.subjectPlaceholder')}
              className='placeholder:text-[#99A0AE]'
              {...register('title')}
            />
          </Input.Wrapper>
        </Input.Root>
        <FormFieldError error={errors.title} />
      </div>

      {/* Detail/Description */}
      <div className='flex flex-col gap-1.5 px-4 '>
        <Label.Root
          htmlFor='description'
          className='text-[14px] text-[#525866] font-medium'
        >
          {t('jobs.create.step1.detail')}
        </Label.Root>
        <Textarea.Root
          id='description'
          rows={4}
          placeholder={t('jobs.create.step1.detailPlaceholder')}
          className='resize-none placeholder:text-[#99A0AE]'
          {...register('description', {
            required: 'Detail is required',
            minLength: {
              value: 20,
              message: 'Detail must be at least 20 characters'
            }
          })}
        >
          <Textarea.CharCounter current={descriptionLength} max={1000} />
        </Textarea.Root>
        {errors.description && (
          <p className='text-[14px] mt-1 text-red-500'>{errors.description.message}</p>
        )}
      </div>

      {/* Amount & Deadline Row */}
      <div className='grid grid-cols-1 gap-4 px-4 grid-cols-[2fr,1fr]'>
        {/* Amount/Budget */}
        <div className='flex flex-col gap-1.5'>
          <Label.Root
            htmlFor='budget'
            className='flex items-center gap-1 font-medium text-[14px] text-[#525866]'
          >
            {t('jobs.create.step1.amount')}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7 13.25C10.4518 13.25 13.25 10.4518 13.25 7C13.25 3.54822 10.4518 0.75 7 0.75C3.54822 0.75 0.75 3.54822 0.75 7C0.75 10.4518 3.54822 13.25 7 13.25ZM8.11584 10.2086L8.21565 9.8006C8.16399 9.82486 8.0807 9.85258 7.96649 9.88414C7.85197 9.9157 7.7489 9.93177 7.65831 9.93177C7.46536 9.93177 7.32952 9.90014 7.25065 9.83657C7.17236 9.773 7.13331 9.65342 7.13331 9.47827C7.13331 9.40887 7.14509 9.30542 7.16973 9.17003C7.19361 9.03373 7.22108 8.91261 7.25161 8.80666L7.62419 7.48759C7.66068 7.36653 7.68571 7.23344 7.69916 7.08818C7.71292 6.94325 7.71932 6.84185 7.71932 6.78429C7.71932 6.50614 7.62182 6.28041 7.42676 6.10629C7.2317 5.93229 6.95393 5.84529 6.59396 5.84529C6.39365 5.84529 6.18188 5.88088 5.95776 5.952C5.73363 6.02294 5.49933 6.1084 5.25421 6.2082L5.15415 6.6165C5.22719 6.58949 5.31419 6.56043 5.41598 6.53034C5.51732 6.50038 5.61674 6.48489 5.71347 6.48489C5.91096 6.48489 6.04399 6.51856 6.1137 6.58488C6.18342 6.65139 6.21844 6.7697 6.21844 6.93883C6.21844 7.03236 6.20736 7.13626 6.18438 7.24919C6.16172 7.36282 6.13342 7.48298 6.10013 7.6098L5.72595 8.93419C5.69266 9.07336 5.66834 9.19787 5.65304 9.30843C5.63786 9.41886 5.63057 9.52724 5.63057 9.63262C5.63057 9.90482 5.73114 10.1292 5.93222 10.3063C6.13329 10.4826 6.41523 10.5714 6.77769 10.5714C7.01372 10.5714 7.22088 10.5406 7.39917 10.4785C7.57727 10.4167 7.81644 10.3268 8.11584 10.2086ZM8.04946 4.8502C8.22352 4.68882 8.31014 4.49254 8.31014 4.26272C8.31014 4.03341 8.22365 3.83675 8.04946 3.67331C7.87584 3.51032 7.66657 3.42857 7.4219 3.42857C7.17646 3.42857 6.96635 3.51013 6.79107 3.67331C6.61579 3.83675 6.52796 4.03334 6.52796 4.26272C6.52796 4.49254 6.61579 4.68875 6.79107 4.8502C6.96667 5.01217 7.17639 5.09321 7.4219 5.09321C7.66664 5.09321 7.87584 5.01217 8.04946 4.8502Z" fill="#CACFD8" />
            </svg>

          </Label.Root>
          <div className='flex gap-2'>

            <Input.Root>
              <Input.Wrapper>
                <Input.InlineAffix className='text-[#0E121B]'>
                  {currency === 'USD' ? '$' : currency === 'CNY' ? '¥' : currency === 'GBP' ? '£' : '€'}
                </Input.InlineAffix>
                <Input.Input id='budget' type='number' placeholder='0.00' step='0.01' className='placeholder:text-[#99A0AE] hover:text-[#525866]' {...register('budget', { valueAsNumber: true })} />
              </Input.Wrapper>
              <Select.Root variant='compactForInput'
                defaultValue='USD'
                // value={currency}
                onValueChange={(value) =>
                  setValue('currency', value, { shouldValidate: true })
                }
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {currencies.map((item) => (
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
            </Input.Root>
          </div>
          <FormFieldError error={errors.budget} />
          <FormFieldError error={errors.currency} />
        </div>

        {/* Deadline */}
        <div className='flex flex-col gap-1.5'>
          <Label.Root
            htmlFor='deadline'
            className='flex items-center gap-1.5 text-[14px] text-[#525866] font-medium'
          >
            {t('jobs.create.step1.deadline')}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7 13.25C10.4518 13.25 13.25 10.4518 13.25 7C13.25 3.54822 10.4518 0.75 7 0.75C3.54822 0.75 0.75 3.54822 0.75 7C0.75 10.4518 3.54822 13.25 7 13.25ZM8.11584 10.2086L8.21565 9.8006C8.16399 9.82486 8.0807 9.85258 7.96649 9.88414C7.85197 9.9157 7.7489 9.93177 7.65831 9.93177C7.46536 9.93177 7.32952 9.90014 7.25065 9.83657C7.17236 9.773 7.13331 9.65342 7.13331 9.47827C7.13331 9.40887 7.14509 9.30542 7.16973 9.17003C7.19361 9.03373 7.22108 8.91261 7.25161 8.80666L7.62419 7.48759C7.66068 7.36653 7.68571 7.23344 7.69916 7.08818C7.71292 6.94325 7.71932 6.84185 7.71932 6.78429C7.71932 6.50614 7.62182 6.28041 7.42676 6.10629C7.2317 5.93229 6.95393 5.84529 6.59396 5.84529C6.39365 5.84529 6.18188 5.88088 5.95776 5.952C5.73363 6.02294 5.49933 6.1084 5.25421 6.2082L5.15415 6.6165C5.22719 6.58949 5.31419 6.56043 5.41598 6.53034C5.51732 6.50038 5.61674 6.48489 5.71347 6.48489C5.91096 6.48489 6.04399 6.51856 6.1137 6.58488C6.18342 6.65139 6.21844 6.7697 6.21844 6.93883C6.21844 7.03236 6.20736 7.13626 6.18438 7.24919C6.16172 7.36282 6.13342 7.48298 6.10013 7.6098L5.72595 8.93419C5.69266 9.07336 5.66834 9.19787 5.65304 9.30843C5.63786 9.41886 5.63057 9.52724 5.63057 9.63262C5.63057 9.90482 5.73114 10.1292 5.93222 10.3063C6.13329 10.4826 6.41523 10.5714 6.77769 10.5714C7.01372 10.5714 7.22088 10.5406 7.39917 10.4785C7.57727 10.4167 7.81644 10.3268 8.11584 10.2086ZM8.04946 4.8502C8.22352 4.68882 8.31014 4.49254 8.31014 4.26272C8.31014 4.03341 8.22365 3.83675 8.04946 3.67331C7.87584 3.51032 7.66657 3.42857 7.4219 3.42857C7.17646 3.42857 6.96635 3.51013 6.79107 3.67331C6.61579 3.83675 6.52796 4.03334 6.52796 4.26272C6.52796 4.49254 6.61579 4.68875 6.79107 4.8502C6.96667 5.01217 7.17639 5.09321 7.4219 5.09321C7.66664 5.09321 7.87584 5.01217 8.04946 4.8502Z" fill="#CACFD8" />
            </svg>

          </Label.Root>
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => (
              <Popover
                open={deadlineCalendarOpen}
                onOpenChange={setDeadlineCalendarOpen}
              >
                <PopoverTrigger asChild>
                  <Button.Root
                    type='button'
                    className={cn(
                      'w-full justify-start rounded-md border border-[#E1E4EA] hover:border-white hover:bg-[#F6F8FA] bg-white px-3 py-2 text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    <RiCalendarLine className='mr-2 h-4 w-4 text-[#0E121B]' />
                    {field.value ? (
                      <p className='text-[14px] text-[#0E121B]'>
                        {format(new Date(field.value), 'PPP')}
                      </p>
                    ) : (
                      <span className='text-[14px] text-[#525866]'>{t('jobs.create.step1.deadlinePlaceholder')}</span>
                    )}
                  </Button.Root>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (date < today) {
                          setValue('deadline', '', { shouldValidate: false });
                          setError('deadline', {
                            type: 'manual',
                            message: t('jobs.create.step1.deadlineFutureError'),
                          });
                          return;
                        }
                        field.onChange(date.toISOString());
                      }
                      setDeadlineCalendarOpen(false);
                    }}
                    disabled={{ before: new Date() }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          <FormFieldError error={errors.deadline} />
        </div>
      </div>

      {/* Negotiate Budget */}
      <div className='flex items-center gap-2  px-4'>
        <Switch.Root id='negotiate-budget' {...register('negotiateBudget')} />
        <Label.Root
          htmlFor='negotiate-budget'
          className='text-sm text-text-secondary-600 cursor-pointer'
        >
          {t('jobs.create.step1.negotiateBudget')}
        </Label.Root>
      </div>
      <FormFieldError error={errors.negotiateBudget} />

      <Divider.Root className='w-full' />

      {/* Navigation */}
      <div className='flex justify-end  px-4'>
        {/* Type submit triggers RHF validation if mode allows */}
        <FancyButton.Root variant='neutral' onClick={nextStep}>
          {t('jobs.create.next')}
        </FancyButton.Root>
      </div>
    </form>
  );
};

export default Step1BasicInfoForm;
