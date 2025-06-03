'use client';

import React from 'react';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';

// Bookmark SVG Component
const BookmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.8978 2H6.1122C4.40098 2 3 3.38917 3 5.08596V16.3582C3 17.797 4.04074 18.4122 5.31164 17.7077L9.24443 15.5346C9.66473 15.3064 10.3452 15.3064 10.7555 15.5346L14.6883 17.7077C15.9592 18.4122 16.9999 17.797 16.9999 16.3582V5.08596C17.01 3.38917 15.609 2 13.8978 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface ProjectHeaderProps {
  title: string;
  category: string;
  showBookmark?: boolean;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ title, category, showBookmark }) => {
  return (
    <div className=''>
      <div className='flex justify-between items-center'>
        {/* Left side: title + category */}
        <div className='flex items-center gap-2'>
          <h1 className='font-medium text-[24px] leading-[32px] tracking-normal text-text-strong-950'>
            {title}
          </h1>
          <Badge.Root
            variant="light"
            size="small"
            color="gray"
            className="
              shrink-0
              w-[81px] h-[20px]
              px-4 py-1
              gap-[2px]
              rounded-full
              bg-neutral-100 border border-neutral-200
              flex items-center justify-center
              text-[#525866] capitalize
            "
          >
            {category}
          </Badge.Root>
        </div>

        {/* Right side: bookmark */}
        {showBookmark && (
          <Button.Root
            variant="neutral"
            mode="ghost"
            size="small"
            className="!text-gray-400 hover:!text-gray-500"
          >
            <Button.Icon>
              <BookmarkIcon />
            </Button.Icon>
          </Button.Root>
        )}
      </div>

      {/* underline */}
      <div className="h-[1.5px] bg-stroke-soft-200 mx-auto mt-[24px]" />
    </div>
  );
};

export default ProjectHeader;
