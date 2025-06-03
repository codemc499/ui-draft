import React, { Suspense } from 'react';
import SettingsKbc from '@/components/settings/settings-kbc';
import Translate from '@/components/Translate';

// Skeleton loader for Suspense fallback
function SettingsPageSkeleton() {
  return (
    <div className="flex min-h-screen animate-pulse bg-bg-alt-white-100">
      <aside className="w-[240px] shrink-0 border-r border-stroke-soft-200 bg-bg-white-0 p-4 pt-6">
        <div className="mb-4 h-6 w-3/4 rounded bg-gray-200"></div>
        <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
        <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
        {/* Add more skeleton lines if needed */}
      </aside>
      <main className="flex-1 p-6">
        <div className="h-8 w-1/4 rounded bg-gray-200">

        </div>
        {/* Add more skeleton content */}
      </main>
    </div>
  );
}

/** Main Settings / Orders page (Server Component Wrapper) (route: /settings) */
export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsPageSkeleton />}>
      <SettingsKbc />
    </Suspense>
  );
}
