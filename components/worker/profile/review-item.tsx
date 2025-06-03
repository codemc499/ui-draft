import React from 'react';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import { RiStarFill, RiHeartLine } from '@remixicon/react';
import { ReviewItemData } from './types';
import Translate from '@/components/Translate';

interface ReviewItemProps {
  review: ReviewItemData;
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="border-stroke-soft-200 py-4 border-b hover:bg-[#F5F7FA] px-[16px]">
      {/* Top row: avatar + name on left, price + like on right */}
      <div className="flex items-start justify-between mb-3">
        {/* left */}
        <div className="flex items-start gap-3">
          <Avatar.Root size="48">
            <Avatar.Image src={review.reviewerAvatar} alt={review.reviewer} />
          </Avatar.Root>
          <div className="flex flex-col gap-2 mt-1">
            <p className="text-text-secondary-600 text-label-sm font-medium">
              {review.reviewer}
            </p>
            <div className="flex items-center gap-3 text-paragraph-xs text-gray-600">
              <div className="flex items-center gap-0.5">
                <RiStarFill className="size-3.5 text-yellow-400" />
                <span>{review.rating}</span>
              </div>
              <span>{review.date}</span>
            </div>
          </div>
        </div>

        {/* right */}
        <div className="flex flex-col items-center my-auto">
          <span className="text-label-lg font-medium text-text-strong-950">
            <Translate id="reviewListItem.amount" values={{ amount: review.price.toFixed(2) }} />
          </span>
        </div>
      </div>

      {/* Bottom row: title + description */}
      <div className=''>
        <h3 className="mb-1 mt-4 text-paragraph-lg font-medium text-text-strong-950">
          {review.contractTitle}
        </h3>
        <p className="text-gray-600 line-clamp-2 text-paragraph-sm">
          {review.content}
        </p>
      </div>
    </div>
  );
}
