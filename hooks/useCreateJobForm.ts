'use client';

import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateJobFormSchema,
  CreateJobFormData,
} from '@/app/[lang]/jobs/create/schema';
import { useAuth } from '@/utils/supabase/AuthContext';
import supabase from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import i18n from '@/i18n';

export interface UseCreateJobFormReturn {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  formMethods: UseFormReturn<CreateJobFormData>;
  onSubmit: (data: CreateJobFormData) => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  uploadFile: (
    file: File,
  ) => Promise<{ name: string; size: number; url: string } | null>;
  removeFile: (fileName: string) => void;
}

const STEPS_COUNT = 4; // Total number of steps

export function useCreateJobForm(): UseCreateJobFormReturn {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const resolver = zodResolver(CreateJobFormSchema) as any;

  const formMethods = useForm<CreateJobFormData>({
    resolver,
    mode: 'onBlur',
    // Explicitly define all defaults matching schema structure
    defaultValues: {
      title: '',
      description: '',
      budget: 0,
      currency: 'USD',
      deadline: undefined,
      negotiateBudget: false,
      skill_levels: [], // New field
      candidate_sources: [], // New field
      files: [], // New field
      usageOption: 'private',
      privacyOption: 'public',
    },
  });

  const nextStep = () => {
    // Optional: Trigger validation for the current step before proceeding
    // const fieldsToValidate = getFieldsForStep(activeStep);
    // formMethods.trigger(fieldsToValidate).then(isValid => {
    //   if (isValid) {
    //      setActiveStep((prev) => Math.min(prev + 1, STEPS_COUNT));
    //   }
    // });
    setActiveStep((prev) => Math.min(prev + 1, STEPS_COUNT));
  };

  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 1));

  // Function to upload a file to Supabase Storage
  const uploadFile = async (file: File) => {
    if (!user) {
      setError('You must be logged in to upload files');
      return null;
    }

    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('job-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        setError(uploadError.message);
        return null;
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('job-files').getPublicUrl(filePath);

      return {
        name: file.name,
        size: file.size,
        url: publicUrl,
      };
    } catch (err) {
      console.error('File upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      return null;
    }
  };

  // Function to remove a file from the form state
  const removeFile = (fileName: string) => {
    const currentFiles = formMethods.getValues('files');
    formMethods.setValue(
      'files',
      currentFiles.filter((file) => file.name !== fileName),
      { shouldValidate: true },
    );
  };

  const onSubmit = async (data: CreateJobFormData) => {
    if (!user) {
      setError('You must be logged in to create a job');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate data using Zod
      const validatedData = CreateJobFormSchema.parse(data);

      // Upload all files first if they exist
      const fileUploads = [];
      for (const fileEntry of validatedData.files) {
        // Skip files that already have a URL (were previously uploaded)
        if (fileEntry.url) {
          fileUploads.push(fileEntry);
          continue;
        }

        // Upload file if the File object exists
        if (fileEntry.file) {
          const uploadedFile = await uploadFile(fileEntry.file);
          if (uploadedFile) {
            fileUploads.push(uploadedFile);
          } else {
            setError(`Failed to upload file: ${fileEntry.name}`);
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Prepare job data for insertion
      const jobData = {
        buyer_id: user.id,
        title: validatedData.title,
        description: validatedData.description,
        budget: validatedData.budget,
        currency: validatedData.currency,
        deadline: validatedData.deadline || null,
        negotiate_budget: validatedData.negotiateBudget || false,
        // Only include requirements if it exists
        ...(validatedData.requirements && {
          requirements: validatedData.requirements,
        }),
        skill_levels: validatedData.skill_levels,
        candidate_sources: validatedData.candidate_sources,
        files: fileUploads.map((file) => ({
          name: file.name,
          size: file.size,
          url: file.url,
        })),
        usage_option: validatedData.usageOption,
        privacy_option: validatedData.privacyOption,
        status: 'open', // Default status for new jobs
      };

      // Insert job into database
      const { error: supabaseError } = await supabase
        .from('jobs')
        .insert(jobData);

      if (supabaseError) {
        console.error('Error creating job:', supabaseError);
        setError(supabaseError.message);
        return;
      }

      // Set success and redirect after a short delay
      setSuccess(true);
      setTimeout(() => {
        const currentLang = i18n.language;
        router.push(`/${currentLang}/settings?tab=orders`);
        router.refresh(); // Refresh the page data
      }, 1000);
    } catch (err) {
      console.error('Job creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeStep,
    setActiveStep,
    formMethods,
    onSubmit,
    nextStep,
    prevStep,
    isSubmitting,
    error,
    success,
    uploadFile,
    removeFile,
  };
}
