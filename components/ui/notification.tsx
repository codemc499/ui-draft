// AlignUI Notification v0.0.0

import * as React from 'react';
// import * as Alert from '@/components/ui/alert'; // Removed Alert import
import { cn } from '@/utils/cn';
import * as NotificationPrimitives from '@radix-ui/react-toast';
import {
  RiAlertFill,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiInformationFill,
} from '@remixicon/react';

const NotificationProvider = NotificationPrimitives.Provider;
const NotificationAction = NotificationPrimitives.Action;

const NotificationViewport = React.forwardRef<
  React.ComponentRef<typeof NotificationPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof NotificationPrimitives.Viewport>
>(({ className, ...rest }, forwardedRef) => (
  <NotificationPrimitives.Viewport
    ref={forwardedRef}
    className={cn(
      // Centered horizontally, near bottom, fit content width
      'fixed bottom-6 left-1/2  z-[9999] flex w-fit -translate-x-1/2 flex-col gap-3 p-4',
      className,
    )}
    {...rest}
  />
));
NotificationViewport.displayName = 'NotificationViewport';

type NotificationProps = React.ComponentPropsWithoutRef<
  typeof NotificationPrimitives.Root
> & {
  // Keep only description and action if needed
  description?: React.ReactNode;
  action?: React.ReactNode; // Optional: Keep if actions are sometimes needed
  notificationType?: 'success' | 'error' | 'warning' | 'info';
};

const Notification = React.forwardRef<
  React.ComponentRef<typeof NotificationPrimitives.Root>,
  NotificationProps
>(
  (
    {
      className,
      description,
      action,
      notificationType = 'success',
      // Removed status, variant, title, disableDismiss
      ...rest
    }: NotificationProps,
    forwardedRef,
  ) => {
    // Static icon
    const Icon = notificationType === 'success' ? RiCheckboxCircleFill : notificationType === 'error' ? RiCloseCircleFill : notificationType === 'warning' ? RiAlertFill : RiInformationFill;

    return (
      <NotificationPrimitives.Root
        ref={forwardedRef}
        className={cn(
          // Base style: White bg, rounded, shadow, padding, flex layout
          'flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-gray-900 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50',
          // Animations (keep default ones)
          'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full', // Adjusted animation for bottom
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-bottom-full', // Adjusted animation for bottom
          // Swipe (keep default ones)
          'data-[swipe=cancel]:translate-y-0 data-[swipe=end]:translate-y-[var(--radix-toast-swipe-end-y)] data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=move]:transition-none data-[swipe=end]:animate-out',
          className,
        )}
        // Removed asChild
        {...rest}
      >
        {/* Icon */}
        <Icon className="size-5 shrink-0 text-black dark:text-white" aria-hidden='true' />
        {/* Content Wrapper */}
        <div className='flex w-full flex-col gap-1'>
          {/* Description (Main Text) */}
          {description && (
            <NotificationPrimitives.Description className='text-sm font-medium'>
              {description}
            </NotificationPrimitives.Description>
          )}
          {/* Optional Action Area */}
          {action && <div className='flex items-center gap-2'>{action}</div>}
        </div>
        {/* Close Button */}
      </NotificationPrimitives.Root>
    );
  },
);
Notification.displayName = 'Notification';

export {
  Notification as Root,
  NotificationProvider as Provider,
  NotificationAction as Action,
  NotificationViewport as Viewport,
  type NotificationProps,
};
