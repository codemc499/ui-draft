'use client';

import * as React from 'react';
import * as Slider from '@/components/ui/slider';
import * as Tooltip from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import Translate from '@/components/Translate';

interface PriceRangeSliderProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  minStepsBetweenThumbs?: number;
  className?: string;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

export function PriceRangeSlider({
  value,
  onValueChange,
  min = 0,
  max = 1000, // Default max
  step = 1,
  minStepsBetweenThumbs,
  className,
}: PriceRangeSliderProps) {
  // Tooltip state - always open for visibility as in the example
  // You might want to control this differently (e.g., on hover/focus)
  const [isOpen, setIsOpen] = React.useState(false);
  React.useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className={cn('relative mb-6 w-full', className)}> {/* Adjusted wrapper */}
      <Slider.Root
        value={value}
        onValueChange={(val) => onValueChange(val as [number, number])} // Use passed handler
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
      // Removed defaultValue as value is controlled by props
      >
        {/* Tooltip for Min Thumb */}
        <Tooltip.Root open={isOpen}>
          <Tooltip.Trigger asChild>
            <Slider.Thumb />
          </Tooltip.Trigger>
          <Tooltip.Content
            size='xsmall'
            side='top'
            forceMount
            className='text-[10px] rounded bg-black px-1 py-0.5 text-white'
          >
            {formatCurrency(value[0] ?? 0)}
          </Tooltip.Content>
        </Tooltip.Root>

        {/* Tooltip for Max Thumb */}
        <Tooltip.Root open={isOpen}>
          <Tooltip.Trigger asChild>
            <Slider.Thumb />
          </Tooltip.Trigger>
          <Tooltip.Content
            size='xsmall'
            side='top'
            forceMount
            className='text-[10px] rounded bg-black px-1 py-0.5 text-white'
          >
            {formatCurrency(value[1] ?? 0)}
          </Tooltip.Content>
        </Tooltip.Root>
      </Slider.Root>
    </div>
  );
} 