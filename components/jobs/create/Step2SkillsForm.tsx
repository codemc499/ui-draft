'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, UseFormReturn } from 'react-hook-form';
import * as Button from '@/components/ui/button';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Tag from '@/components/ui/tag';
import {
  RiInformationLine,
  RiDeleteBinLine,
  RiFileTextLine,
  RiCheckboxCircleFill,
  RiUploadCloud2Line,
  RiCloseLine,
  RiLoader4Line,
  RiLoader2Fill,
} from '@remixicon/react';
import { CreateJobFormData } from '@/app/[lang]/jobs/create/schema';

import { useCreateJobForm } from '@/hooks/useCreateJobForm';
import * as FancyButton from '@/components/ui/fancy-button';
// import * as FileFormatIcon from '@/components/ui/file-format-icon'; // Ensure this import is removed or commented out
import * as CompactButton from '@/components/ui/compact-button';
import * as Divider from '@/components/ui/divider';
// Define union types for skill levels and sources
type SkillLevel = 'Trainee' | 'Director' | 'Skilled' | 'Expert';
type CandidateSource = 'Manual Entry' | 'Referral' | 'Skilled';

// Define constants outside the component function scope
const MAX_FILES = 3;
const MAX_SIZE_MB = 25;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface Step2Props {
  formMethods: UseFormReturn<CreateJobFormData>;
  nextStep: () => void;
  prevStep: () => void;
}

const Step2SkillsForm: React.FC<Step2Props> = ({
  formMethods,
  nextStep,
  prevStep,
}) => {
  const { t } = useTranslation('common');
  const {
    // register,
    formState: { errors },
    control,
    setValue,
    getValues,
    watch,
  } = formMethods;

  const { uploadFile } = useCreateJobForm();
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  // Watch the arrays for displaying selected items
  const watchSkillLevels = watch('skill_levels') || [];
  const watchCandidateSources = watch('candidate_sources') || [];
  const watchFiles = watch('files') || [];

  // Skill level options
  const skillLevelOptions = [
    { label: 'Trainee', value: 'Trainee' as SkillLevel },
    { label: 'Director', value: 'Director' as SkillLevel },
    { label: 'Skilled', value: 'Skilled' as SkillLevel },
    { label: 'Expert', value: 'Expert' as SkillLevel },
  ];

  // Candidate source options
  const candidateSourceOptions = [
    { label: 'Manual Entry', value: 'Manual Entry' as CandidateSource },
    { label: 'Referral', value: 'Referral' as CandidateSource },
    { label: 'Skilled', value: 'Skilled' as CandidateSource },
  ];

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploadError(null);
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const currentFiles = getValues('files') || [];

    // --- File Count Check --- 
    if (currentFiles.length + files.length > MAX_FILES) {
      setFileUploadError(`Maximum ${MAX_FILES} files allowed.`);
      e.target.value = ''; // Clear the input
      return;
    }

    let filesToUpload = [];
    let validationError = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // --- Format Check --- 
      const isValidFormat =
        file.type === 'audio/mpeg' ||
        file.name.toLowerCase().endsWith('.mp3');

      // --- Size Check --- 
      const isValidSize = file.size <= MAX_SIZE_BYTES;

      if (!isValidFormat) {
        validationError = 'Only MP3 audio files are allowed.';
        break; // Stop processing further files if one is invalid
      }

      if (!isValidSize) {
        validationError = `Files must be under ${MAX_SIZE_MB}MB.`;
        break; // Stop processing further files if one is invalid
      }

      filesToUpload.push(file);
    }

    if (validationError) {
      setFileUploadError(validationError);
      e.target.value = ''; // Clear the input
      return;
    }

    // Proceed with uploading valid files
    let newUploadedFiles = [];
    for (const file of filesToUpload) {
      setUploadingFile(file.name);
      try {
        const uploadedFile = await uploadFile(file); // Assume uploadFile handles the actual upload
        if (uploadedFile) {
          newUploadedFiles.push(uploadedFile);
        } else {
          setFileUploadError(`Failed to upload ${file.name}. Please try again.`);
          // Optionally decide if you want to stop all uploads if one fails
          // break;
        }
      } catch (error) {
        console.error('Error during file upload:', error);
        setFileUploadError(`Error uploading ${file.name}.`);
        // Optionally break here too
      } finally {
        setUploadingFile(null);
      }
    }

    // Update form state only after all selected files are processed
    if (newUploadedFiles.length > 0) {
      setValue('files', [...currentFiles, ...newUploadedFiles], { shouldValidate: true });
    }

    // Reset the file input value if needed (especially if some uploads failed)
    e.target.value = '';
  };

  // Handle removing a file
  const handleRemoveFile = (fileName: string) => {
    const currentFiles = getValues('files') || [];
    setValue(
      'files',
      currentFiles.filter((file) => file.name !== fileName),
      { shouldValidate: true },
    );
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Handle skill level selection
  const handleSkillLevelSelect = (value: string) => {
    const currentSkillLevels = getValues('skill_levels') || [];
    if (!currentSkillLevels.includes(value as SkillLevel)) {
      setValue('skill_levels', [...currentSkillLevels, value as SkillLevel], {
        shouldValidate: true,
      });
    }
  };

  // Handle removing a skill level
  const handleRemoveSkillLevel = (value: SkillLevel) => {
    const currentSkillLevels = getValues('skill_levels') || [];
    setValue(
      'skill_levels',
      currentSkillLevels.filter((level) => level !== value),
      { shouldValidate: true },
    );
  };

  // Handle candidate source selection
  const handleCandidateSourceSelect = (value: string) => {
    const currentSources = getValues('candidate_sources') || [];
    if (!currentSources.includes(value as CandidateSource)) {
      setValue(
        'candidate_sources',
        [...currentSources, value as CandidateSource],
        {
          shouldValidate: true,
        },
      );
    }
  };

  // Handle removing a candidate source
  const handleRemoveCandidateSource = (value: CandidateSource) => {
    const currentSources = getValues('candidate_sources') || [];
    setValue(
      'candidate_sources',
      currentSources.filter((source) => source !== value),
      { shouldValidate: true },
    );
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className='space-y-6'>
      {/* Skill Levels */}
      <div className='flex flex-col gap-1.5 mt-2 px-4'>
        <div className='flex items-center gap-1'>
          <Label.Root className='text-[14px] text-[#525866] font-medium'>
            {t('jobs.create.step2.skillLevels')}
          </Label.Root>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7 13.25C10.4518 13.25 13.25 10.4518 13.25 7C13.25 3.54822 10.4518 0.75 7 0.75C3.54822 0.75 0.75 3.54822 0.75 7C0.75 10.4518 3.54822 13.25 7 13.25ZM8.11584 10.2086L8.21565 9.8006C8.16399 9.82486 8.0807 9.85258 7.96649 9.88414C7.85197 9.9157 7.7489 9.93177 7.65831 9.93177C7.46536 9.93177 7.32952 9.90014 7.25065 9.83657C7.17236 9.773 7.13331 9.65342 7.13331 9.47827C7.13331 9.40887 7.14509 9.30542 7.16973 9.17003C7.19361 9.03373 7.22108 8.91261 7.25161 8.80666L7.62419 7.48759C7.66068 7.36653 7.68571 7.23344 7.69916 7.08818C7.71292 6.94325 7.71932 6.84185 7.71932 6.78429C7.71932 6.50614 7.62182 6.28041 7.42676 6.10629C7.2317 5.93229 6.95393 5.84529 6.59396 5.84529C6.39365 5.84529 6.18188 5.88088 5.95776 5.952C5.73363 6.02294 5.49933 6.1084 5.25421 6.2082L5.15415 6.6165C5.22719 6.58949 5.31419 6.56043 5.41598 6.53034C5.51732 6.50038 5.61674 6.48489 5.71347 6.48489C5.91096 6.48489 6.04399 6.51856 6.1137 6.58488C6.18342 6.65139 6.21844 6.7697 6.21844 6.93883C6.21844 7.03236 6.20736 7.13626 6.18438 7.24919C6.16172 7.36282 6.13342 7.48298 6.10013 7.6098L5.72595 8.93419C5.69266 9.07336 5.66834 9.19787 5.65304 9.30843C5.63786 9.41886 5.63057 9.52724 5.63057 9.63262C5.63057 9.90482 5.73114 10.1292 5.93222 10.3063C6.13329 10.4826 6.41523 10.5714 6.77769 10.5714C7.01372 10.5714 7.22088 10.5406 7.39917 10.4785C7.57727 10.4167 7.81644 10.3268 8.11584 10.2086ZM8.04946 4.8502C8.22352 4.68882 8.31014 4.49254 8.31014 4.26272C8.31014 4.03341 8.22365 3.83675 8.04946 3.67331C7.87584 3.51032 7.66657 3.42857 7.4219 3.42857C7.17646 3.42857 6.96635 3.51013 6.79107 3.67331C6.61579 3.83675 6.52796 4.03334 6.52796 4.26272C6.52796 4.49254 6.61579 4.68875 6.79107 4.8502C6.96667 5.01217 7.17639 5.09321 7.4219 5.09321C7.66664 5.09321 7.87584 5.01217 8.04946 4.8502Z" fill="#CACFD8" />
          </svg>
        </div>

        <Controller
          name='skill_levels'
          control={control}
          render={() => (
            <div>
              <Select.Root value='' onValueChange={handleSkillLevelSelect}>
                <Select.Trigger className='w-full'>
                  <Select.Value placeholder={t('jobs.create.step2.selectSkillLevels')} />
                </Select.Trigger>
                <Select.Content>
                  {skillLevelOptions.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>

              <div className='mt-2 flex flex-wrap gap-2'>
                {watchSkillLevels.map((level) => (
                  <Tag.Root key={level} variant='stroke' className='hover:text-[#525866]'>
                    {level}
                    <button
                      type='button'
                      onClick={() => handleRemoveSkillLevel(level)}
                      className='ml-1 inline-flex items-center'
                      aria-label={t('jobs.create.step2.remove')}
                    >
                      <RiCloseLine size={14} className='text-[#99A0AE]' />
                    </button>
                  </Tag.Root>
                ))}
              </div>

              {errors.skill_levels && (
                <p className='text-xs mt-1 text-red-500'>
                  {Array.isArray(errors.skill_levels)
                    ? errors.skill_levels[0]?.message
                    : errors.skill_levels.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Candidate Sources */}
      <div className='flex flex-col gap-1 !mt-5 px-4'>
        <div className='flex items-center gap-1'>
          <Label.Root className='text-[14px] text-[#525866] font-medium'>
            {t('jobs.create.step2.candidateSources')}
          </Label.Root>
          <svg className='mt-[1px]' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7 13.25C10.4518 13.25 13.25 10.4518 13.25 7C13.25 3.54822 10.4518 0.75 7 0.75C3.54822 0.75 0.75 3.54822 0.75 7C0.75 10.4518 3.54822 13.25 7 13.25ZM8.11584 10.2086L8.21565 9.8006C8.16399 9.82486 8.0807 9.85258 7.96649 9.88414C7.85197 9.9157 7.7489 9.93177 7.65831 9.93177C7.46536 9.93177 7.32952 9.90014 7.25065 9.83657C7.17236 9.773 7.13331 9.65342 7.13331 9.47827C7.13331 9.40887 7.14509 9.30542 7.16973 9.17003C7.19361 9.03373 7.22108 8.91261 7.25161 8.80666L7.62419 7.48759C7.66068 7.36653 7.68571 7.23344 7.69916 7.08818C7.71292 6.94325 7.71932 6.84185 7.71932 6.78429C7.71932 6.50614 7.62182 6.28041 7.42676 6.10629C7.2317 5.93229 6.95393 5.84529 6.59396 5.84529C6.39365 5.84529 6.18188 5.88088 5.95776 5.952C5.73363 6.02294 5.49933 6.1084 5.25421 6.2082L5.15415 6.6165C5.22719 6.58949 5.31419 6.56043 5.41598 6.53034C5.51732 6.50038 5.61674 6.48489 5.71347 6.48489C5.91096 6.48489 6.04399 6.51856 6.1137 6.58488C6.18342 6.65139 6.21844 6.7697 6.21844 6.93883C6.21844 7.03236 6.20736 7.13626 6.18438 7.24919C6.16172 7.36282 6.13342 7.48298 6.10013 7.6098L5.72595 8.93419C5.69266 9.07336 5.66834 9.19787 5.65304 9.30843C5.63786 9.41886 5.63057 9.52724 5.63057 9.63262C5.63057 9.90482 5.73114 10.1292 5.93222 10.3063C6.13329 10.4826 6.41523 10.5714 6.77769 10.5714C7.01372 10.5714 7.22088 10.5406 7.39917 10.4785C7.57727 10.4167 7.81644 10.3268 8.11584 10.2086ZM8.04946 4.8502C8.22352 4.68882 8.31014 4.49254 8.31014 4.26272C8.31014 4.03341 8.22365 3.83675 8.04946 3.67331C7.87584 3.51032 7.66657 3.42857 7.4219 3.42857C7.17646 3.42857 6.96635 3.51013 6.79107 3.67331C6.61579 3.83675 6.52796 4.03334 6.52796 4.26272C6.52796 4.49254 6.61579 4.68875 6.79107 4.8502C6.96667 5.01217 7.17639 5.09321 7.4219 5.09321C7.66664 5.09321 7.87584 5.01217 8.04946 4.8502Z" fill="#CACFD8" />
          </svg>
        </div>

        <Controller
          name='candidate_sources'
          control={control}
          render={() => (
            <div>
              <Select.Root value='' onValueChange={handleCandidateSourceSelect}>
                <Select.Trigger className='w-full'>
                  <Select.Value placeholder={t('jobs.create.step2.selectCandidateSources')} />
                </Select.Trigger>
                <Select.Content>
                  {candidateSourceOptions.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>

              <div className='mt-2 flex flex-wrap gap-2'>
                {watchCandidateSources.map((source) => (
                  <Tag.Root key={source} variant='stroke' className='hover:text-[#525866]'>
                    {source}
                    <button
                      type='button'
                      onClick={() => handleRemoveCandidateSource(source)}
                      className='ml-1 inline-flex items-center'
                      aria-label={t('jobs.create.step2.remove')}
                    >
                      <RiCloseLine size={14} />
                    </button>
                  </Tag.Root>
                ))}
              </div>

              {errors.candidate_sources && (
                <p className='text-xs mt-1 text-red-500'>
                  {Array.isArray(errors.candidate_sources)
                    ? errors.candidate_sources[0]?.message
                    : errors.candidate_sources.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* File Upload */}
      <div className='flex flex-col gap-1 !mt-5 px-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col justify-center gap-0.5'>
            <Label.Root className='text-[14px] text-[#525866] font-medium'>
              {t('jobs.create.step2.addDownloadFile')}
              <span className='text-[#525866] font-normal'>({t('jobs.create.step2.fileLimits', { maxFiles: MAX_FILES, maxSize: MAX_SIZE_MB })})</span>
            </Label.Root>
            <p className='text-[#99A0AE] text-[12px]'>
              {t('jobs.create.step2.fileFormatLimits')}
            </p>
          </div>

          <label htmlFor='file-upload' className='cursor-pointer'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              type='button'
              className='flex items-center'
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={!!uploadingFile || watchFiles.length >= MAX_FILES}
            >
              {uploadingFile ? (
                <>
                  <RiLoader4Line className='mr-2 animate-spin' />
                  {t('jobs.create.step2.uploading')}
                </>
              ) : (
                <>
                  {t('jobs.create.step2.upload')}
                </>
              )}
            </Button.Root>
            <input
              id='file-upload'
              type='file'
              accept='.mp3,audio/mpeg'
              onChange={handleFileUpload}
              className='hidden'
              disabled={!!uploadingFile || watchFiles.length >= MAX_FILES}
              multiple
            />
          </label>
        </div>

        {uploadingFile && (
          <p className='text-sm text-primary-500 mt-1'>
            {t('jobs.create.step2.uploadingFile', { fileName: uploadingFile })}
          </p>
        )}

        {fileUploadError && (
          <p className='text-sm mt-1 text-red-500'>{fileUploadError}</p>
        )}

        <div className='mt-2 space-y-4'>
          {watchFiles.map((file, index) => {
            const fileExt = file.name.split('.').pop()?.toUpperCase() || 'FILE';
            return (
              <div
                key={index}
                className='flex items-start gap-3 rounded-2xl border border-stroke-soft-200 p-4 pl-3.5'
              >
                <div className='flex-1 space-y-1'>
                  <div className='text-label-sm text-text-strong-950'>
                    {file.name}
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='text-paragraph-xs text-text-sub-600'>
                      {formatFileSize(file.size)}
                    </span>
                    <span className='text-paragraph-xs size-3 text-text-sub-600'>
                      <svg width="2" height="2" className='mx-auto mt-[5px]' viewBox="0 0 8 8" fill="#525866" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="4" cy="4" r="4" />
                      </svg>
                    </span>
                    {file.url ? (
                      <>
                        <RiCheckboxCircleFill className='size-4 shrink-0 text-success-base' />
                        <span className='text-paragraph-xs text-[#525866]'>
                          {t('jobs.create.step2.completed')}
                        </span>
                      </>
                    ) : (
                      <>
                        <RiLoader2Fill className='size-4 shrink-0 animate-spin text-primary-base' />
                        <span className='text-paragraph-xs text-text-strong-950'>
                          {t('jobs.create.step2.processing')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <CompactButton.Root variant='ghost' size='medium' className='' onClick={() => handleRemoveFile(file.name)}>
                  <CompactButton.Icon className='h-24 w-24' as={RiDeleteBinLine} />
                </CompactButton.Root>
              </div>
            );
          })}
        </div>
      </div>

      <Divider.Root className='w-full' />

      {/* Navigation */}
      <div className='flex justify-between px-4'>
        <Button.Root variant='neutral' mode='stroke' onClick={prevStep}>
          {t('jobs.create.previous')}
        </Button.Root>
        <FancyButton.Root onClick={nextStep}>
          {t('jobs.create.next')}
        </FancyButton.Root>
      </div>
    </form>
  );
};

export default Step2SkillsForm;
