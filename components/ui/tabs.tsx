'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/utils/cn';

const TabsRoot = TabsPrimitive.Root;
TabsRoot.displayName = 'TabsRoot';

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'text-text-secondary-600 inline-flex h-10 items-center justify-center rounded-md bg-white p-1',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'text-sm inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-[#F6F8FA] data-[state=active]:text-text-strong-950',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';

export {
  TabsRoot as Root,
  TabsList as List,
  TabsTrigger as Trigger,
  TabsContent as Content,
};
