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


export default function NotificationSecurity() {
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get('tab') as ActiveView) || 'Profile';


  return (
    <div className="flex min-h-screen bg-bg-alt-white-100 overflow-hidden mx-auto">
      {/* ------------- LEFT NAV ------------- */}
      <Suspense fallback={<SidebarSkeleton />}>
        <ProfileSidebar activeView={currentTab} />
      </Suspense>

      {/* ------------- RIGHT CONTENT ------------- */}
      <div className="flex flex-1 flex-col w-[1132px] pl-7 pt-8">

        <div className='border-b border-gray-200 pb-4'>
          <h2 className='text-[18px] leading-[24px] font-500'>Security</h2>
          <span className='leading-[20px] text-gray-500'>Personalize your privacy settings and enhance the security of your account.</span>
        </div>
        <div className='border-b border-dashed border-gray-200 py-4 relative'>
          <h2 className='text-[18px] leading-[24px] font-500'>Email</h2>
          <span className='leading-[20px] text-gray-500'>Business email address recommended.
            <span className='absolute left-[45%]' >codemc499@gmail.com</span></span>
        </div>
        <div className='border-b border-dashed border-gray-200 py-4 relative'>
          <h2 className='text-[18px] leading-[24px] font-500'>Phone Number</h2>
          <span className='leading-[20px] text-gray-500'>Business phone number recommended.  <span className='absolute left-[45%]' >+1234567890</span></span>
        </div>
        <div className='border-b border-dashed border-gray-200 py-4 relative'>
          <h2 className='text-[18px] leading-[24px] font-500'>WeChat</h2>
          <span className='leading-[20px] text-gray-500'>Business WeChat ID recommended.  <span className='absolute left-[45%]' >wec**at</span></span>
        </div>
        <div className='border-b border-dashed border-gray-200 py-4 relative'>
          <h2 className='text-[18px] leading-[24px] font-500'>Change Password</h2>
          <span className='leading-[20px] text-gray-500'>Update password for enhancedaccount security.  <span className='absolute left-[45%]' ><button>change</button></span></span>
        </div>
      </div>


    </div>
  );
}
