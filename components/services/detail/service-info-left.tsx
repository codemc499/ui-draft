'use client';

// import React from 'react';
import { useEffect, useState } from 'react'; // Import useState
import { Service } from '@/utils/supabase/types'; // Import the main Service type
import * as Avatar from '@/components/ui/avatar';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import { ImageCarousel } from './image-carousel';
import { ReviewItem } from './review-item'; // Import ReviewItem for dummy reviews
import { RiStarFill, RiCheckLine } from '@remixicon/react';
import { RelatedServiceCard } from './related-service-card'; // Ensure this is imported
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import i18n from '@/i18n';
import { usePathname } from 'next/navigation';

// Remove the old specific data interfaces
/*
interface ServiceProvider { ... }
interface ServiceInfoLeftData { ... }
*/

interface ServiceInfoLeftProps {
  service: Service; // Use the full Service type
  portfolioServices: Service[]; // Add portfolioServices prop
}

// Remove dummy options data structure
/*
const dummyOptions = [
  {
    name: 'Preparation of consumption tax return (general taxation)',
    price: 201,
  },
  {
    name: 'Consumption tax return preparation (simplified taxation)',
    price: 154,
  },
  { name: 'Express Service', price: 201 },
  {
    name: 'Sending paper documents of supporting documents (if they are divided by subject)',
    price: 37,
  },
  { name: 'Bookkeeping service (50 entries-5,000 yen)', price: 34 },
  {
    name: 'Electronic filing (proxy sending, user identification number obtained)',
    price: 34,
  },
  { name: 'Medical Expense Deduction Receipts (20 or more)', price: 34 },
];
*/

export function ServiceInfoLeft({ service, portfolioServices }: ServiceInfoLeftProps) {
  // Add state for managing the active tab
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState('Details');


  // Function to render tab content
  const renderTabContent = () => {

    switch (activeTab) {
      case 'Details':
        return (
          <div className='space-y-4 pl-4'>
            {/* Service Description Section */}
            <div className=''>
              <p className='text-sm text-text-secondary-600 whitespace-pre-wrap'>
                {service.description || t('service.info.noDescription')}
              </p>
            </div>
            {/* Services Included Section */}
            {service.includes && service.includes.length > 0 && (
              <div className='space-y-2'>
                <h3 className='font-semibold text-text-strong-950'>
                  {t('service.info.whatsIncluded')}
                </h3>
                <ul className='space-y-1'>
                  {service.includes.map((item, idx) => (
                    <li
                      key={idx}
                      className='text-sm text-text-secondary-600 flex items-center gap-2'
                    >
                      <RiCheckLine className='size-4 shrink-0 text-success-base' />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Add other relevant sections from service data if needed */}
          </div>
        );
      case 'Options': // Use actual service.additional_services
        const additionalServices = service.additional_services;
        return (
          <div className='divide-y px-4  divide-stroke-soft-200 rounded-lg border border-stroke-soft-200'>
            {additionalServices && additionalServices.length > 0 ? (
              additionalServices.map((option, index) => (
                <div
                  key={index} // Consider using a more stable key if options have IDs
                  className='flex items-center justify-between py-5'
                >
                  <span className='text-[16px] text-[#525866]'>
                    {option.name}
                  </span>
                  <span className='text-[18px] font-medium text-text-strong-950'>
                    {/* TODO: Consider currency formatting based on service.currency */}
                    ${option.price}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-text-secondary-600">
                {t('service.info.noOptions')}
              </p>
            )}
          </div>
        );
      case 'Portfolio': // Add Portfolio tab
        return (
          <div className='w-full max-w-[824px] px-4 mx-auto'>
            {portfolioServices.length > 0 ? (
              <div className='flex flex-wrap gap-4'>
                {portfolioServices
                  .slice(0, 3)
                  .map((portfolioService) => (
                    <RelatedServiceCard
                      key={portfolioService.id}
                      service={portfolioService}
                    />
                  ))}
              </div>
            ) : (
              <p className='text-sm text-text-secondary-600'>
                {t('service.info.noPortfolio')}
              </p>
            )}
          </div>
        );
      case 'Review': // Keep dummy reviews for now
        return (
          <div className='divide-y mt-[-24px] ml-3 divide-stroke-soft-200'>
            {[1, 2, 3].map((i) => (
              <div className='pb-[16px] hover:bg-[#F6F8FA] transition-all duration-300'>
                <ReviewItem
                  key={i}
                  review={{
                    id: String(i),
                    user: { name: 'Cleve Music', avatar: 'https://via.placeholder.com/40', rating: 4.9 },
                    date: 'Jan 8, 2023',
                    text: t('service.info.reviewPlaceholder'),
                    amount: 1000.00, // Example amount
                  }}
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Image Carousel */}
      <div className='pb-4'>
        <ImageCarousel
          images={service.images?.map(img => img.url) || []}
          altPrefix={service.title}
        />
      </div>
      {/* Tabs Navigation */}
      <div className='mb-6 ml-4'>
        <TabMenuHorizontal.Root value={activeTab} onValueChange={setActiveTab}>
          <TabMenuHorizontal.List className="border-none">
            <TabMenuHorizontal.Trigger value='Details' className="text-[24px] font-medium hover:text-text-strong-950 data-[state=inactive]:text-text-secondary-600">
              {t('service.info.tabs.details')}
            </TabMenuHorizontal.Trigger>
            <TabMenuHorizontal.Trigger value='Options' className="text-[24px] font-medium hover:text-text-strong-950 data-[state=inactive]:text-text-secondary-600">
              {t('service.info.tabs.options')}
            </TabMenuHorizontal.Trigger>
            <TabMenuHorizontal.Trigger value='Portfolio' className="text-[24px] font-medium hover:text-text-strong-950 data-[state=inactive]:text-text-secondary-600">
              {t('service.info.tabs.portfolio')}
            </TabMenuHorizontal.Trigger>
            <TabMenuHorizontal.Trigger value='Review' className="text-[24px] font-medium hover:text-text-strong-950 data-[state=inactive]:text-text-secondary-600">
              {t('service.info.tabs.review')}
            </TabMenuHorizontal.Trigger>
          </TabMenuHorizontal.List>
        </TabMenuHorizontal.Root>
      </div>

      {/* Render Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </>
  );
}
