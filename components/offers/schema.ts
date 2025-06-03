import { z } from 'zod';

// Define the payment type enum
const PaymentType = z.enum(['one-time', 'installment']);

// Define the base file schema mirroring types.ts for consistency
// Revert: URL is now required by the time validation runs
const BaseFileSchema = z.object({
  name: z.string(),
  size: z.number(),
  url: z.string().url(), // URL is required again
  // file: z.instanceof(File).optional(), // Remove optional file property
});

// Define the milestone schema for installment payments
const MilestoneSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  // currency: z.string().length(3, 'Currency code must be 3 letters'), // Removed - Not in DB schema
  dueDate: z.date().optional().nullable(), // Renamed from deadline, match DB type (nullable)
  // Optional: Add currency to milestones if needed, sync with Contract currency otherwise
  // currency: z.string().length(3).optional(),
});

// Define the main form schema
export const SendOfferSchema = z
  .object({
    // Offer Details
    // Assuming 'sendTo' is the seller's user ID (string/text)
    // Assuming 'selectOrder' is the job's ID (string/uuid)
    sendTo: z.string().min(1, 'Recipient is required'),
    selectOrder: z
      .string()
      .uuid('Invalid Order ID format')
      .min(1, 'Order selection is required'),
    contractTitle: z.string().min(1, 'Contract title is required'),
    description: z.string().min(1, 'Description is required').max(5000), // Allow longer description
    // skillLevels: z // This field is not part of the Contract schema, removing
    //   .array(z.string())
    //   .min(1, 'At least one skill level is required'),

    // Contract Terms
    paymentType: PaymentType,
    amount: z.number().positive('Amount must be positive').optional(),
    // Add currency back - make it required for the form
    currency: z
      .string()
      .length(3, 'Currency code must be 3 letters')
      .min(1, 'Currency is required'), // Add min(1) to make it required
    deadline: z.date().optional().nullable(), // Deadline for the overall contract (if applicable)

    // Installment specific fields
    milestones: z.array(MilestoneSchema).optional(),

    // Attachments
    // Uses BaseFileSchema which now requires URL
    attachments: z.array(BaseFileSchema).optional().nullable(), // Matches contract.attachments (jsonb)

    // Agreement
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),

    skillLevels: z
    .array(z.enum(['Trainee', 'Director', 'Skilled', 'Expert']))
    .min(0, 'At least one skill level is required'),
  })
  .refine(
    (data) => {
      if (data.paymentType === 'one-time') {
        // For one-time payment, amount AND currency are now required
        return (
          data.amount !== undefined &&
          data.amount > 0 &&
          data.currency !== undefined &&
          data.currency.length === 3
        );
      }
      return true;
    },
    {
      // Update message to reflect both requirements
      message: 'Amount and Currency are required for one-time payment',
      path: ['amount'], // Point error to amount, but message covers both
    },
  )
  .refine(
    (data) => {
      if (data.paymentType === 'installment') {
        // For installment payment, milestones are required
        return data.milestones && data.milestones.length > 0;
      }
      return true;
    },
    {
      message: 'At least one milestone is required for installment payment',
      path: ['milestones'],
    },
  );

// Export the inferred TypeScript type
export type SendOfferFormData = z.infer<typeof SendOfferSchema>;
