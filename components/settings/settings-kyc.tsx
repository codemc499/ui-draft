'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/utils/supabase/AuthContext';
import { useTranslation } from 'react-i18next';

import ProfileSidebar from '@/components/settings/ProfileSidebar';

export type ActiveView = 'orders' | 'billing' | 'my-services';

/* ---------------------------------------------------------- */
/*            tiny skeleton helpers – Tailwind only           */
/* ---------------------------------------------------------- */
const SidebarSkeleton = () => (
  <aside className="w-[240px] shrink-0 border-r border-stroke-soft-200 bg-bg-white-0 p-4 pt-6">
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 rounded bg-gray-200" />
      ))}
    </div>
  </aside>
);

export default function SettingsKyc() {
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get('tab') as ActiveView) || 'Profile';
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-alt-white-100 overflow-hidden mx-auto">
      {/* ------------- LEFT NAV ------------- */}
      <Suspense fallback={<SidebarSkeleton />}>
        <ProfileSidebar activeView={currentTab} />
      </Suspense>

      {/* ------------- RIGHT CONTENT ------------- */}
      <div className="flex flex-1 flex-col w-[1132px] pl-7 pt-8">

        <div className='border-b border-gray-200 pb-4'>
          <h2 className='text-[18px] leading-[24px] font-500'>Kyc</h2>
          <div className='leading-[20px] text-gray-500'>Personalize your privacy settings and enhance the security of your account.</div>
        </div>
        <div className='flex justify-center items-center'>
          <div className="w-[30rem] my-8">
            <h4 className='text-gray-900'> ⚠️ Important Notice </h4>
            <p className='text-gray-500 py-4 mb-8'>  Under the Cybersecurity Law and Personal Information Protection Law,
              you must complete real - name authentication to access all features. This process is verified
              by Alibaba Cloud (Taobao). </p>

            <div className='mb-6'>
              <div><label htmlFor="name" className='font-500 leading-[20px] border-gray-200 py-4'>Full Name</label></div>
              <input type="text" id="name" className='w-[100%] h-10 border-gray-200 my-2 border rounded-[8px] text-gray-500 px-4' placeholder='Full Name' /> <br />
            </div>

            <div className='mb-6'>
              <div><label htmlFor="name" className='w-full font-500 leading-[20px] border-gray-200 py-4'>ID Code</label></div>
              <input type="text" id="name" className='w-[100%] h-10 border-gray-200 my-2 border rounded-[8px] text-gray-500 px-4' placeholder='Code' /> <br />
            </div>

            <div className="flex justify-end">
              <button className='px-4 py-2 rounded-[8px] border border-gray-500 text-gray-800'>Submit</button>
            </div>

            <div className='mt-8 pt-8 border-t border-gray-200'>
              <h4 className='text-gray-900'>Certification Information</h4>
              <div className='mt-4 space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-500'>Full name</span>
                  <span className='text-gray-900'>ASDD DDSSS</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-500'>Certification date</span>
                  <span className='text-gray-900'>2025.02.02</span>
                </div>
              </div>
            </div>

          </div>



        </div>

      </div>


    </div>
  );
}
