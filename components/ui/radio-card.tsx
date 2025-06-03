'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

interface RadioCardProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  onChange?: () => void;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, RadioCardProps>(
  ({ className, checked, onChange, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'cursor-pointer rounded-md border border-stroke-soft-200 transition-colors duration-200',
          'hover:border-primary-base',
          checked && 'bg-bg-sub-50 border-primary-base',
          className,
        )}
        onClick={onChange}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = 'RadioCard';

interface CardIconProps extends React.SVGAttributes<SVGElement> {
  as: React.ElementType;
  size?: number;
}

function CardIcon({ as: Icon, className, size = 24, ...rest }: CardIconProps) {
  return <Icon className={cn('', className)} size={size} {...rest} />;
}
CardIcon.displayName = 'RadioCardIcon';

interface CardLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

function CardLabel({ className, children, ...rest }: CardLabelProps) {
  return (
    <p className={cn('text-text-strong-950', className)} {...rest}>
      {children}
    </p>
  );
}
CardLabel.displayName = 'RadioCardLabel';

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

function CardDescription({
  className,
  children,
  ...rest
}: CardDescriptionProps) {
  return (
    <p className={cn('text-text-secondary-600 text-sm', className)} {...rest}>
      {children}
    </p>
  );
}
CardDescription.displayName = 'RadioCardDescription';

export { Card, CardIcon, CardLabel, CardDescription };
