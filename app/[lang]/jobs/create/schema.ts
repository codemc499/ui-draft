import { z } from 'zod';

// Based on FormData interface and potential alignment with JobSchema
export const CreateJobFormSchema = z.object({
  // Step 1: Basic Info
  title: z.string().min(1, 'Subject is required'), // Renamed from 'subject' to match JobSchema
  description: z
    .string()
    .min(20, 'Detail must be at least 20 characters')
    .max(1000, 'Detail must be 1000 characters or less'), // Renamed from 'detail'
  budget: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be positive'), // Renamed from 'amount', ensure it's positive
  currency: z.string().min(1, 'Currency is required').default('USD'), // Assuming USD default
  deadline: z.string().optional(), // Keep as string for now, could use z.date() if using a date picker component that yields Date objects
  negotiateBudget: z.boolean().optional().default(false),

  // Step 2: Skills and Requirements
  requirements: z.string().optional(), // Now optional as we're using structured fields instead
  skill_levels: z
    .array(z.enum(['Trainee', 'Director', 'Skilled', 'Expert']))
    .min(1, 'At least one skill level is required'),
  candidate_sources: z
    .array(z.enum(['Manual Entry', 'Referral', 'Skilled']))
    .min(1, 'At least one candidate source is required'),
  files: z
    .array(
      z.object({
        name: z.string(),
        size: z.number(),
        url: z.string().optional(), // For uploaded files from Supabase storage
        file: z.any().optional(), // For File objects during upload
      }),
    )
    .optional()
    .default([]),

  // Step 3: Usage
  usageOption: z
    .enum(['private', 'business'], {
      required_error: 'Usage option is required',
    })
    .default('private'),
  privacyOption: z
    .enum(['public', 'private'], {
      required_error: 'Privacy option is required',
    })
    .default('public'),

  // Optional buyerId for client-side authentication flow
  buyerId: z.string().optional(),
});

export type CreateJobFormData = z.infer<typeof CreateJobFormSchema>;

// Example of refining requirements if it was more structured
// requirements: z.object({
//   skills: z.array(z.string()).optional(),
//   sources: z.array(z.string()).optional(),
//   // Add more fields as needed
// }).optional(),
