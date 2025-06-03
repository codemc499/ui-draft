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
  // if (isAuthenticated) {
  //   redirect(`/${params.lang}/dashboard`);
  // }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="items-center relative bg-white w-[390px] h-[640px] rounded-[2rem] p-8 flex flex-col justify-between">
        {/* close */}
        <svg className="absolute top-6 right-6 cursor-pointer" width="25" height="24" viewBox="0 0 25 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.5 10.7284L16.955 6.27344L18.2276 7.54604L13.7726 12.001L18.2276 16.456L16.955 17.7286L12.5 13.2736L8.045 17.7286L6.7724 16.456L11.2274 12.001L6.7724 7.54604L8.045 6.27344L12.5 10.7284Z"
            fill="#171717" />
        </svg>
        {/* user avatar */}
        <div className="m-auto my-6 flex justify-center items-center rounded-full w-[88px] h-[88px] bg-gradient-to-b from-black/10 to-transparent border-t border-gray-500/60">
          <div className="w-14 h-14 rounded-full bg-white flex justify-center items-center border border-gray-200">
            <svg width="28" height="28" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.3 21.0016C5.3 19.092 6.05857 17.2607 7.40883 15.9104C8.7591 14.5601 10.5904 13.8016 12.5 13.8016C14.4096 13.8016 16.2409 14.5601 17.5912 15.9104C18.9414 17.2607 19.7 19.092 19.7 21.0016H5.3ZM12.5 12.9016C9.5165 12.9016 7.1 10.4851 7.1 7.50156C7.1 4.51806 9.5165 2.10156 12.5 2.10156C15.4835 2.10156 17.9 4.51806 17.9 7.50156C17.9 10.4851 15.4835 12.9016 12.5 12.9016Z"
                fill="#171717" />
            </svg>
          </div>
        </div>
        {/* tab control */}
        <div className="text-center text-[24px] font-bold">Forgot Password</div>

        <div>
          <label htmlFor="account" className="block leading-8">Account</label>
          <input
            type="text"
            id="account"
            className="w-full h-[40px] rounded-lg border border-gray-300 p-2"
            placeholder="Phone number or email address"
          />

          <label htmlFor="password" className="block leading-8">
            <span>Password</span>
          </label>

          <div className="flex">
            <div className="w-[90%]">
              <input
                type="password"
                id="password"
                className="w-full h-[40px] border border-gray-300 p-2 rounded-l-lg"
                placeholder="Enter Password"
              />
            </div>
            <div className="cursor-pointer border border-gray-300 border-l-0 rounded-r-lg w-8 h-[40px] leading-[38px] text-center text-gray-500">
              O
            </div>
          </div>

          <label htmlFor="confirm" className="block leading-8">
            <span>Confirm Password</span>
          </label>

          <div className="flex">
            <div className="w-[90%]">
              <input
                type="password"
                id="confirm"
                className="w-full h-[40px] border border-gray-300 p-2 rounded-l-lg"
                placeholder="Confirm Password"
              />
            </div>
            <div className="cursor-pointer border border-gray-300 border-l-0 rounded-r-lg w-8 h-[40px] leading-[38px] text-center text-gray-500">
              O
            </div>
          </div>

          <label htmlFor="code" className="block leading-8">
            <span>Send Code</span>
          </label>

          <div className="flex">
            <div className="w-3/5">
              <input
                type="text"
                id="code"
                className="w-full h-[40px] border border-gray-300 p-2 rounded-l-lg"
                placeholder="Enter code"
              />
            </div>
            <div className="cursor-pointer border border-gray-300 border-l-0 rounded-r-lg w-2/5 h-[40px] leading-[38px] text-center text-gray-500">
              Send Code
            </div>
          </div>
        </div>

        <button className="shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2)] bg-black text-white w-full h-[40px] rounded-lg">
          Reset
        </button>

      </div>
    </div>
  );
}
