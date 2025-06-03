'use client';

import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateServiceFormSchema,
  CreateServiceFormData,
} from '@/app/[lang]/worker/services/create/schema';
import { useAuth } from '@/utils/supabase/AuthContext';
import supabase from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import i18n from '@/i18n';

export interface UseCreateServiceFormReturn {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  formMethods: UseFormReturn<CreateServiceFormData>;
  onSubmit: (data: CreateServiceFormData) => Promise<void>;
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

const STEPS_COUNT = 3; // Total number of steps

export function useCreateServiceForm(): UseCreateServiceFormReturn {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Setup form with zod resolver
  const resolver = zodResolver(CreateServiceFormSchema) as any;

  const formMethods = useForm<CreateServiceFormData>({
    resolver,
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      images: [],
      price: 0,
      currency: 'USD',
      lead_time: 7,
      includes: ['Source Files', 'Commercial Use License'],
      additionalServices: [],
    },
  });

  const nextStep = () => {
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
        .from('service-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        setError(uploadError.message);
        return null;
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('service-images').getPublicUrl(filePath);

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
    const currentFiles = formMethods.getValues('images') || [];
    formMethods.setValue(
      'images',
      currentFiles.filter((file) => file.name !== fileName),
      { shouldValidate: true },
    );
  };

  const onSubmit = async (data: CreateServiceFormData) => {
    if (!user) {
      setError('You must be logged in to create a service');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate data using Zod
      const validatedData = CreateServiceFormSchema.parse(data);

      // Upload all images first if they exist
      const imageUploads = [];
      for (const imageEntry of validatedData.images) {
        // Skip files that already have a URL (were previously uploaded)
        if (imageEntry.url) {
          imageUploads.push(imageEntry);
          continue;
        }

        // Upload file if the File object exists
        if (imageEntry.file) {
          const uploadedFile = await uploadFile(imageEntry.file);
          if (uploadedFile) {
            imageUploads.push(uploadedFile);
          } else {
            setError(`Failed to upload file: ${imageEntry.name}`);
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Prepare service data for insertion
      const serviceData = {
        seller_id: user.id,
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        currency: validatedData.currency,
        lead_time: validatedData.lead_time,
        tags: validatedData.tags,
        includes: validatedData.includes,
        images: imageUploads.map((img) => ({
          name: img.name,
          size: img.size,
          url: img.url,
        })),
        additional_services: validatedData.additionalServices || [],
      };

      // Insert service into database
      const { error: supabaseError } = await supabase
        .from('services')
        .insert(serviceData);

      if (supabaseError) {
        console.error('Error creating service:', supabaseError);
        setError(supabaseError.message);
        return;
      }

      // Set success and redirect after a short delay
      setSuccess(true);
      setTimeout(() => {
        const currentLang = i18n.language;
        router.push(`/${currentLang}/settings?tab=my-services`);
        router.refresh(); // Refresh the page data
      }, 1000);
    } catch (err) {
      console.error('Service creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create service');
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
