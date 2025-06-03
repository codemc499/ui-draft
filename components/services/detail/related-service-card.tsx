'use client';

import React from 'react';
import Link from 'next/link';
import * as Avatar from '@/components/ui/avatar';
import { RiStarFill } from '@remixicon/react';
import { Service } from '@/utils/supabase/types';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

interface RelatedServiceCardProps {
  service: Service;
}

function getCurrencySymbol(currencyCode: string): string {
  try {
    return (0).toLocaleString('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).replace(/\d/g, '').trim();
  } catch {
    return currencyCode;
  }
}

export function RelatedServiceCard({ service }: RelatedServiceCardProps) {
  const { t } = useTranslation('common');

  const formatCurrency = (amount: number, currencyCode?: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const imageUrl = service.images?.[0]?.url;
  const imagePlaceholder = 'bg-gradient-to-br from-blue-400 to-purple-500';

  return (
    <Link href={`/${i18n.language}/services/${service.id}`} className='group block flex-shrink-0 basis-[calc((100%-32px)/3)] max-w-[253px] max-h-[256px]'>
      <div className='shadow-sm group-hover:shadow-md overflow-hidden rounded-lg border border-t-0  border-stroke-soft-200 bg-bg-white-0 hover:shadow-[0_6px_14px_-4px_rgba(0,0,0,0.15)] transition-shadow duration-200 h-full flex flex-col'>
        {/* Image Section */}
        <div className={`relative w-full h-[164px] ${!imageUrl ? imagePlaceholder : ''}`}>
          {imageUrl ? (
            <img src={imageUrl} alt={service.title} className="w-full h-full object-cover" />
          ) : (
            <div className="size-full flex items-center justify-center">
              {t('service.related.noImage')}
            </div>
          )}
          {/* Seller Avatar Placeholder */}
          <div className='absolute right-2 top-2'>
            <Avatar.Root size='24' color='blue'>
              <span className='text-label-xs font-medium'>
                {service.seller_name?.charAt(0) || t('service.related.sellerInitial')}
              </span>
            </Avatar.Root>
          </div>
        </div>
        {/* Content Section */}
        <div className='p-2.5 flex flex-col flex-grow'>
          <p className='text-[14px] text-[14px] text-[#0E121B] mb-1.5 line-clamp-2 font-medium flex-grow'>
            {service.title}
          </p>
          <div className='flex items-center justify-between mt-auto'>
            <div className='text-[12px] text-[#525866] flex items-center gap-0.5'>
              <RiStarFill className='size-4 text-yellow-400' />
              <span>
                {t('service.related.rating', { rating: 4.5, count: 50 })}
              </span>
            </div>
            <span className='font-medium text-[#0E121B]'>
              <span className='text-[12px]'>{getCurrencySymbol(service.currency)}</span>
              <span className='text-[16px]'>{service.price}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

