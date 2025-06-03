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

export default function SettingsKbc() {
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
          <h2 className='text-[18px] leading-[24px] font-500'>Kbc</h2>
          <div className='leading-[20px] text-gray-500'>Personalize your privacy settings and enhance the security of your account.</div>
        </div>
        <div className='flex justify-center items-center'>
          <div className="w-[30rem] my-2">
            <p className='text-gray-500 py-4 '> Personalize your privacy settings and enhance the security of your account. </p>

            <div className='mb-4'>
              <div><label htmlFor="name" className='w-full font-500 leading-[20px] border-gray-200 py-2'>Company Name</label></div>
              <input type="text" id="name" className='w-[100%] h-10 border-gray-200 my-2 border rounded-[8px] text-gray-500 px-4'
                placeholder='Full Company Name' /> <br />
            </div>

            <div className='mb-4'>
              <div><label htmlFor="name" className='w-full font-500 leading-[20px] border-gray-200 py-2'>Unified Social Credit Code</label></div>
              <input type="text" id="name" className='w-[100%] h-10 border-gray-200 my-2 border rounded-[8px] text-gray-500 px-4' placeholder='Code' /> <br />
            </div>

            <div className='mb-4'>
              <div><label htmlFor="name" className='w-full font-500 leading-[20px] border-gray-200 py-2'>Name of Contact Person</label></div>
              <input type="text" id="name" className='w-[100%] h-10 border-gray-200 my-2 border rounded-[8px] text-gray-500 px-4' placeholder='Full Name' /> <br />
            </div>

            <div className='mb-8 relative'>
              <h4 className=''>Add to work</h4>
              <p className='text-gray-500 text-[1rem]'>Choose a portfolio to add your work.</p>
              <div className='absolute top-4 right-0'>
                <button className='px-4 py-2 rounded-[8px] border border-gray-500 text-gray-800'>Choose</button>
              </div>
            </div>

            <div className='mb-4 relative rounded-[1rem] border border-gray-200 p-4'>
              <div className="flex justify-between items-start">
                <h4 className=''>my-cv.pdf</h4>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className='text-gray-500 text-[1rem]'>60KB of 120KB ... uploading</p>
              <div className="flex flex-col w-full gap-4">
                <div className="flex-start flex h-2.5 w-full overflow-hidden rounded-full bg-blue-gray-50 font-sans text-xs font-medium">
                  <div className="flex items-center justify-center w-1/2 h-full overflow-hidden text-white break-all bg-gray-900 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="py-4">
              <label className="inline-flex items-center cursor-pointer gap-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-black-600 bg-gray-100 border-gray-300 rounded focus:ring-black-500 checked:bg-black checked:border-black"
                />
                <span className="text-gray-600 text-[14px]">
                  The above information is only used to verify your true identity.
                </span>
              </label>
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
