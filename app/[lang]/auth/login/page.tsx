import React from 'react';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import LoginFormSkeleton from '@/components/auth/LoginFormSkeleton';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const supabase = await createSupabaseServerClient();

  // Check if the user is already authenticated
  const { data } = await supabase.auth.getSession();
  const isAuthenticated = !!data.session;

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    redirect(`/${params.lang}/home`);
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#F6F8FA] px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
