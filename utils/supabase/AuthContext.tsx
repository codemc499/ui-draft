'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import {
  supabase,
  authOperations,
  userOperations,
  type SignUpCredentials,
  type SignInCredentials,
} from './index';
import type { User as AppUser } from './types';

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: AppUser | null;
  loading: boolean; // Indicates initial auth state check
  profileLoading: boolean; // Indicates profile fetching status
  signIn: (
    credentials: SignInCredentials,
  ) => Promise<{ user: SupabaseUser | null; error: string | null }>;
  signUp: (
    credentials: SignUpCredentials,
  ) => Promise<{ user: SupabaseUser | null; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true); // Tracks initial load
  const [profileLoading, setProfileLoading] = useState(false); // Tracks profile fetch

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchProfile = async (userId: string) => {
      if (!isMounted) return;
      setProfileLoading(true);
      try {
        console.log('[AuthContext] Fetching profile for user:', userId);
        const profile = await userOperations.getUserById(userId);
        if (isMounted) {
          setUserProfile(profile);
          console.log('[AuthContext] Profile fetched:', profile);
        }
      } catch (error) {
        console.error('[AuthContext] Error fetching user profile:', error);
        if (isMounted) {
          setUserProfile(null);
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
          console.log('[AuthContext] Profile fetching finished.');
        }
      }
    };

    // 1. Initial Session Check
    authOperations
      .getUser()
      .then(({ user: sessionUser }) => {
        if (!isMounted) return;
        console.log('[AuthContext] Initial session check complete. User:', sessionUser);
        setUser(sessionUser);
        if (sessionUser) {
          // Fetch profile only if user exists
          fetchProfile(sessionUser.id);
        } else {
          // No user, no profile to fetch
          setUserProfile(null);
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error('[AuthContext] Error during initial getUser:', error);
        setUser(null);
        setUserProfile(null);
      })
      .finally(() => {
        if (isMounted) {
          // Set initial loading to false after check completes
          setLoading(false);
          console.log('[AuthContext] Initial loading finished.');
        }
      });

    // 2. Auth State Change Listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;
        const sessionUser = session?.user ?? null;
        console.log('[AuthContext] Auth state changed. New user:', sessionUser);
        setUser(sessionUser);
        if (sessionUser) {
          // If user changes, fetch profile
          // Check if profile is already being fetched or matches current user
          if (user?.id !== sessionUser.id || !userProfile) {
            fetchProfile(sessionUser.id);
          }
        } else {
          // User logged out
          setUserProfile(null);
          setProfileLoading(false); // Ensure profile loading stops on logout
        }
        // Note: We don't set the main 'loading' state here, only initial load
      },
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
      console.log('[AuthContext] Unsubscribed from auth changes.');
    };
  }, []); // Run only once on mount

  const signIn = async (credentials: SignInCredentials) => {
    const result = await authOperations.signIn(credentials);
    // Profile fetching is handled by onAuthStateChange
    return result;
  };

  const signUp = async (credentials: SignUpCredentials) => {
    const result = await authOperations.signUp(credentials);
    // Profile fetching is handled by onAuthStateChange
    return result;
  };

  const signOut = async () => {
    const { error } = await authOperations.signOut();
    // State updates (user, userProfile) handled by onAuthStateChange
    return { error: error ? error.toString() : null };
  };

  const value = {
    user,
    userProfile,
    loading, // Expose initial loading state
    profileLoading, // Expose profile loading state
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
