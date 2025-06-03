import React, { Suspense } from 'react';
import SearchPageClient from './search-page-client'; // Import the new client component
import Translate from '@/components/Translate';

// Simple loading component
function LoadingFallback() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <p>
        <Translate id="services.search.page.loading" />
      </p>
      {/* You can add a spinner or more sophisticated skeleton here */}
    </div>
  );
}

export default function ServicesSearchPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SearchPageClient />
    </Suspense>
  );
} 