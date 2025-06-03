'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UseFormReturn,
  Controller,
  useFieldArray,
  FieldErrors,
} from 'react-hook-form';
import { Root as Textarea } from '@/components/ui/textarea';
import { Root as Label } from '@/components/ui/label';
import { Root as Button } from '@/components/ui/button';
import * as Select from '@/components/ui/select';
import * as Input from '@/components/ui/input';
import { Calendar } from '@/components/ui/datepicker';
import {
  Root as Popover,
  Content as PopoverContent,
  Trigger as PopoverTrigger,
} from '@/components/ui/popover';
import { SendOfferFormData } from '../schema';
import { cn } from '@/utils/cn';
import { RiCalendarLine, RiSubtractLine } from '@remixicon/react';
import { format } from 'date-fns';

type FormMethods = Omit<UseFormReturn<SendOfferFormData>, 'handleSubmit'>;

interface InstallmentPaymentDetailsProps {
  form: FormMethods;
}

const currencyOptions = [
  { value: 'USD', label: 'USD', icon: 'https://alignui.com/flags/US.svg' },
  { value: 'EUR', label: 'EUR', icon: 'https://alignui.com/flags/EU.svg' },
  { value: 'GBP', label: 'GBP', icon: 'https://alignui.com/flags/GB.svg' },
  { value: 'CNY', label: 'CNY', icon: 'https://alignui.com/flags/CN.svg' },
];

export function InstallmentPaymentDetails({
  form,
}: InstallmentPaymentDetailsProps) {
  const { t } = useTranslation('common');
  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
  } = form;
  const [milestoneCalendarOpen, setMilestoneCalendarOpen] = useState<
    number | null
  >(null);
  const inputStyles = Input.inputVariants();
  const currency = watch('currency') || 'USD';
  const [deadlineCalendarOpen, setDeadlineCalendarOpen] = useState(false);


  // Explicitly type the FieldArray and its items
  const { fields, append, remove } = useFieldArray<
    SendOfferFormData,
    'milestones',
    'id' // Default key name
  >({
    control,
    name: 'milestones',
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ description: '', amount: 0, dueDate: undefined });
    }
  }, []);

  const addMilestone = () => {
    append({
      description: '',
      amount: 0,
      dueDate: undefined,
    });
  };

  const mileStoneValues = watch('milestones');
  console.log(mileStoneValues);

  return (
    <div className='flex flex-col gap-1 w-full items-start'>
      <div className='flex flex-col gap-2 mb-2 w-full'>

        {fields.map((field, index) => (
          <div key={field.id} className='flex items-center gap-4 w-full'>

            <div className='w-1/3'>
              <Label className='flex items-center gap-2 text-[14px] font-medium text-[#0E121B] mb-1'>
                {t('offers.installment.milestone', { number: index + 1 })}

                <div className='size-4 rounded-full bg-red-500 flex items-center justify-center'>
                  <RiSubtractLine className='h-4 w-4 text-white' onClick={() => remove(index)} />
                </div>

              </Label>
              <Input.Root className='flex-grow'>
                <Input.Wrapper>
                  <Input.Input
                    id={`milestones.${index}.description`}
                    {...register(`milestones.${index}.description`)}
                    placeholder={t('offers.installment.milestoneDescription')}
                    className={cn(inputStyles.input({ size: 'medium' }))}
                  />
                </Input.Wrapper>

              </Input.Root>

            </div>

            <div className='flex flex-col gap-1 w-1/3'>
              <Label className='flex items-center gap-1 text-[14px] font-medium text-[#0E121B] mb-1'>
                {t('offers.installment.amount')}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7 13.25C10.4518 13.25 13.25 10.4518 13.25 7C13.25 3.54822 10.4518 0.75 7 0.75C3.54822 0.75 0.75 3.54822 0.75 7C0.75 10.4518 3.54822 13.25 7 13.25ZM8.11584 10.2086L8.21565 9.8006C8.16399 9.82486 8.0807 9.85258 7.96649 9.88414C7.85197 9.9157 7.7489 9.93177 7.65831 9.93177C7.46536 9.93177 7.32952 9.90014 7.25065 9.83657C7.17236 9.773 7.13331 9.65342 7.13331 9.47827C7.13331 9.40887 7.14509 9.30542 7.16973 9.17003C7.19361 9.03373 7.22108 8.91261 7.25161 8.80666L7.62419 7.48759C7.66068 7.36653 7.68571 7.23344 7.69916 7.08818C7.71292 6.94325 7.71932 6.84185 7.71932 6.78429C7.71932 6.50614 7.62182 6.28041 7.42676 6.10629C7.2317 5.93229 6.95393 5.84529 6.59396 5.84529C6.39365 5.84529 6.18188 5.88088 5.95776 5.952C5.73363 6.02294 5.49933 6.1084 5.25421 6.2082L5.15415 6.6165C5.22719 6.58949 5.31419 6.56043 5.41598 6.53034C5.51732 6.50038 5.61674 6.48489 5.71347 6.48489C5.91096 6.48489 6.04399 6.51856 6.1137 6.58488C6.18342 6.65139 6.21844 6.7697 6.21844 6.93883C6.21844 7.03236 6.20736 7.13626 6.18438 7.24919C6.16172 7.36282 6.13342 7.48298 6.10013 7.6098L5.72595 8.93419C5.69266 9.07336 5.66834 9.19787 5.65304 9.30843C5.63786 9.41886 5.63057 9.52724 5.63057 9.63262C5.63057 9.90482 5.73114 10.1292 5.93222 10.3063C6.13329 10.4826 6.41523 10.5714 6.77769 10.5714C7.01372 10.5714 7.22088 10.5406 7.39917 10.4785C7.57727 10.4167 7.81644 10.3268 8.11584 10.2086ZM8.04946 4.8502C8.22352 4.68882 8.31014 4.49254 8.31014 4.26272C8.31014 4.03341 8.22365 3.83675 8.04946 3.67331C7.87584 3.51032 7.66657 3.42857 7.4219 3.42857C7.17646 3.42857 6.96635 3.51013 6.79107 3.67331C6.61579 3.83675 6.52796 4.03334 6.52796 4.26272C6.52796 4.49254 6.61579 4.68875 6.79107 4.8502C6.96667 5.01217 7.17639 5.09321 7.4219 5.09321C7.66664 5.09321 7.87584 5.01217 8.04946 4.8502Z" fill="#CACFD8" />
                </svg>

              </Label>
              <div className='flex items-center gap-0'>
                <Input.Root className='flex-grow rounded-r-none'>
                  <Input.Wrapper>
                    <div className='!text-[#0E121B]'>
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
                      id={`milestones.${index}.amount`}
                      type='number'
                      placeholder='0.00'
                      min='1'
                      className='!placeholder:text-[#0E121B] !text-[#0E121B] hover:text-[#525866]'
                      step='0.01'
                      {...register(`milestones.${index}.amount`, {
                        valueAsNumber: true,
                      })}
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
              {errors.amount && (
                <p className='text-xs mt-1 text-red-500'>
                  {errors.amount?.message?.toString()}
                </p>
              )}
              {errors.currency && (
                <p className='text-xs mt-1 text-red-500'>
                  {errors.currency?.message?.toString()}
                </p>
              )}
            </div>
            <div className='w-1/3'>
              <Label className='flex items-center gap-1 text-[14px] font-medium text-[#0E121B] mb-1'>
                {t('offers.installment.deadline')}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7 13.25C10.4518 13.25 13.25 10.4518 13.25 7C13.25 3.54822 10.4518 0.75 7 0.75C3.54822 0.75 0.75 3.54822 0.75 7C0.75 10.4518 3.54822 13.25 7 13.25ZM8.11584 10.2086L8.21565 9.8006C8.16399 9.82486 8.0807 9.85258 7.96649 9.88414C7.85197 9.9157 7.7489 9.93177 7.65831 9.93177C7.46536 9.93177 7.32952 9.90014 7.25065 9.83657C7.17236 9.773 7.13331 9.65342 7.13331 9.47827C7.13331 9.40887 7.14509 9.30542 7.16973 9.17003C7.19361 9.03373 7.22108 8.91261 7.25161 8.80666L7.62419 7.48759C7.66068 7.36653 7.68571 7.23344 7.69916 7.08818C7.71292 6.94325 7.71932 6.84185 7.71932 6.78429C7.71932 6.50614 7.62182 6.28041 7.42676 6.10629C7.2317 5.93229 6.95393 5.84529 6.59396 5.84529C6.39365 5.84529 6.18188 5.88088 5.95776 5.952C5.73363 6.02294 5.49933 6.1084 5.25421 6.2082L5.15415 6.6165C5.22719 6.58949 5.31419 6.56043 5.41598 6.53034C5.51732 6.50038 5.61674 6.48489 5.71347 6.48489C5.91096 6.48489 6.04399 6.51856 6.1137 6.58488C6.18342 6.65139 6.21844 6.7697 6.21844 6.93883C6.21844 7.03236 6.20736 7.13626 6.18438 7.24919C6.16172 7.36282 6.13342 7.48298 6.10013 7.6098L5.72595 8.93419C5.69266 9.07336 5.66834 9.19787 5.65304 9.30843C5.63786 9.41886 5.63057 9.52724 5.63057 9.63262C5.63057 9.90482 5.73114 10.1292 5.93222 10.3063C6.13329 10.4826 6.41523 10.5714 6.77769 10.5714C7.01372 10.5714 7.22088 10.5406 7.39917 10.4785C7.57727 10.4167 7.81644 10.3268 8.11584 10.2086ZM8.04946 4.8502C8.22352 4.68882 8.31014 4.49254 8.31014 4.26272C8.31014 4.03341 8.22365 3.83675 8.04946 3.67331C7.87584 3.51032 7.66657 3.42857 7.4219 3.42857C7.17646 3.42857 6.96635 3.51013 6.79107 3.67331C6.61579 3.83675 6.52796 4.03334 6.52796 4.26272C6.52796 4.49254 6.61579 4.68875 6.79107 4.8502C6.96667 5.01217 7.17639 5.09321 7.4219 5.09321C7.66664 5.09321 7.87584 5.01217 8.04946 4.8502Z" fill="#CACFD8" />
                </svg>
              </Label>
              <Controller
                name={`milestones.${index}.dueDate`}
                control={control}
                render={({ field }) => (
                  <Popover
                    open={milestoneCalendarOpen === index}
                    onOpenChange={(isOpen) => setMilestoneCalendarOpen(isOpen ? index : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type='button'
                        className={cn(
                          'w-full justify-start rounded-md border border-[#E1E4EA]  hover:bg-[#F5F7FA] rounded-md hover:border-none bg-white px-3 py-2 text-left font-normal pr-10',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <RiCalendarLine className='mr-2 h-4 w-4 text-[#0E121B]' />
                        {field.value ? (
                          <p className='text-[14px] text-[#0E121B]'>
                            {format(field.value, 'PPP')}
                          </p>
                        ) : (
                          <span className='text-[14px] text-[#525866]'>{t('offers.installment.datePlaceholder')}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value || undefined}
                        onSelect={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          if (date && date < today) {
                            form.setValue(`milestones.${index}.dueDate`, undefined);
                            form.setError(`milestones.${index}.dueDate`, {
                              type: 'manual',
                              message: t('offers.installment.errors.futureDate'),
                            });
                            return;
                          }

                          field.onChange(date);
                          setMilestoneCalendarOpen(null);
                        }}
                        disabled={{ before: new Date() }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.milestones?.[index]?.dueDate && (
                <p className='text-sm mt-1 text-red-500'>
                  {errors.milestones[index]?.dueDate?.message}
                </p>
              )}

            </div>

          </div>
        ))}
      </div>

      <Button type='button' onClick={addMilestone} className='w-max' mode='stroke' variant='neutral' size='xsmall'>
        {t('offers.installment.addMilestone')}
      </Button>

      {/* <div className='space-y-4'>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className='shadow-sm relative rounded border bg-white p-4'
          >
            <div className='absolute right-2 top-2'>
              <Button
                type='button'
                onClick={() => remove(index)}
                className='rounded p-1 text-red-500 hover:bg-red-100 hover:text-red-700'
                aria-label='Remove milestone'
              >
                <RiDeleteBinLine className='h-4 w-4' />
              </Button>
            </div>

            <Label className='mb-2 block font-medium'>{`${index + 1}. Milestone description`}</Label>
            <Textarea
              {...register(`milestones.${index}.description`)}
              placeholder='Placeholder text...'
              rows={3}
              className='mt-1'
            />
            {errors.milestones?.[index]?.description && (
              <p className='text-sm mt-1 text-red-500'>
                {errors.milestones[index]?.description?.message}
              </p>
            )}

            <div className='mt-4 grid grid-cols-1 items-end gap-4 md:grid-cols-3'>
              <div>
                <Label htmlFor={`milestones.${index}.amount`}>Amount</Label>
                <InputRoot className='mt-1' size='medium'>
                  <input
                    id={`milestones.${index}.amount`}
                    type='number'
                    step='0.01'
                    {...register(`milestones.${index}.amount`, {
                      valueAsNumber: true,
                    })}
                    placeholder='0.00'
                    className={cn(inputStyles.input({ size: 'medium' }))}
                  />
                </InputRoot>
                {errors.milestones?.[index]?.amount && (
                  <p className='text-sm mt-1 text-red-500'>
                    {errors.milestones[index]?.amount?.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`milestones.${index}.dueDate`}>
                  Due Date (Optional)
                </Label>
                <Controller
                  name={`milestones.${index}.dueDate`}
                  control={control}
                  render={({ field: milestoneField }) => (
                    <Popover
                      open={milestoneCalendarOpen === index}
                      onOpenChange={(isOpen) =>
                        setMilestoneCalendarOpen(isOpen ? index : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type='button'
                          className={cn(
                            'mt-1 w-full justify-start rounded-md border border-gray-300 bg-white px-3 py-2 text-left font-normal hover:bg-gray-50',
                            !milestoneField.value && 'text-muted-foreground',
                          )}
                        >
                          <RiCalendarLine className='mr-2 h-4 w-4' />
                          {milestoneField.value ? (
                            format(milestoneField.value, 'PPP')
                          ) : (
                            <span>DD / MM / YYYY</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          selected={milestoneField.value || undefined}
                          onSelect={(date) => {
                            milestoneField.onChange(date);
                            setMilestoneCalendarOpen(null);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.milestones?.[index]?.dueDate && (
                  <p className='text-sm mt-1 text-red-500'>
                    {errors.milestones[index]?.dueDate?.message}
                  </p>
                )}
              </div>
              <div></div>
            </div>
          </div>
        ))}
      </div> */}
      {/* Add Milestone Button */}
      {/* <Button
        type='button'
        onClick={addMilestone}
        className='text-sm mt-4 w-max rounded-md border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50'
      >
        Add milestone
      </Button> */}
      {/* Display root error for milestones array if present */}
      {/* {errors.milestones &&
        typeof errors.milestones === 'object' &&
        !Array.isArray(errors.milestones) &&
        errors.milestones.message && (
          <p className='text-sm mt-2 text-red-500'>
            {errors.milestones.message}
          </p>
        )} */}
    </div>
  );
}
