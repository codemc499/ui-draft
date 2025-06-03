'use client';

import React, { useState } from 'react';
import Image from 'next/image'; // Need next/image for the carousel part
import { UseFormReturn } from 'react-hook-form';
import { CreateServiceFormData } from '@/app/[lang]/worker/services/create/schema';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
// Removed imports not used in the reference Step3Review (Badge, ServiceInfoLeft, etc.)
import { useAuth } from '@/utils/supabase/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiLoader4Line, // Keep for submitting state
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiStarFill,
  RiGoogleFill,
} from '@remixicon/react';
import { cn } from '@/utils/cn';
import * as Divider from '@/components/ui/divider';
import * as FancyButton from '@/components/ui/fancy-button';

// --- Local formatCurrency function (Workaround) ---
function formatCurrency(
  amount: number | null | undefined,
  currencyCode: string = 'USD',
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '-';
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error(`Error formatting currency for code ${currencyCode}:`, error);
    return `$${amount.toFixed(2)}`;
  }
}
// --- End Local Function ---

// Define the props interface expected by the component
interface Step3ReviewProps {
  formMethods: UseFormReturn<CreateServiceFormData>;
  prevStep: () => void;
  submitForm: () => void;
  isSubmitting: boolean;
}

// --- Step 3 Review Component - Adapted from Reference ---
export function Step3Review({
  formMethods,
  prevStep,
  submitForm,
  isSubmitting,
}: Step3ReviewProps) {
  const { t } = useTranslation('common');
  // Get form data
  const formData = formMethods.getValues();
  const { user } = useAuth(); // Get user for provider info

  // Prepare data in the structure the reference component expects
  // Use form data instead of mock previewData
  const displayData = {
    title: formData.title || '[Service Title]',
    // Map image data: use URL if available (already uploaded), otherwise create blob URL for preview
    images: formData.images?.map(
      (img) =>
        img.url ||
        (img.file ? URL.createObjectURL(img.file) : '/placeholder-image.svg'),
    ) || [
        'https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Placeholder', // Fallback image if none provided
      ],
    details: formData.description || '[Service Description]',
    includedItems: formData.includes || [],
    options:
      formData.additionalServices?.map((addSvc) => ({
        name: addSvc.name,
        // Format price using local function
        price: formatCurrency(addSvc.price, formData.currency),
      })) || [],
    worker: {
      name: user?.user_metadata?.full_name || user?.email || 'Your Name',
      avatar:
        user?.user_metadata?.avatar_url || '', // Use placeholder if no avatar
      rating: 0.0, // Placeholder
      reviews: 0, // Placeholder
    },
    // Format price and lead time
    price: formatCurrency(formData.price, formData.currency),
    leadTime: `${formData.lead_time || '?'} Day${formData.lead_time !== 1 ? 's' : ''}`,
  };

  // State for image carousel (as in reference)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cleanup blob URLs when component unmounts
  React.useEffect(() => {
    const imageUrls = displayData.images;
    // Filter out non-blob URLs before attempting revoke
    const blobUrls = imageUrls.filter((url) => url.startsWith('blob:'));
    return () => {
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
    };
    // Use formData.images as dependency, because displayData.images might contain blob URLs that change
  }, [formData.images]);

  const handleThumbnailClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayData.images.length - 1 : prev - 1,
    );
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === displayData.images.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className='mx-auto max-w-6xl mt-2'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
        {/* Left Content: Image, Details, Options */}
        <div className='space-y-6 md:col-span-8 mt-2'>
          <h1 className='text-[32px] font-medium text-text-strong-950'>
            {t('worker.services.create.step3.title', { title: displayData.title })}
          </h1>
          {/* Image Carousel */}
          <div className='space-y-3'>
            <div className='relative aspect-video w-full overflow-hidden rounded-xl bg-[#F6F8FA] '>
              <Image
                // Use displayData which contains URLs (blob or http)
                src={displayData.images[currentImageIndex]}
                alt={displayData.title}
                fill
                className='object-contain p-2'
              // Add unoptimized prop if using blob URLs frequently or for external URLs not configured
              // unoptimized
              />
              {/* Carousel Controls */}
              <button
                onClick={handlePrevClick}
                className='absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-1 text-gray-800 hover:bg-white disabled:opacity-50'
                disabled={displayData.images.length <= 1}
              >
                <RiArrowLeftSLine className='size-5' />
              </button>
              <button
                onClick={handleNextClick}
                className='absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-1 text-gray-800 hover:bg-white disabled:opacity-50'
                disabled={displayData.images.length <= 1}
              >
                <RiArrowRightSLine className='size-5' />
              </button>
            </div>
            {/* Thumbnails */}
            {displayData.images.length > 1 && (
              <div className='flex gap-3 overflow-x-auto pb-1'>
                {displayData.images.map((thumb, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleThumbnailClick(index, e)}
                    className={'aspect-video w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg border-2 border-none bg-[#F6F8FA]'}
                  >
                    <Image
                      src={thumb}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className={cn('!relative object-contain p-2',
                        index === currentImageIndex ? 'opacity-100' : 'opacity-20'
                      )}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className='bg-bg-white-0 py-6 px-4'>
            <span className='text-[24px] font-semibold text-[#0E121B] border-b border-b-2 border-[#0E121B] pb-2'>
              {t('worker.services.create.step3.details')}
            </span>
            <p className='text-[16px] text-[#525866] mb-6 mt-6 whitespace-pre-wrap'>
              {displayData.details}
            </p>
            {displayData.includedItems.length > 0 && (
              <>
                <span className='text-[24px] font-semibold text-[#0E121B] border-b border-b-2 border-[#0E121B] pb-2'>
                  {t('worker.services.create.step3.whatsIncluded')}
                </span>
                <ul className='mb-3 mt-6 space-y-1.5'>
                  {displayData.includedItems.map((item, idx) => (
                    <li
                      key={idx}
                      className='text-sm text-text-secondary-600 flex items-center gap-2'
                    >
                      <RiCheckLine className='size-4 shrink-0 text-success-base' />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {/* Show More button removed as it doesn't apply to preview */}
            {/* Options Section */}
            {displayData.options.length > 0 && (
              <div className='!mt-0 bg-bg-white-0'>
                <span className='text-[24px] font-semibold text-[#0E121B] border-b border-b-2 border-[#0E121B] pb-2'>
                  {t('worker.services.create.step3.options')}
                </span>
                <div className='shadow-sm rounded-xl bg-bg-white-0 mb-6 mt-6 border border-stroke-soft-200'>

                  <div className='space-y-3 divide-y divide-stroke-soft-200 p-4'>
                    {displayData.options.map((option, idx) => (
                      <div
                        key={idx}
                        className='flex items-center justify-between pt-3 first:pt-0'
                      >
                        <span className='text-[16px] text-[#525866]'>
                          {option.name}
                        </span>
                        {/* Price is already formatted in displayData */}
                        <span className='text-[18px] font-medium text-[#0E121B]'>
                          {option.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>


        </div>

        {/* Right Sidebar: Worker Info, Price, Buttons */}
        <div className='md:col-span-4'>
          <div className='sticky top-16 space-y-6 pt-6'>

            <div className='flex flex-col gap-6 rounded-xl border border-stroke-soft-200 bg-bg-white-0 pb-4 mb-6'>

              <div className='flex flex-col items-center gap-3 pt-4 px-4'>
                {displayData.worker.avatar && displayData.worker.avatar !== "" ? <Avatar.Root size='80'>
                  <Avatar.Image src={displayData.worker.avatar} alt={displayData.worker.name} />
                  <Avatar.Indicator position='bottom'>
                    <Avatar.Status status='online' />
                  </Avatar.Indicator>
                </Avatar.Root> :
                  <Avatar.Root size='80' color='yellow'>{displayData.worker.name.charAt(0).toUpperCase()}</Avatar.Root>}
                <div className='text-center'>
                  <h2 className='text-[16px] font-medium text-[#525866]'>
                    {displayData.worker.name}
                  </h2>
                  <div className='text-text-secondary-600 flex items-center justify-center gap-1 text-paragraph-sm'>
                    <RiStarFill className='size-4 text-yellow-500' />
                    <span className='text-[#525866]'>
                      {displayData.worker.rating.toFixed(1)} ({displayData.worker.reviews})
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  {/* Placeholder Google Logos */}
                  <div className='flex flex-row items-center gap-1 text-[#525866]'>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.00015 11.5C9.93325 11.5 11.5003 9.93283 11.5003 7.99973C11.5003 6.06663 9.93325 4.49951 8.00015 4.49951C6.06704 4.49951 4.5 6.06663 4.5 7.99973C4.5 9.93283 6.06704 11.5 8.00015 11.5Z" fill="white" />
                      <path d="M4.96887 9.75042L1.93811 4.50098C1.32358 5.56505 1 6.77214 1 8.00098C1 9.22982 1.32343 10.4369 1.93789 11.501C2.55235 12.5651 3.43615 13.4487 4.50037 14.0629C5.56459 14.677 6.77182 15.0002 8.00059 14.9999L11.0313 9.75042V9.74962C10.7244 10.282 10.2826 10.7241 9.75055 11.0315C9.21848 11.3389 8.61485 11.5008 8.00036 11.5009C7.38588 11.501 6.7822 11.3393 6.25004 11.032C5.71788 10.7248 5.27602 10.2828 4.96887 9.75057V9.75042Z" fill="#229342" />
                      <path d="M11.031 9.75033L8.00027 14.9998C9.22904 15 10.4362 14.6766 11.5003 14.0623C12.5645 13.4479 13.4481 12.5642 14.0625 11.5C14.6767 10.4358 15 9.22862 14.9998 7.99985C14.9996 6.77109 14.6759 5.564 14.0612 4.5H7.99976L7.99902 4.50052C8.61351 4.50022 9.21724 4.66173 9.7495 4.9688C10.2818 5.27592 10.7238 5.71767 11.0311 6.24982C11.3384 6.78195 11.5002 7.38562 11.5002 8.00012C11.5002 8.61462 11.3384 9.21829 11.031 9.7504L11.031 9.75033Z" fill="#FBC116" />
                      <path d="M8.00046 10.7715C9.53084 10.7715 10.7714 9.53091 10.7714 8.00047C10.7714 6.47002 9.53084 5.22949 8.00046 5.22949C6.47009 5.22949 5.22949 6.47009 5.22949 8.00047C5.22949 9.53084 6.47009 10.7715 8.00046 10.7715Z" fill="#1A73E8" />
                      <path d="M8.00044 4.50022H14.0619C13.4477 3.436 12.5641 2.5522 11.4999 1.93774C10.4358 1.32333 9.22868 0.999907 7.99993 1C6.77116 1.00007 5.56407 1.32366 4.50007 1.93826C3.43603 2.55283 2.55256 3.43671 1.93848 4.50103L4.96924 9.75048L4.97005 9.75092C4.66254 9.21889 4.50055 8.61527 4.50036 8.00077C4.50016 7.38627 4.66178 6.78255 4.96894 6.25033C5.27606 5.71811 5.71804 5.27613 6.25018 4.96894C6.78233 4.66175 7.38606 4.5 8.00059 4.50015L8.00044 4.50022Z" fill="#E33B2E" />
                    </svg>
                    Google
                  </div>
                  <div className='flex flex-row items-center gap-1 text-[#525866]'>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.00015 11.5C9.93325 11.5 11.5003 9.93283 11.5003 7.99973C11.5003 6.06663 9.93325 4.49951 8.00015 4.49951C6.06704 4.49951 4.5 6.06663 4.5 7.99973C4.5 9.93283 6.06704 11.5 8.00015 11.5Z" fill="white" />
                      <path d="M4.96887 9.75042L1.93811 4.50098C1.32358 5.56505 1 6.77214 1 8.00098C1 9.22982 1.32343 10.4369 1.93789 11.501C2.55235 12.5651 3.43615 13.4487 4.50037 14.0629C5.56459 14.677 6.77182 15.0002 8.00059 14.9999L11.0313 9.75042V9.74962C10.7244 10.282 10.2826 10.7241 9.75055 11.0315C9.21848 11.3389 8.61485 11.5008 8.00036 11.5009C7.38588 11.501 6.7822 11.3393 6.25004 11.032C5.71788 10.7248 5.27602 10.2828 4.96887 9.75057V9.75042Z" fill="#229342" />
                      <path d="M11.031 9.75033L8.00027 14.9998C9.22904 15 10.4362 14.6766 11.5003 14.0623C12.5645 13.4479 13.4481 12.5642 14.0625 11.5C14.6767 10.4358 15 9.22862 14.9998 7.99985C14.9996 6.77109 14.6759 5.564 14.0612 4.5H7.99976L7.99902 4.50052C8.61351 4.50022 9.21724 4.66173 9.7495 4.9688C10.2818 5.27592 10.7238 5.71767 11.0311 6.24982C11.3384 6.78195 11.5002 7.38562 11.5002 8.00012C11.5002 8.61462 11.3384 9.21829 11.031 9.7504L11.031 9.75033Z" fill="#FBC116" />
                      <path d="M8.00046 10.7715C9.53084 10.7715 10.7714 9.53091 10.7714 8.00047C10.7714 6.47002 9.53084 5.22949 8.00046 5.22949C6.47009 5.22949 5.22949 6.47009 5.22949 8.00047C5.22949 9.53084 6.47009 10.7715 8.00046 10.7715Z" fill="#1A73E8" />
                      <path d="M8.00044 4.50022H14.0619C13.4477 3.436 12.5641 2.5522 11.4999 1.93774C10.4358 1.32333 9.22868 0.999907 7.99993 1C6.77116 1.00007 5.56407 1.32366 4.50007 1.93826C3.43603 2.55283 2.55256 3.43671 1.93848 4.50103L4.96924 9.75048L4.97005 9.75092C4.66254 9.21889 4.50055 8.61527 4.50036 8.00077C4.50016 7.38627 4.66178 6.78255 4.96894 6.25033C5.27606 5.71811 5.71804 5.27613 6.25018 4.96894C6.78233 4.66175 7.38606 4.5 8.00059 4.50015L8.00044 4.50022Z" fill="#E33B2E" />
                    </svg>
                    Google
                  </div>

                </div>

              </div>
              <div className='px-4'>
                <Divider.Root className='' />
              </div>

              <div className='flex flex-col gap-3 px-4'>
                <div className='flex flex-row items-center justify-between'>
                  <div className='flex flex-row items-center gap-2'>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.02975 2.38251C4.39977 1.16704 6.16852 0.497123 8 0.500009C12.1423 0.500009 15.5 3.85776 15.5 8.00001C15.5024 9.53294 15.0329 11.0295 14.1553 12.2863L12.125 8.00001H14C14 6.80703 13.6444 5.64112 12.9786 4.65122C12.3128 3.66133 11.367 2.89239 10.262 2.44263C9.15706 1.99287 7.94312 1.88271 6.77525 2.12623C5.60739 2.36975 4.53863 2.95588 3.7055 3.80976L3.0305 2.38326L3.02975 2.38251ZM12.9703 13.6175C11.6002 14.833 9.83148 15.5029 8 15.5C3.85775 15.5 0.5 12.1423 0.5 8.00001C0.5 6.40626 0.99725 4.92876 1.84475 3.71376L3.875 8.00001H2C1.99998 9.19299 2.35559 10.3589 3.02141 11.3488C3.68723 12.3387 4.63303 13.1076 5.73798 13.5574C6.84294 14.0071 8.05688 14.1173 9.22475 13.8738C10.3926 13.6303 11.4614 13.0441 12.2945 12.1903L12.9695 13.6168L12.9703 13.6175ZM8.75 9.15126H11V10.6513H8.75V12.1513H7.25V10.6513H5V9.15126H7.25V8.40126H5V6.90126H6.9395L5.348 5.31051L6.41 4.25001L8 5.84076L9.59075 4.25001L10.652 5.31051L9.0605 6.90201H11V8.40201H8.75V9.15201V9.15126Z" fill="#525866" />
                    </svg>

                    <p className='text-[#525866] text-[14px] leading-none'>{t('worker.services.create.step3.price')}</p>
                  </div>

                  <span className='text-[#0E121B] text-[24px]'>
                    {displayData.price}
                  </span>

                </div>
                <div className='flex flex-row items-center justify-between'>
                  <div className='flex flex-row items-center gap-1'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.75 3.25H16.75C16.9489 3.25 17.1397 3.32902 17.2803 3.46967C17.421 3.61032 17.5 3.80109 17.5 4V16C17.5 16.1989 17.421 16.3897 17.2803 16.5303C17.1397 16.671 16.9489 16.75 16.75 16.75H3.25C3.05109 16.75 2.86032 16.671 2.71967 16.5303C2.57902 16.3897 2.5 16.1989 2.5 16V4C2.5 3.80109 2.57902 3.61032 2.71967 3.46967C2.86032 3.32902 3.05109 3.25 3.25 3.25H6.25V1.75H7.75V3.25H12.25V1.75H13.75V3.25ZM12.25 4.75H7.75V6.25H6.25V4.75H4V7.75H16V4.75H13.75V6.25H12.25V4.75ZM16 9.25H4V15.25H16V9.25Z" fill="#525866" />
                    </svg>


                    <p className='text-[#525866] text-[14px] leading-none'>{t('worker.services.create.step3.leadTime')}</p>
                  </div>

                  <span className='text-[#0E121B] text-[14px]'>
                    {displayData.leadTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Use props */}
            <div className='flex gap-3'>
              <Button.Root
                variant='neutral'
                mode='stroke'
                onClick={prevStep} // Use prop
                className='flex-1'
                disabled={isSubmitting} // Use prop
              >
                {t('worker.services.create.step3.edit')}
              </Button.Root>
              <FancyButton.Root
                variant='neutral'
                onClick={submitForm} // Use prop
                className='flex-1'
                disabled={isSubmitting} // Use prop
              >
                {isSubmitting ? (
                  <>
                    <Button.Icon as={RiLoader4Line} className='animate-spin' />
                    {t('worker.services.create.step3.posting')}
                  </>
                ) : (
                  t('worker.services.create.step3.post')
                )}
              </FancyButton.Root>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
