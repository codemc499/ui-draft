'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UseFormReturn } from 'react-hook-form';
import { CreateServiceFormData } from '@/app/[lang]/worker/services/create/schema';
import * as Button from '@/components/ui/button';
import * as FileUpload from '@/components/ui/file-upload';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Tag from '@/components/ui/tag';
import * as Textarea from '@/components/ui/textarea';
import {
  RiUploadCloud2Line,
  RiCloseLine,
  RiInformationLine,
  RiLoader4Line,
  RiDeleteBinLine,
  RiCheckboxCircleFill,
  RiFileTextLine,
} from '@remixicon/react';
import { useTranslation } from 'react-i18next';

import { useCreateServiceForm } from '@/hooks/useCreateServiceForm';
import * as FancyButton from '@/components/ui/fancy-button';

// Define initial tag suggestions
const initialTagSuggestions = [
  'Music Production',
  'Mixing',
  'Mastering',
];

interface Step1BasicInfoProps {
  formMethods: UseFormReturn<CreateServiceFormData>;
  nextStep: () => void;
}

export function Step1BasicInfo({ formMethods, nextStep }: Step1BasicInfoProps) {
  const { t } = useTranslation('common');
  const { uploadFile } = useCreateServiceForm();
  const [inputValue, setInputValue] = useState('');
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = formMethods;

  const tags = watch('tags') || [];
  const images = watch('images') || [];
  const description = watch('description') || '';

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '' && tags.length < 8) {
      e.preventDefault();
      setValue('tags', [...tags, inputValue.trim()], { shouldValidate: true });
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter((tag) => tag !== tagToRemove),
      { shouldValidate: true },
    );
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploadError(null);
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const currentFiles = getValues('images') || [];

    // Check if we already have 5 images
    if (currentFiles.length + files.length > 5) {
      setFileUploadError('Maximum 5 images allowed');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check if file is an image
      const isValidFormat = file.type.startsWith('image/');

      // Check if file is under 50MB
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB in bytes

      if (!isValidFormat) {
        setFileUploadError('Only image files are allowed');
        return;
      }

      if (!isValidSize) {
        setFileUploadError('Files must be under 50MB');
        return;
      }

      // Set uploading indicator
      setUploadingFile(file.name);

      try {
        // Upload file to Supabase storage directly
        const uploadedFile = await uploadFile(file);

        if (uploadedFile) {
          // Add the uploaded file with URL to the form state
          currentFiles.push(uploadedFile);
        } else {
          setFileUploadError(`Failed to upload ${file.name}`);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setFileUploadError(`Error uploading ${file.name}`);
      } finally {
        setUploadingFile(null);
      }
    }

    setValue('images', currentFiles, { shouldValidate: true });

    // Reset the file input
    e.target.value = '';
  };

  // Handle removing a file
  const handleRemoveFile = (fileName: string) => {
    setValue(
      'images',
      images.filter((file) => file.name !== fileName),
      { shouldValidate: true },
    );
  };

  // Set initial tags on mount
  useEffect(() => {
    setValue('tags', initialTagSuggestions.slice(0, 8));
  }, [setValue]);

  const isValidToMoveNext = () => {
    const { title, description } = getValues();
    return title?.length > 0 && description?.length >= 20;
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className='shadow-sm mx-auto max-w-2xl rounded-xl border border-[#EBEBEB] bg-bg-white-0'>
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
        {/* Service Title */}
        <div className='flex flex-col gap-1'>
          <Label.Root className='text-[14px] font-medium text-[#0E121B]'>
            {t('worker.services.create.step1.subject')}
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                placeholder={t('worker.services.create.step1.subjectPlaceholder')}
                {...register('title')}
              />
            </Input.Wrapper>
          </Input.Root>
          {errors.title && (
            <p className='text-xs mt-1 text-red-500'>{errors.title.message}</p>
          )}
        </div>

        {/* Detail */}
        <div className='flex flex-col gap-1'>
          <Label.Root className='text-[14px] font-medium text-[#0E121B]'>
            {t('worker.services.create.step1.detail')}
          </Label.Root>
          <Textarea.Root
            rows={5}
            placeholder={t('worker.services.create.step1.detailPlaceholder')}
            className='resize-none'
            {...register('description', {
              required: 'Description is required',
              minLength: {
                value: 20,
                message: 'Description must be at least 20 characters'
              }
            })}
          >
            <Textarea.CharCounter current={description.length} max={2000} />
          </Textarea.Root>
          {errors.description && (
            <p className='text-[14px] mt-1 text-red-500'>{errors.description.message}</p>
          )}
        </div>

        {/* Add Tags Field */}
        <div className='flex flex-col gap-1'>
          <Label.Root className='flex items-center gap-1 text-[14px] font-medium text-[#0E121B]'>
            {t('worker.services.create.step1.tags.label')}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7 13.25C10.4518 13.25 13.25 10.4518 13.25 7C13.25 3.54822 10.4518 0.75 7 0.75C3.54822 0.75 0.75 3.54822 0.75 7C0.75 10.4518 3.54822 13.25 7 13.25ZM8.11584 10.2086L8.21565 9.8006C8.16399 9.82486 8.0807 9.85258 7.96649 9.88414C7.85197 9.9157 7.7489 9.93177 7.65831 9.93177C7.46536 9.93177 7.32952 9.90014 7.25065 9.83657C7.17236 9.773 7.13331 9.65342 7.13331 9.47827C7.13331 9.40887 7.14509 9.30542 7.16973 9.17003C7.19361 9.03373 7.22108 8.91261 7.25161 8.80666L7.62419 7.48759C7.66068 7.36653 7.68571 7.23344 7.69916 7.08818C7.71292 6.94325 7.71932 6.84185 7.71932 6.78429C7.71932 6.50614 7.62182 6.28041 7.42676 6.10629C7.2317 5.93229 6.95393 5.84529 6.59396 5.84529C6.39365 5.84529 6.18188 5.88088 5.95776 5.952C5.73363 6.02294 5.49933 6.1084 5.25421 6.2082L5.15415 6.6165C5.22719 6.58949 5.31419 6.56043 5.41598 6.53034C5.51732 6.50038 5.61674 6.48489 5.71347 6.48489C5.91096 6.48489 6.04399 6.51856 6.1137 6.58488C6.18342 6.65139 6.21844 6.7697 6.21844 6.93883C6.21844 7.03236 6.20736 7.13626 6.18438 7.24919C6.16172 7.36282 6.13342 7.48298 6.10013 7.6098L5.72595 8.93419C5.69266 9.07336 5.66834 9.19787 5.65304 9.30843C5.63786 9.41886 5.63057 9.52724 5.63057 9.63262C5.63057 9.90482 5.73114 10.1292 5.93222 10.3063C6.13329 10.4826 6.41523 10.5714 6.77769 10.5714C7.01372 10.5714 7.22088 10.5406 7.39917 10.4785C7.57727 10.4167 7.81644 10.3268 8.11584 10.2086ZM8.04946 4.8502C8.22352 4.68882 8.31014 4.49254 8.31014 4.26272C8.31014 4.03341 8.22365 3.83675 8.04946 3.67331C7.87584 3.51032 7.66657 3.42857 7.4219 3.42857C7.17646 3.42857 6.96635 3.51013 6.79107 3.67331C6.61579 3.83675 6.52796 4.03334 6.52796 4.26272C6.52796 4.49254 6.61579 4.68875 6.79107 4.8502C6.96667 5.01217 7.17639 5.09321 7.4219 5.09321C7.66664 5.09321 7.87584 5.01217 8.04946 4.8502Z" fill="#CACFD8" />
            </svg>
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                placeholder={t('worker.services.create.step1.tags.placeholder')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </Input.Wrapper>
          </Input.Root>
          {tags.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1.5'>
              {tags.map((tag, index) => (
                <Tag.Root key={index} variant='stroke' className='pl-2'>
                  {tag}
                  <Tag.DismissButton onClick={() => handleRemoveTag(tag)} />
                </Tag.Root>
              ))}
            </div>
          )}
          {errors.tags && (
            <p className='text-xs mt-1 text-red-500'>{errors.tags.message}</p>
          )}
        </div>

        {/* File Upload */}
        <div className='flex flex-col gap-1'>
          <label htmlFor='file-upload' className='cursor-pointer'>
            <FileUpload.Root className='w-full'>
              <input
                id='file-upload'
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                className='hidden'
                disabled={!!uploadingFile}
              />
              <FileUpload.Icon
                as={uploadingFile ? RiLoader4Line : RiUploadCloud2Line}
                className={uploadingFile ? 'animate-spin' : ''}
              />
              <div className='space-y-1.5'>
                <div className='text-label-sm text-text-strong-950'>
                  {uploadingFile
                    ? t('worker.services.create.step2.uploadingFile', { fileName: uploadingFile })
                    : t('worker.services.create.step2.chooseFile')}
                </div>
                <div className='text-paragraph-xs text-text-sub-600'>
                  {t('worker.services.create.step2.fileTypes')}
                </div>
              </div>
              <FileUpload.Button>{t('worker.services.create.step2.browseFiles')}</FileUpload.Button>
            </FileUpload.Root>
          </label>

          {fileUploadError && (
            <p className='text-sm mt-1 text-red-500'>{fileUploadError}</p>
          )}

          {/* Display uploaded files */}
          {images.length > 0 && (
            <div className='mt-4 space-y-2'>
              {images.map((file, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded-md border border-stroke-soft-200 p-2'
                >
                  <div className='flex items-center gap-2'>
                    <div className='flex flex-row gap-2 items-center'>
                      <div>
                        {file.url &&
                          file.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                          <div className='bg-bg-soft-100 relative h-10 w-10 overflow-hidden rounded-md'>
                            <img
                              src={file.url}
                              alt={file.name}
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        ) : (
                          <RiFileTextLine className='text-[#525866] size-10' />
                        )}
                      </div>
                      <div className='flex flex-col gap-0'>
                        <p className='text-[14px] font-medium text-[#525866]'>
                          {file.name}
                        </p>
                        <div className='flex items-center gap-1'>
                          <p className='text-[12px] text-[#525866]'>
                            {formatFileSize(file.size) + ' ∙ '}
                          </p>
                          {file.url && (<div className='flex items-center gap-1'>
                            <RiCheckboxCircleFill
                              className='text-green-500'
                              size={16}
                              aria-label={t('worker.services.create.step2.completed')}
                            />
                            <p className='text-[12px] text-[#525866]'>{t('worker.services.create.step2.completed')}</p>
                          </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button.Root
                    variant='neutral'
                    mode='ghost'
                    size='small'
                    onClick={() => handleRemoveFile(file.name)}
                  >
                    <RiDeleteBinLine className='text-[#525866] w-5 h-7' />
                  </Button.Root>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Navigation */}
      <div className='flex items-center justify-between border-t border-stroke-soft-200 p-4'>
        {/* Step Indicators */}
        <div className='flex gap-1.5'>
          <span className='block h-1.5 w-1.5 rounded-full bg-[#122368]'></span>
          <span className='block h-1.5 w-1.5 rounded-full bg-[#EBEBEB]'></span>
          <span className='block h-1.5 w-1.5 rounded-full bg-[#EBEBEB]'></span>
        </div>
        {/* Action Buttons */}
        <div>
          <Button.Root variant='neutral' mode='stroke' className='mr-2'>
            {t('worker.services.create.step1.cancel')}
          </Button.Root>
          <FancyButton.Root
            variant='neutral'
            onClick={nextStep}
            disabled={!isValidToMoveNext()}
          >
            {t('worker.services.create.step1.next')}
          </FancyButton.Root>
        </div>
      </div>
    </div>
  );
}
