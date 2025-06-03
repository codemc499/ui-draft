import React from 'react';

interface ChatLoadingSkeletonProps {
  isPopup?: boolean;
}

export default function ChatLoadingSkeleton({ isPopup = false }: ChatLoadingSkeletonProps) {
  // Base class for both modes
  const containerClass = 'flex animate-pulse flex-col';

  // Mode specific classes
  const containerModeClass = isPopup
    ? 'rounded-lg shadow-lg h-[500px] w-[350px]'
    : 'h-full';

  return (
    <div className={`${containerClass} ${containerModeClass}`}>
      {/* Header Skeleton */}
      <div className='border-b p-4'>
        <div className='flex items-center space-x-3'>
          <div className='h-10 w-10 rounded-full bg-gray-300'></div>
          <div className='h-4 w-1/3 rounded bg-gray-300'></div>
        </div>
      </div>

      {/* Message List Skeleton */}
      <div className='flex-1 space-y-4 overflow-y-auto p-4'>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`w-2/3 rounded-lg p-3 ${i % 2 === 0 ? 'bg-gray-200' : 'bg-gray-400'}`}
            >
              <div className='mb-1 h-3 w-1/4 rounded bg-gray-300'></div>
              <div className='h-4 w-full rounded bg-gray-300'></div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Skeleton */}
      <div className='border-t p-4'>
        <div className='flex items-center space-x-2'>
          <div className='h-10 flex-1 rounded bg-gray-200'></div>
          <div className='h-10 w-16 rounded bg-gray-300'></div>
        </div>
      </div>
    </div>
  );
}
