'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Avatar from '@/components/ui/avatar';
// import * as Button from '@/components/ui/button'; // Buttons removed
import * as Badge from '@/components/ui/badge';
import * as Divider from '@/components/ui/divider';
import * as Tag from '@/components/ui/tag';
// Keep for potential future use or remove if definitely not needed
import {
  RiStarFill,
  RiGoogleFill,
  RiTwitchFill,
  RiTwitterXFill,
} from '@remixicon/react';
import Link from 'next/link';

// Define types for the data needed by this specific sidebar variant
interface OfferWorkerSkill {
  name: string;
  details?: string;
  // Price info might not be relevant here, adjust as needed
}

interface OfferWorkerData {
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  isGoogle: boolean;
  socialLinks?: string[];
  about: string; // Added About section
  skills: OfferWorkerSkill[];
  // Awards removed
}

interface OfferProfileSidebarProps {
  worker: OfferWorkerData;
}

export function OfferProfileSidebar({ worker }: OfferProfileSidebarProps) {
  const { t } = useTranslation('common');

  // Helper to get social icon remains the same
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitch':
        return <RiTwitchFill className='size-5 text-[#6441A5]' />;
      case 'twitter':
        return <RiTwitterXFill className='size-5 text-black' />;
      case 'google':
        return <RiGoogleFill className='text-icon-secondary-400 size-5' />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Profile Section */}
      <div className='flex flex-col items-center gap-2 pt-[52px] pb-[32px] px-5 mb-4 mb-0'>
        <div className='flex flex-col items-center gap-1'>
          {!worker.avatar && worker.avatar !== "" ? <Avatar.Root size='80'>
            <Avatar.Image src={worker.avatar} alt={worker.name} />
            <Avatar.Indicator position='bottom'>
              <Avatar.Status status='online' />
            </Avatar.Indicator>
          </Avatar.Root> :
            <Avatar.Root size='80' color='yellow'>{worker.name.charAt(0).toUpperCase()}</Avatar.Root>}
          <div className='text-center flex flex-col gap-[3px]'>
            <h2 className='text-[16px] font-medium text-[#525866]'>
              {worker.name}
            </h2>
            <div className='text-text-secondary-600 flex items-center justify-center gap-1 text-paragraph-sm'>
              <RiStarFill className='size-4 text-yellow-500' />
              <span className='text-[#525866] text-[12px]'>
                {worker.rating.toFixed(1)} ({worker.reviewCount})
              </span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {/* Placeholder Google Logos */}
          <div className='flex flex-row items-center gap-1 text-[#525866] text-[12px] hover:bg-[#F6F8FA] rounded-md p-1'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.00015 11.5C9.93325 11.5 11.5003 9.93283 11.5003 7.99973C11.5003 6.06663 9.93325 4.49951 8.00015 4.49951C6.06704 4.49951 4.5 6.06663 4.5 7.99973C4.5 9.93283 6.06704 11.5 8.00015 11.5Z" fill="white" />
              <path d="M4.96887 9.75042L1.93811 4.50098C1.32358 5.56505 1 6.77214 1 8.00098C1 9.22982 1.32343 10.4369 1.93789 11.501C2.55235 12.5651 3.43615 13.4487 4.50037 14.0629C5.56459 14.677 6.77182 15.0002 8.00059 14.9999L11.0313 9.75042V9.74962C10.7244 10.282 10.2826 10.7241 9.75055 11.0315C9.21848 11.3389 8.61485 11.5008 8.00036 11.5009C7.38588 11.501 6.7822 11.3393 6.25004 11.032C5.71788 10.7248 5.27602 10.2828 4.96887 9.75057V9.75042Z" fill="#229342" />
              <path d="M11.031 9.75033L8.00027 14.9998C9.22904 15 10.4362 14.6766 11.5003 14.0623C12.5645 13.4479 13.4481 12.5642 14.0625 11.5C14.6767 10.4358 15 9.22862 14.9998 7.99985C14.9996 6.77109 14.6759 5.564 14.0612 4.5H7.99976L7.99902 4.50052C8.61351 4.50022 9.21724 4.66173 9.7495 4.9688C10.2818 5.27592 10.7238 5.71767 11.0311 6.24982C11.3384 6.78195 11.5002 7.38562 11.5002 8.00012C11.5002 8.61462 11.3384 9.21829 11.031 9.7504L11.031 9.75033Z" fill="#FBC116" />
              <path d="M8.00046 10.7715C9.53084 10.7715 10.7714 9.53091 10.7714 8.00047C10.7714 6.47002 9.53084 5.22949 8.00046 5.22949C6.47009 5.22949 5.22949 6.47009 5.22949 8.00047C5.22949 9.53084 6.47009 10.7715 8.00046 10.7715Z" fill="#1A73E8" />
              <path d="M8.00044 4.50022H14.0619C13.4477 3.436 12.5641 2.5522 11.4999 1.93774C10.4358 1.32333 9.22868 0.999907 7.99993 1C6.77116 1.00007 5.56407 1.32366 4.50007 1.93826C3.43603 2.55283 2.55256 3.43671 1.93848 4.50103L4.96924 9.75048L4.97005 9.75092C4.66254 9.21889 4.50055 8.61527 4.50036 8.00077C4.50016 7.38627 4.66178 6.78255 4.96894 6.25033C5.27606 5.71811 5.71804 5.27613 6.25018 4.96894C6.78233 4.66175 7.38606 4.5 8.00059 4.50015L8.00044 4.50022Z" fill="#E33B2E" />
            </svg>
            {t('offers.profileSidebar.google')}
          </div>
          <div className='flex flex-row items-center gap-1 text-[#525866]  text-[12px] hover:bg-[#F6F8FA] rounded-md p-1'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.14258 6.72729V9.4382H11.9868C11.818 10.31 11.3114 11.0482 10.5517 11.5446L12.8699 13.3073C14.2205 12.0855 14.9998 10.291 14.9998 8.15918C14.9998 7.66283 14.9543 7.18551 14.8699 6.72737L8.14258 6.72729Z" fill="#4285F4" />
              <path d="M4.13966 9.33234L3.61681 9.72456L1.76611 11.1373C2.94145 13.4218 5.35039 15 8.14261 15C10.0712 15 11.688 14.3763 12.8699 13.3073L10.5517 11.5445C9.91532 11.9645 9.10362 12.2191 8.14261 12.2191C6.28545 12.2191 4.70756 10.9909 4.14258 9.33638L4.13966 9.33234Z" fill="#34A853" />
              <path d="M1.76619 4.86285C1.27919 5.80463 1 6.86737 1 8.00007C1 9.13278 1.27919 10.1955 1.76619 11.1373C1.76619 11.1436 4.14288 9.33003 4.14288 9.33003C4.00002 8.91003 3.91558 8.46461 3.91558 8C3.91558 7.5354 4.00002 7.08997 4.14288 6.66997L1.76619 4.86285Z" fill="#FBBC05" />
              <path d="M8.14275 3.78726C9.19473 3.78726 10.1298 4.14361 10.8766 4.83089L12.922 2.82638C11.6817 1.69368 10.0714 1 8.14275 1C5.35054 1 2.94145 2.57181 1.76611 4.86272L4.14273 6.66999C4.70764 5.01543 6.2856 3.78726 8.14275 3.78726Z" fill="#EA4335" />
            </svg>
            {t('offers.profileSidebar.google')}
          </div>
        </div>
      </div>
      <div className='px-4 m-0'>
        <Divider.Root className='' />
      </div>

      {/* About Section */}
      <div className='py-4 px-5'>
        <h2 className='mb-2 text-[14px] font-medium text-[#0E121B]'>
          {t('offers.profileSidebar.about')}
        </h2>
        <p className='text-[12px] text-[#525866]'>{worker.about}</p>
      </div>

      <div className='px-5'>
        <Divider.Root className='' />
      </div>

      {/* Skills Section */}
      <div className='py-4 px-5'>
        <h2 className='mb-3 text-[14px] font-medium text-text-strong-950'>
          {t('offers.profileSidebar.skills')}
        </h2>
        <div className='flex flex-wrap gap-1.5'>
          {worker.skills.map((skill, idx) => (
            // Displaying skills as badges here, adjust if needed
            <Tag.Root key={idx} variant='stroke'>
              {skill.name}
              {skill.details ? ` - ${skill.details}` : ''}
            </Tag.Root>
          ))}
        </div>
      </div>

      {/* <div className='px-5'>
        <Divider.Root className='' />
      </div> */}

      {/* Awards Section Removed */}

      {/* Tools/Products Section - Example based on screenshot */}
      <div className='pb-5 px-5'>
        <h2 className='mb-3 text-[14px] font-medium text-text-strong-950 mt-0'>
          {t('offers.profileSidebar.toolsAndProducts')}
        </h2>
        <div className='flex flex-wrap gap-1.5'>
          {/* Assuming skills data might represent tools/products too, or fetch separately */}
          {/* Example using first skill as a placeholder */}
          {worker.skills.length > 0 && (
            <Tag.Root variant='stroke'>
              {t('offers.profileSidebar.products', { count: 1 })}
            </Tag.Root>
          )}
          {/* Add more badges based on actual tool/product data */}
        </div>
      </div>
    </>
  );
}
