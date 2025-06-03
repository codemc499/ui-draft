import { z } from 'zod';

// --- User Schema (maps to public.users) ---

// Define the structure for individual music items within the JSONB array
export const MusicItemSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  remarks: z.string().optional().nullable(), // Remarks can be optional
  originalName: z.string().optional(), // Store original file name for display
});
export type MusicItem = z.infer<typeof MusicItemSchema>;

export const UserSchema = z.object({
  id: z.string(), // TEXT primary key (usually UUID from auth, but TEXT in table)
  created_at: z.string().optional().nullable(), // TIMESTAMPTZ default NOW(), nullable based on schema info (was optional before)
  username: z.string(), // TEXT UNIQUE NOT NULL
  full_name: z.string(), // TEXT NOT NULL
  avatar_url: z.string().url().nullable(), // TEXT, nullable
  bio: z.string().nullable(), // TEXT, nullable
  user_type: z.enum(['buyer', 'seller']), // TEXT NOT NULL CHECK (Assuming these are the only types)
  balance: z.number().default(0), // NUMERIC NOT NULL DEFAULT 0, 10000 for buyers, 0 for sellers
  language: z.enum(['en', 'zh']).optional().nullable(), // TEXT default 'zh' CHECK, nullable based on schema info
  music_data: z.array(MusicItemSchema).optional().nullable(), // JSONB, array of music items, only for sellers
});
export type User = z.infer<typeof UserSchema>;

// --- Base File Schema (for JSONB fields like jobs.files, services.images) ---
export const BaseFileSchema = z.object({
  name: z.string(),
  size: z.number(),
  url: z.string().url(),
  mimeType: z.string().optional(), // Use .optional() for Zod optional fields
});
export type BaseFileData = z.infer<typeof BaseFileSchema>;

// --- Job Schema (maps to public.jobs) ---
export const JobSchema = z.object({
  id: z.string().uuid(), // UUID primary key default uuid_generate_v4()
  created_at: z.string().optional().nullable(), // Changed from datetime() to string() to be more flexible
  title: z.string(), // TEXT NOT NULL
  description: z.string().nullable(), // TEXT, nullable (updated from NOT NULL)
  // requirements: z.string(), // TEXT NOT NULL - This column seems removed based on the new schema list
  budget: z.number(), // NUMERIC NOT NULL
  buyer_id: z.string(), // TEXT NOT NULL REFERENCES users(id)
  status: z.enum(['open', 'in_progress', 'completed']).optional().nullable(), // TEXT default 'open' CHECK, nullable
  currency: z.string().default('USD'), // TEXT NOT NULL DEFAULT 'USD'
  deadline: z.string().nullable(), // DATE NULL (Keep as string or use z.coerce.date())
  negotiate_budget: z.boolean().default(false), // BOOLEAN NOT NULL DEFAULT FALSE
  usage_option: z.enum(['private', 'business']).default('private'), // TEXT NOT NULL DEFAULT 'private' CHECK
  privacy_option: z.enum(['public', 'private']).default('public'), // TEXT NOT NULL DEFAULT 'public' CHECK
  skill_levels: z.array(z.string()).optional().nullable(), // ARRAY (text[]) default '{}'::text[], nullable
  candidate_sources: z.array(z.string()).optional().nullable(), // ARRAY (text[]) default '{}'::text[], nullable
  files: z.array(BaseFileSchema).optional().nullable(), // JSONB default '[]'::jsonb, nullable
});
export type Job = z.infer<typeof JobSchema>;

// --- Service Additional Service Schema ---
const AdditionalServiceSchema = z.object({
  name: z.string(),
  price: z.number(),
  // add other fields if known structure
});

// --- Service Schema (maps to public.services) ---
export const ServiceSchema = z.object({
  id: z.string().uuid(), // UUID primary key default uuid_generate_v4()
  created_at: z.string().optional().nullable(), // TIMESTAMPTZ default NOW(), nullable
  title: z.string(), // TEXT NOT NULL
  description: z.string(), // TEXT NOT NULL
  price: z.number(), // NUMERIC NOT NULL
  seller_id: z.string(), // TEXT NOT NULL REFERENCES users(id)
  seller_name: z.string().optional(), // Added field from join query
  seller_avatar_url: z.string().url().nullable().optional(), // Added field from join query
  seller_bio: z.string().nullable().optional(), // Added field from join query
  audio_url: z.string().url().nullable(), // TEXT, nullable
  tags: z.array(z.string()).optional().nullable(), // ARRAY (text[]) default '{}'::text[], nullable
  lead_time: z.number().int().default(7), // INTEGER NOT NULL DEFAULT 7
  includes: z.array(z.string()).optional().nullable(), // ARRAY (text[]) default '{}'::text[], nullable
  currency: z.string().default('CNY'), // TEXT NOT NULL DEFAULT 'CNY'
  images: z.array(BaseFileSchema).optional().nullable(), // JSONB default '[]'::jsonb, nullable
  additional_services: z.array(AdditionalServiceSchema).optional().nullable(), // JSONB, nullable
});
export type Service = z.infer<typeof ServiceSchema>;

// --- Contract Schema (maps to public.contracts) ---
export const ContractSchema = z
  .object({
    id: z.string().uuid(), // UUID primary key default uuid_generate_v4()
    created_at: z.string().optional().nullable(), // Changed from datetime() to string() to be more flexible
    buyer_id: z.string(), // TEXT NOT NULL REFERENCES users(id)
    seller_id: z.string(), // TEXT NOT NULL REFERENCES users(id)
    job_id: z.string().uuid().nullable(), // UUID REFERENCES jobs(id), nullable
    service_id: z.string().uuid().nullable(), // UUID REFERENCES services(id), nullable
    title: z.string().nullable(), // Added: TEXT NOT NULL -> Changed to nullable
    contract_type: z.enum(['one-time', 'installment']), // Added: TEXT NOT NULL (Assuming these values)
    status: z
      .enum(['pending', 'accepted', 'rejected', 'completed'])
      .optional()
      .nullable(), // TEXT default 'pending' CHECK, nullable
    amount: z.number(), // NUMERIC NOT NULL (Total amount)
    description: z.string(), // TEXT NOT NULL
    attachments: z.array(BaseFileSchema).optional().nullable(), // JSONB, nullable - Assuming structure like job files
    currency: z.string().length(3).default('USD'), // TEXT NOT NULL DEFAULT 'USD' (Assuming 3-letter codes)
  })
  .refine((data) => data.job_id !== null || data.service_id !== null, {
    message: 'Either job_id or service_id must be provided',
    path: ['job_id', 'service_id'], // Adjust path if needed
  });
export type Contract = z.infer<typeof ContractSchema>;

// --- Chat Schema (maps to public.chats) ---
export const ChatSchema = z.object({
  id: z.string().uuid(), // UUID primary key default uuid_generate_v4()
  created_at: z.string().optional().nullable(),
  buyer_id: z.string(), // TEXT NOT NULL REFERENCES users(id)
  seller_id: z.string(), // TEXT NOT NULL REFERENCES users(id)
  contract_id: z.string().uuid().nullable(), // UUID REFERENCES contracts(id), nullable
});
export type Chat = z.infer<typeof ChatSchema>;

// --- Message Schema (maps to public.messages) ---
export const MessageSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().optional().nullable(),
  chat_id: z.string().uuid(),
  sender_id: z.string(),
  content: z.string().nullable(), // Allow content to be nullable if message is just an image/offer etc.
  message_type: z
    .enum([
      'text',
      'image',
      'offer',
      'milestone',
      'system_event',
      'milestone_activated',
      'milestone_completed',
      'audio', // Added audio type
      'file', // Added file type
      'hire_request',
    ])
    .nullable()
    .default('text'),
  data: z.any().nullable().optional(), // Revert to z.any() for flexibility with different data structures
  read: z.boolean().optional().nullable(),
});
export type Message = z.infer<typeof MessageSchema>;

// --- Contract Milestone Schema (maps to public.contract_milestones) ---
export const ContractMilestoneSchema = z.object({
  id: z.string().uuid(), // UUID primary key default uuid_generate_v4()
  contract_id: z.string().uuid(), // UUID NOT NULL REFERENCES contracts(id)
  description: z.string(), // TEXT NOT NULL
  due_date: z.string().nullable(), // Changed from datetime() to string() to be more flexible
  amount: z.number().nullable(), // NUMERIC, nullable
  status: z
    .enum(['pending', 'approved', 'rejected', 'paid'])
    .default('pending'), // TEXT NOT NULL DEFAULT 'pending' (Assuming possible statuses)
  sequence: z.number().int().default(1), // INTEGER NOT NULL DEFAULT 1
  created_at: z.string().optional(), // Changed from datetime() to string() to be more flexible
  updated_at: z.string().optional(), // Changed from datetime() to string() to be more flexible
});
export type ContractMilestone = z.infer<typeof ContractMilestoneSchema>;

export const JobApplicationSchema = z.object({
  id: z.string(),
  job_id: z.string(),
  seller_id: z.string(),
  status: z.enum(['pending', 'accepted', 'rejected']),
  created_at: z.string(),
  updated_at: z.string(),
});
export type JobApplication = z.infer<typeof JobApplicationSchema>;
