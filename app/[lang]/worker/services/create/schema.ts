import { z } from 'zod';

// Define schema for an individual additional service
const AdditionalServiceSchema = z.object({
  id: z.string().optional(), // Optional: Assign unique ID for key prop if needed
  name: z.string().min(1, 'Service name is required'),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .positive('Price must be positive'),
});

// Service creation form schema
export const CreateServiceFormSchema = z.object({
  // Step 1: Basic Info
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  tags: z.array(z.string()),

  // For file uploads
  images: z
    .array(
      z.object({
        name: z.string(),
        size: z.number(),
        url: z.string().optional(), // For uploaded files from Supabase storage
        file: z.any().optional(), // For File objects during upload
      }),
    )
    .max(5, 'Maximum of 5 images allowed'),

  // Step 2: Pricing and Details
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .positive('Price must be positive'),
  currency: z.string().default('USD'), // Defaulting to USD as per image
  lead_time: z.number().int().positive('Lead time must be a positive integer'),
  includes: z.array(z.string()), // Keeping includes as it might be relevant
  additionalServices: z.array(AdditionalServiceSchema).optional().default([]), // ADDED field

  // For form state
  seller_id: z.string().optional(), // Will be set from auth context
});

export type CreateServiceFormData = z.infer<typeof CreateServiceFormSchema>;
// You might want to export this type too for use in the component
export type AdditionalService = z.infer<typeof AdditionalServiceSchema>;

// Helper function to determine if step 1 is complete
export function isStep1Complete(data: Partial<CreateServiceFormData>): boolean {
  return !!(
    data.title &&
    data.description &&
    data.tags?.length &&
    data.images?.length
  );
}

// Helper function to determine if step 2 is complete (restored original fields + additional service check)
export function isStep2Complete(data: Partial<CreateServiceFormData>): boolean {
  const mainFieldsComplete = !!(
    data.price &&
    data.price > 0 &&
    data.currency &&
    data.lead_time &&
    data.lead_time > 0
  );

  // Also check if all added additional services are valid (name and positive price)
  const additionalServicesValid = (data.additionalServices ?? []).every(
    (service) =>
      service.name &&
      service.name.length > 0 &&
      service.price &&
      service.price > 0,
  );

  console.log(data.additionalServices);
  console.log(mainFieldsComplete);
  console.log(additionalServicesValid);

  return mainFieldsComplete && additionalServicesValid;
}
