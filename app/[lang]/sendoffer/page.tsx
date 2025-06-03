'use client';

import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { usePathname } from 'next/navigation';
import { SendOfferForm } from '@/components/offers/send-offer-form';
import { OfferProfileSidebar } from '@/components/offers/offer-profile-sidebar';

// Updated mock worker data for the OfferProfileSidebar
const mockOfferWorker = {
  name: 'Cleve Music',
  avatar: 'https://placekitten.com/100/100',
  rating: 4.9,
  reviewCount: 128, // Renamed from reviews if needed, matching OfferProfileSidebar
  isGoogle: true,
  socialLinks: ['google', 'twitch'],
  about:
    "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...", // Added about text
  skills: [
    { name: 'Grammy', details: 'Billboard Music' },
    { name: 'American Music', details: 'BRIT' },
    { name: 'MTV Music', details: 'Eurovision Awards' },
    { name: 'Products (1)' }, // Skill for Tools/Products section example
  ],
  // Awards removed
};

// This page will be a client component because the form itself is a client component.
// Alternatively, wrap SendOfferForm in Suspense if fetching data server-side.
export default function SendOfferPage() {
  const { t } = useTranslation('common');
  const [, lang] = usePathname().split('/');
  const sellerId = useSearchParams().get('seller_id');

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <div className='container mx-auto py-10 px-1 max-w-[1200px]'>
      <h1 className='text-[40px] text-[#0E121B] mb-8 font-medium'>
        {t('offers.send.page.title')}
      </h1>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-7'>
        {/* Left Column: Form */}
        <div className='lg:col-span-5'>
          <SendOfferForm sellerId={sellerId ?? ''} />
        </div>

        {/* Right Column: Offer Profile Sidebar */}
        <div className='lg:col-span-2 border border-stroke-soft-200 mt-[92px] rounded-[20px] h-fit shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.10)]'>
          <div className='sticky top-20 space-y-2'>
            {/* 
              TODO: Fetch actual worker data instead of using mock data. 
              The data might come from the offerid, recipient selection, or related entities.
            */}
            <OfferProfileSidebar worker={mockOfferWorker} />
          </div>
        </div>
      </div>
    </div>
  );
}
