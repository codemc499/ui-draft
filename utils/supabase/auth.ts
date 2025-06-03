import supabase from './client';
import { z } from 'zod';

// Validation schemas for auth operations
export const SignUpSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2, 'Full name is required'),
  user_type: z.enum(['buyer', 'seller'], {
    required_error: 'Please select a role',
  }),
});

export const SignInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type SignUpCredentials = z.infer<typeof SignUpSchema>;
export type SignInCredentials = z.infer<typeof SignInSchema>;

/**
 * Auth-related operations
 */
export const authOperations = {
  // Sign up a new user
  async signUp(credentials: SignUpCredentials) {
    try {
      // Validate credentials
      SignUpSchema.parse(credentials);

      const { email, password, full_name, user_type } = credentials;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            user_type,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data.user, error: null };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return { user: null, error: err.errors[0].message };
      }
      console.error('Sign up error:', err);
      return { user: null, error: 'An error occurred during sign up' };
    }
  },

  // Sign in an existing user
  async signIn(credentials: SignInCredentials) {
    try {
      // Validate credentials
      SignInSchema.parse(credentials);

      const { email, password } = credentials;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data.user, error: null };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return { user: null, error: err.errors[0].message };
      }
      return { user: null, error: 'An error occurred during sign in' };
    }
  },

  // Sign out the current user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get the current user session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return { session: null, error: error?.message || 'No active session' };
    }

    return { session: data.session, error: null };
  },

  // Get the current user
  async getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return { user: null, error: error?.message || 'No user found' };
    }

    return { user: data.user, error: null };
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error: error?.message || null };
  },

  // Update user password
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    return { error: error?.message || null };
  },
};
