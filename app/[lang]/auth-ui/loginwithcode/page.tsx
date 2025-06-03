import React from 'react';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SignupForm from '@/components/auth/SignupForm';

export const dynamic = 'force-dynamic';

export default async function SignupPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const supabase = await createSupabaseServerClient();

  // Check if the user is already authenticated
  const { data } = await supabase.auth.getSession();
  const isAuthenticated = !!data.session;

  // // If already authenticated, redirect to dashboard
  // if (isAuthenticated) {
  //   redirect(`/${params.lang}/dashboard`);
  // }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="items-center relative bg-white w-[390px] h-[640px] rounded-[2rem] p-8">
        {/* close */}
        <svg className="absolute top-6 right-6 cursor-pointer" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 10.7284L16.955 6.27344L18.2276 7.54604L13.7726 12.001L18.2276 16.456L16.955 17.7286L12.5 13.2736L8.045 17.7286L6.7724 16.456L11.2274 12.001L6.7724 7.54604L8.045 6.27344L12.5 10.7284Z" fill="#171717"></path>
        </svg>
        {/* user avatar */}
        <div className="m-auto my-6 flex justify-center items-center rounded-full w-[88px] h-[88px] bg-gradient-to-b from-black/10 to-transparent border-t border-gray-500/60">
          <div className="w-14 h-14 rounded-full bg-white flex justify-center items-center border border-gray-200">
            <svg width="28" height="28" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.3 21.0016C5.3 19.092 6.05857 17.2607 7.40883 15.9104C8.7591 14.5601 10.5904 13.8016 12.5 13.8016C14.4096 13.8016 16.2409 14.5601 17.5912 15.9104C18.9414 17.2607 19.7 19.092 19.7 21.0016H5.3ZM12.5 12.9016C9.5165 12.9016 7.1 10.4851 7.1 7.50156C7.1 4.51806 9.5165 2.10156 12.5 2.10156C15.4835 2.10156 17.9 4.51806 17.9 7.50156C17.9 10.4851 15.4835 12.9016 12.5 12.9016Z" fill="#171717"></path>
            </svg>
          </div>
        </div>
        {/* tab control */}
        <div className="text-center text-[24px] font-bold my-6">
          Create or Login
        </div>

        <div className="flex flex-row justify-between">
          <div className="w-full text-center text-sm font-bold py-4 border-b-2 border-black">
            <h2 className="text-black">Use Code</h2>
          </div>
          <div className="w-full text-center text-sm font-bold py-4 border-b border-gray-400">
            <h2 className="text-gray-500">Use Password</h2>
          </div>
        </div>

        <div>
          <label htmlFor="account" className="block leading-8">Account</label>
          <input type="text" id="account" className="w-full h-[40px] rounded-lg border border-gray-300 p-2" placeholder="Phone number or email address" />

          <label htmlFor="code" className="block leading-8">Code</label>
          <div className="flex">
            <div className="w-3/5">
              <input type="text" id="code" className="w-full h-[40px] border border-gray-300 p-2 rounded-l-lg" placeholder="Enter code" />
            </div>
            <div className="w-2/5 cursor-pointer border border-gray-300 border-l-0 rounded-r-lg h-[40px] leading-[38px] text-center text-gray-500">
              Send Code
            </div>
          </div>
        </div>

        <div className="flex my-6">
          <input type="checkbox" id="terms" className="mr-2" />
          <label htmlFor="terms">
            I agree to the{' '}
            <span className="underline font-bold cursor-pointer">Terms</span>
            {' '}and{' '}
            <span className="underline font-bold cursor-pointer">Privacy Policy</span>
          </label>
        </div>

        <button className="bg-black text-white w-full h-[40px] rounded-lg shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2)]">
          Login
        </button>

        <div className="flex items-center gap-2 my-4">
          <div className="border-t border-gray-300 flex-1"></div>
          <div className="text-sm text-gray-500">OR</div>
          <div className="border-t border-gray-300 flex-1"></div>
        </div>

        <div className="flex justify-center">
          <div className="w-[40px] h-[40px] flex items-center justify-center rounded-[20%] border border-gray-300">
            <svg width="29" height="28" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.4166 13.5383C18.6301 13.5355 18.834 13.4495 18.985 13.2985C19.1359 13.1476 19.222 12.9436 19.2248 12.7301C19.2248 12.2819 18.8657 11.9219 18.4166 11.9219C17.9675 11.9219 17.6084 12.2819 17.6084 12.7301C17.6084 13.1801 17.9684 13.5383 18.4166 13.5383ZM14.4341 13.5383C14.6476 13.5355 14.8515 13.4495 15.0025 13.2985C15.1534 13.1476 15.2395 12.9436 15.2423 12.7301C15.2423 12.2819 14.8823 11.9219 14.4341 11.9219C13.9841 11.9219 13.6259 12.2819 13.6259 12.7301C13.6259 13.1801 13.985 13.5383 14.4341 13.5383ZM20.3444 18.0743C20.2867 18.1064 20.2407 18.1559 20.2129 18.2157C20.1851 18.2755 20.1769 18.3426 20.1896 18.4073C20.1896 18.4505 20.1896 18.4946 20.2121 18.5396C20.3003 18.9149 20.4767 19.5125 20.4767 19.535C20.4767 19.6007 20.4992 19.6448 20.4992 19.6898C20.4992 19.7159 20.494 19.7417 20.484 19.7658C20.474 19.7899 20.4593 19.8118 20.4409 19.8302C20.4224 19.8486 20.4004 19.8631 20.3763 19.873C20.3522 19.8829 20.3264 19.888 20.3003 19.8878C20.2553 19.8878 20.2337 19.8662 20.1896 19.8446L18.8855 19.0922C18.7903 19.0398 18.6844 19.0097 18.5759 19.004C18.5102 19.004 18.4436 19.004 18.3995 19.0256C17.7803 19.2029 17.1395 19.2911 16.4546 19.2911C13.1606 19.2911 10.5083 17.0798 10.5083 14.3366C10.5083 11.5943 13.1606 9.38214 16.4546 9.38214C19.7477 9.38214 22.4 11.5943 22.4 14.3366C22.4 15.8189 21.6044 17.168 20.3444 18.0752V18.0743ZM16.7057 8.48754C16.6217 8.48475 16.5377 8.48325 16.4537 8.48304C12.6971 8.48304 9.60827 11.057 9.60827 14.3375C9.60827 14.8361 9.68028 15.3185 9.81348 15.7775H9.73338C8.94701 15.7696 8.1651 15.6582 7.40778 15.4463C7.34118 15.4238 7.27458 15.4238 7.20798 15.4238C7.07497 15.4267 6.94512 15.4649 6.83178 15.5345L5.25858 16.439C5.21358 16.4615 5.16948 16.484 5.12538 16.484C5.06115 16.4833 4.99974 16.4575 4.95432 16.4121C4.9089 16.3667 4.88308 16.3053 4.88238 16.241C4.88238 16.1744 4.90398 16.1303 4.92648 16.0637C4.94808 16.0421 5.14788 15.3131 5.25858 14.8721C5.25858 14.8271 5.28018 14.7614 5.28018 14.7173C5.27993 14.6402 5.26185 14.5641 5.22735 14.4951C5.19285 14.4261 5.14285 14.366 5.08128 14.3195C3.55218 13.2368 2.59998 11.6258 2.59998 9.83664C2.59998 6.54894 5.81298 3.89844 9.75498 3.89844C13.1435 3.89844 15.992 5.85054 16.7057 8.48664V8.48754ZM12.0671 8.86374C12.5828 8.86374 12.9905 8.43444 12.9905 7.94034C12.9905 7.42464 12.5828 7.01694 12.0671 7.01694C11.5514 7.01694 11.1437 7.42464 11.1437 7.94034C11.1437 8.45604 11.5514 8.86374 12.0671 8.86374ZM7.33308 8.86374C7.84878 8.86374 8.25738 8.43444 8.25738 7.94034C8.25738 7.42464 7.84878 7.01694 7.33308 7.01694C6.81828 7.01694 6.40968 7.42464 6.40968 7.94034C6.40968 8.45604 6.81828 8.86374 7.33308 8.86374Z" fill="#3d3"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
