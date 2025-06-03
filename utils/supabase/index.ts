// Client exports
export { default as supabase } from './client';
// Only import createServerClient in server-side app router code
// export { createServerClient } from './server';

// Types exports
export * from './types';

// Operations exports
export { userOperations } from './database';

export { authOperations } from './auth';
export type { SignUpCredentials, SignInCredentials } from './auth';

// Authentication exports
export { SignUpSchema, SignInSchema } from './auth';
