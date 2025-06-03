import { createSupabaseServerClient } from '@/utils/supabase/server';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function ForgotPasswordPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const supabase = await createSupabaseServerClient();

  // Check if the user is already authenticated
  const { data } = await supabase.auth.getSession();
  const isAuthenticated = !!data.session;

  // If already authenticated, redirect to dashboard
  // if (isAuthenticated) {
  //   redirect(`/${params.lang}/dashboard`);
  // }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-500">
      <div className="relative w-[390px] h-[350px] bg-white rounded-2xl text-center px-5 py-10">
        <div className="absolute top-4 right-5 cursor-pointer text-gray-500 text-xl font-semibold">
          X
        </div>

        <div className="flex justify-center my-4">
          <svg width="88" height="88" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.0052 4.57844C9.95408 4.23815 8.81136 4.71148 8.30867 5.6954L7.70433 6.87828C7.63253 7.01883 7.51822 7.13314 7.37767 7.20494L6.19479 7.80928C5.21087 8.31197 4.73754 9.45469 5.07783 10.5059L5.48692 11.7696C5.53553 11.9198 5.53553 12.0815 5.48692 12.2316L5.07783 13.4954C4.73754 14.5466 5.21087 15.6893 6.19479 16.192L7.37767 16.7963C7.51822 16.8681 7.63253 16.9824 7.70433 17.123L8.30867 18.3059C8.81136 19.2898 9.95408 19.7631 11.0052 19.4228L12.269 19.0137C12.4191 18.9651 12.5808 18.9651 12.731 19.0137L13.9947 19.4228C15.0459 19.7631 16.1886 19.2898 16.6914 18.3059L17.2956 17.123C17.3675 16.9824 17.4818 16.8681 17.6223 16.7963L18.8052 16.192C19.7892 15.6893 20.2625 14.5466 19.9222 13.4954L19.5131 12.2316C19.4645 12.0815 19.4645 11.9198 19.5131 11.7696L19.9222 10.5059C20.2625 9.45469 19.7892 8.31197 18.8052 7.80928L17.6223 7.20494C17.4818 7.13314 17.3675 7.01883 17.2956 6.87828L16.6914 5.6954C16.1886 4.71148 15.0459 4.23815 13.9947 4.57844L12.731 4.98753C12.5808 5.03613 12.4191 5.03614 12.269 4.98753L11.0052 4.57844ZM8.56983 11.8186L9.63049 10.7579L11.7518 12.8792L15.9945 8.6366L17.0551 9.69725L11.7518 15.0005L8.56983 11.8186Z" fill="#171717" />
          </svg>
        </div>

        <div className="text-[1.5rem] font-medium">Successfully Changed</div>
        <div className="my-4 text-gray-700">
          Your password has been successfully changed.
        </div>

        <button className="w-full h-[40px] mt-4 rounded-lg bg-black text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2)]">
          Sign in
        </button>
      </div>
    </div>
  );
}
