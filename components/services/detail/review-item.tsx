'use client';

import React from 'react';
import * as Avatar from '@/components/ui/avatar';

import { RiStarFill } from '@remixicon/react';
import { Review } from './types'; // Import type

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className='pt-[16px] px-4'>
      <div className='mb-[16px] flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <Avatar.Root size='48'>
            <Avatar.Image src={review.user.avatar} alt={review.user.name} />
            {/* Add status indicator if available */}
          </Avatar.Root>
          <div>
            <p className='text-[14px] font-medium text-[#0E121B]'>
              {review.user.name}
            </p>
            <div className='text-[#525866] flex items-center gap-2 text-paragraph-xs'>
              <div className='flex items-center gap-0.5'>
                <RiStarFill className='size-3.5 text-yellow-400' />
                <span>{review.user.rating}</span>
              </div>
              <span>{review.date}</span>
            </div>
          </div>
        </div>
        <span className='text-[18px] text-[#0E121B] font-medium'>
          ${review.amount.toFixed(2)}
        </span>
      </div>
      <div className=''>
        <p className='text-[#525866] line-clamp-3 text-paragraph-sm'>
          {review.text}
        </p>
      </div>
    </div>
  );
}
