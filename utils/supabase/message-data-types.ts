import { z } from 'zod';
import { BaseFileSchema } from './types'; // Assuming BaseFileData schema is exported as BaseFileSchema

// --- Image Message Data ---
export const ImageMessageDataSchema = z.array(BaseFileSchema);
export type ImageMessageData = z.infer<typeof ImageMessageDataSchema>;

// --- Offer Message Data ---
export const OfferMessageDataSchema = z.object({
  price: z.number(),
  title: z.string(),
  currency: z.string(),
  contractId: z.string().uuid(), // Assuming contractId is a UUID
  description: z.string(),
  deliveryTime: z.string(), // Keep as string, could be refined (e.g., z.coerce.date()) if needed
});
export type OfferMessageData = z.infer<typeof OfferMessageDataSchema>;

// --- Milestone Event Data ---
export const MilestoneEventDataSchema = z.object({
  milestoneId: z.string().uuid(), // Assuming milestoneId is a UUID
  contractId: z.string().uuid(), // Assuming contractId is a UUID
  description: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(['activated', 'completed']), // Status indicates the type of event
});
export type MilestoneEventData = z.infer<typeof MilestoneEventDataSchema>;

// --- System Event Data ---
export const SystemEventDataSchema = z.object({
  eventText: z.string(),
  // Optional button fields if needed in the future
  // buttonLabel: z.string().optional(),
  // buttonLink: z.string().url().optional(),
});
export type SystemEventData = z.infer<typeof SystemEventDataSchema>;

// --- Union Schema for Validation (Optional but recommended) ---
// This helps validate the 'data' field based on 'message_type' if needed elsewhere
// export const MessageDataSchema = z.union([
//   ImageMessageDataSchema,
//   OfferMessageDataSchema,
//   MilestoneEventDataSchema,
//   SystemEventDataSchema,
//   z.null(), // For 'text' messages where data is null
// ]);
// export type MessageData = z.infer<typeof MessageDataSchema>;
