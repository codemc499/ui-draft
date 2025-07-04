import { cn } from '@/utils/cn';
import type { PolymorphicComponentProps } from '@/utils/polymorphic';

function WidgetBox({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'w-full rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200',
        className,
      )}
      {...rest}
    />
  );
}

function WidgetBoxHeader({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'grid auto-cols-auto grid-flow-col grid-cols-1 items-center gap-2 has-[>svg:first-child]:grid-cols-[auto,minmax(0,1fr)]',
        'h-12 pb-4 text-label-md',
        className,
      )}
      {...rest}
    />
  );
}

function WidgetBoxHeaderIcon<T extends React.ElementType>({
  className,
  as,
  ...rest
}: PolymorphicComponentProps<T, React.HTMLAttributes<HTMLDivElement>>) {
  const Component = as || 'div';
  return (
    <Component
      className={cn('size-6 text-text-sub-600', className)}
      {...rest}
    />
  );
}

export {
  WidgetBox as Root,
  WidgetBoxHeader as Header,
  WidgetBoxHeaderIcon as HeaderIcon,
};
