'use client';

import React from 'react';
import Image from 'next/image'; // Keep Image import
import Link from 'next/link'; // Added Link import
import * as Avatar from '@/components/ui/avatar'; // Keep Avatar if needed for fallback/placeholder
import { RiStarFill } from '@remixicon/react';
// Removed import for local ./types
import { Service } from '@/utils/supabase/types'; // Import the standard Service type
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

// Updated props to use the standard Service type
interface ServiceCardProps {
  service: Service;
  rating?: number | null;
  reviewCount?: number | null;
  sellerAvatarUrl?: string | undefined; // Explicitly removed null
  sellerName?: string | null;
}

// Renamed component function for clarity, export remains ServiceCard
export function ServiceCard({ service, rating, reviewCount, sellerAvatarUrl, sellerName }: ServiceCardProps) {
  const { t } = useTranslation('common');

  // Provide fallbacks for potentially missing data
  const displayTitle = service.title || t('service.card.untitled');
  const displayPrice = typeof service.price === 'number' ? service.price : 0;
  const displayCurrency = service.currency || 'USD'; // Default currency
  // Get the first image URL, or use a placeholder
  const imageUrl = service.images?.[0]?.url;
  const fallbackImageUrl = 'https://placekitten.com/300/160'; // Placeholder kitten

  // Fallbacks for seller info
  const displaySellerName = sellerName || t('service.card.seller');
  const sellerInitial = displaySellerName.charAt(0).toUpperCase();
  const fallbackAvatarUrl = 'https://placekitten.com/32/32'; // Default avatar if URL missing

  // Determine if valid rating/review data is passed
  const hasRatingData = typeof rating === 'number' && typeof reviewCount === 'number';

  // Function to get currency symbol (optional, could be simpler)
  const getCurrencySymbol = (currencyCode: string): string => {
    switch (currencyCode?.toUpperCase()) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'CNY': return '¥';
      default: return ''; // Return empty or the code itself
    }
  };

  return (
    // Wrap the entire card content with a Link
    <Link href={`/${i18n.language}/services/${service.id}`} className="block group">
      <div className='shadow-sm group-hover:shadow-md overflow-hidden rounded-lg border border-stroke-soft-200 bg-bg-white-0 hover:shadow-[0_6px_14px_-4px_rgba(0,0,0,0.15)] transition-shadow duration-200'>
        {/* Image Section - Use Next/Image or img tag */}
        <div className={`relative h-40 w-full bg-gray-200`}> {/* Fallback bg */}
          <Image
            src={imageUrl || fallbackImageUrl}
            alt={displayTitle}
            fill // Use fill layout
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Example sizes
            className="object-cover" // Ensure image covers the area
            onError={(e) => { e.currentTarget.src = fallbackImageUrl; }} // Handle image loading errors
          />
          {/* Removed the top-right avatar as it's not directly in Service type */}
        </div>

        <div className='p-3 space-y-2'> {/* Added space-y-2 for spacing */}
          {/* Title */}
          <p className='line-clamp-2 text-paragraph-sm font-medium text-text-strong-950 transition-colors'>
            {displayTitle}
          </p>

          {/* Rating and Price */}
          <div className='flex items-center justify-between text-paragraph-sm'>
            {/* Display passed rating/review or placeholder */}
            <div className='text-text-secondary-600 flex items-center gap-0.5'>
              <RiStarFill className='size-3.5 text-yellow-400' />
              <span className='text-gray-600'>
                {hasRatingData ? (
                  t('service.card.defaultRating', { rating: rating?.toFixed(1), count: reviewCount || 0 })
                ) : (
                  t('service.card.defaultRating', { rating: '4.8', count: 100 })
                )}
              </span>
            </div>
            <span className='font-medium text-text-strong-950'>
              {getCurrencySymbol(displayCurrency)}{displayPrice}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
