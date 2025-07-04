import { createSupabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const dynamic = 'force-dynamic';

export default async function ForgotPasswordPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const supabase = await createSupabaseServerClient();

  // Check if the user is already authenticated
  const { data } = await supabase.auth.getSession();
  const isAuthenticated = !!data.session;

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    redirect(`/${params.lang}/dashboard`);
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#F6F8FA] px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
