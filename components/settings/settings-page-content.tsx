'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/utils/supabase/AuthContext';
import { useTranslation } from 'react-i18next';

import OrdersSidebar from '@/components/settings/OrdersSidebar';
import OrdersContent from '@/components/settings/OrdersContent';
import BillingContent from '@/components/settings/BillingContent';
import MyServicesView from '@/components/settings/MyServicesView';

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

export default function SettingsPageContent() {
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get('tab') as ActiveView) || 'orders';

  const { userProfile, loading: authLoading, profileLoading } = useAuth();
  const isSeller = userProfile?.user_type === 'seller';

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
        <OrdersSidebar activeView={currentTab} isSeller={!!isSeller} />
      </Suspense>

      {/* ------------- RIGHT CONTENT ------------- */}
      <div className="flex flex-1 flex-col w-[1132px] pl-7 pt-8">
        <Suspense fallback={<ContentSkeleton />}>
          {currentTab === 'orders' && <OrdersContent />}

          {currentTab === 'my-services' && isSeller && <MyServicesView />}

          {currentTab === 'my-services' && !isSeller && (
            <main>
              <p className="text-red-500">
                {t('settingsPage.accessDenied')}
              </p>
            </main>
          )}

          {currentTab === 'billing' && <BillingContent />}
        </Suspense>
      </div>
    </div>
  );
}
