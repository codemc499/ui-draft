'use client';

import React from 'react';
import * as Avatar from '@/components/ui/avatar';
import { RiStarFill } from '@remixicon/react';
import { useTranslation } from 'react-i18next';

/* ------------------------------------------------------------------ */
/** Compact block showing one buyer/seller review —
 *  identical markup to the original monolith, now isolated.
 */
export default function ReviewListItem() {
  const { t } = useTranslation('common');

  /* Static mock data — swap out for props / real API later */
  const review = {
    avatarUrl: 'https://via.placeholder.com/40',
    name: 'Cleve Music',
    rating: 4.9,
    date: 'Jan 8, 2023',
    title: t('reviewListItem.contractTitle'),
    description: t('reviewListItem.description'),
    amount: 1_000.0,
  };

  return (
    <div className="border-b border-stroke-soft-200 py-4">
      {/* ---------- top row (avatar, meta, amount) ---------- */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar.Root size="40" className="shrink-0">
            <Avatar.Image src={review.avatarUrl} alt={review.name} />
          </Avatar.Root>

          <div className="flex flex-col">
            <div className="text-label-sm font-medium text-text-secondary-600">
              {review.name}
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                <RiStarFill className="size-3.5 text-yellow-400" />
                <span className="text-paragraph-xs text-gray-600">
                  {review.rating}
                </span>
              </div>
              <span className="text-paragraph-xs text-gray-600">
                {review.date}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 text-label-lg font-medium text-text-strong-950">
          {t('reviewListItem.amount', { amount: review.amount.toFixed(2) })}
        </div>
      </div>

      {/* ---------- bottom row (title & description) ---------- */}
      <h3 className="mb-1 text-paragraph-lg font-medium text-text-strong-950">
        {review.title}
      </h3>
      <p className="line-clamp-2 text-paragraph-sm text-gray-600">
        {review.description}
      </p>
    </div>
  );
}
