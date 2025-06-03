'use client';

import React from 'react';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import { clsx } from 'clsx';
import { RiArrowRightSLine } from '@remixicon/react';
import { useTranslation } from 'react-i18next';

/* ------------------------------------------------------------------ */
/** Minimal shape—extend or replace with your real order type. */
export interface OrderListItemProps {
  title: string;
  tags: string[];
  description: string;
  budget: number;
  onApply?: () => void;
}

/* ------------------------------------------------------------------ */
/** Compact "card" style order preview suitable for a list or drawer. */
export default function OrderListItem({
  title,
  tags,
  description,
  budget,
  onApply,
}: OrderListItemProps) {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-start justify-between gap-4 border-b border-stroke-soft-200 py-4">
      {/* -------- Text block -------- */}
      <div className="flex-1 max-w-[80%]">
        {/* Title */}
        <h3 className="mb-1 text-paragraph-lg font-medium text-text-strong-950">
          {title}
        </h3>

        {/* Tags */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <Badge.Root
              key={tag}
              variant="light"
              size="small"
              className={clsx(
                'rounded-md bg-white px-2 py-0.5',
                i === 0
                  ? 'border border-black text-text-strong-950'
                  : 'border border-gray-300 text-text-secondary-600',
              )}
            >
              {tag}
            </Badge.Root>
          ))}
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-paragraph-sm text-text-secondary-600">
          {description}
        </p>
      </div>

      {/* -------- Budget + action -------- */}
      <div className="shrink-0 text-right">
        <div className="text-label-sm text-gray-600">{t('orders.budget')}</div>
        <div className="mb-2 text-label-lg font-medium text-text-strong-950">
          ${budget.toLocaleString()}
        </div>
        <Button.Root
          variant="neutral"
          mode="stroke"
          size="small"
          onClick={onApply}
        >
          {t('orders.apply')}
          <Button.Icon as={RiArrowRightSLine} />
        </Button.Root>
      </div>
    </div>
  );
}
