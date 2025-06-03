'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/utils/supabase/AuthContext';
import { useTranslation } from 'react-i18next';

import ProfileSidebar from '@/components/settings/ProfileSidebar';
import { Modal } from '../ui/modal';

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

const ContentSkeleton = () => (
  <main className="flex-1 p-6 space-y-6 animate-pulse">
    {/* top KPI boxes */}
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 rounded bg-gray-200" />
      ))}
    </div>

    {/* filter bar */}
    <div className="h-9 w-full rounded bg-gray-200" />

    {/* table rows */}
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 rounded bg-gray-200" />
      ))}
    </div>
  </main>
);
/* ---------------------------------------------------------- */

export default function SettingsProfile() {
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get('tab') as ActiveView) || 'Profile';

  const { userProfile, loading: authLoading, profileLoading } = useAuth();
  // const isSeller = userProfile?.user_type === 'seller';

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  /* global skeleton while auth / profile resolves */
  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen bg-bg-alt-white-100">
        <SidebarSkeleton />
        <ContentSkeleton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-alt-white-100 overflow-hidden mx-auto">
      {/* ------------- LEFT NAV ------------- */}
      <Suspense fallback={<SidebarSkeleton />}>
        <ProfileSidebar activeView={currentTab} />
      </Suspense>

      {/* ------------- RIGHT CONTENT ------------- */}
      <div className="flex flex-1 flex-col w-[1132px] pl-7 pt-8">

        <div className='border-b border-gray-200 pb-4'>
          <h2 className='text-[18px] leading-[24px] font-500'>Profile</h2>
          <span className='leading-[20px] text-gray-500'>Personalize your privacy settings and enhance the security of your account.</span>
        </div>
        <div className='border-b border-dashed border-gray-200 py-4 relative'>
          <h2 className='text-[18px] leading-[24px] font-500'>UID</h2>
          <span className='leading-[20px] text-gray-500'>Your User ID  <span className='absolute left-[45%]' >{userProfile?.id}</span></span>
        </div>
        <div className='border-b border-dashed border-gray-200 py-4 relative'>
          <h2 className='text-[18px] leading-[24px] font-500'>Profile Photo</h2>
          <span className='leading-[20px] text-gray-500'>Nub 400 x 400ox, PNG or JPEG formats</span>
          <div className="flex absolute left-[45%] top-2">
            <img src="/images/man.jpg" alt="profile photo" className='w-16 h-16 rounded-full' />
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className='px-4 mx-2 h-10 m-auto rounded-md bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors'
            >
              Upload
            </button>
          </div>
        </div>
        <div className='border-b border-dashed border-gray-200 py-4 relative'>
          <h2 className='text-[18px] leading-[24px] font-500'>Nicknames</h2>
          <span className='leading-[20px] text-gray-500'>Your name will be visible to your contacts  <span className='absolute left-[45%]' >Code Master Chracter</span></span>
        </div>
        <div className='border-b border-dashed border-gray-200 py-4 relative'>
          <h2 className='text-[18px] leading-[24px] font-500'>Web Linka</h2>
          <span className='leading-[20px] text-gray-500'>Links for your company's  <span className='absolute left-[45%]' >https://www.apexfinancial.com</span></span>
        </div>
      </div>

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Profile Picture"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="w-12 h-12 text-gray-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm text-white bg-black hover:bg-gray-800 rounded-md transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
