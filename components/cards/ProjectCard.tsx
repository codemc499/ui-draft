'use client';

import React from 'react';
import * as Avatar from '@/components/ui/avatar';
import * as Tag from '@/components/ui/tag';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import { RiStarFill, RiArrowRightSLine } from '@remixicon/react';
import { cn } from '@/utils/cn';
import { useNotification, notification as notify } from '@/hooks/use-notification';
import Translate from '@/components/Translate';

// --- Interfaces --- //
interface ProjectInfoBadge {
  label: string;
}

interface ClientInfo {
  avatarUrl: string;
  name: string;
  rating: number;
  reviewCount: number;
}

interface ProjectCardProps {
  title: string;
  infoBadges: ProjectInfoBadge[];
  skillTags: string[];
  description: string;
  client: ClientInfo;
  budget: number;
  onApply?: () => void;
  className?: string;
  projectId?: string;
  hasApplied?: boolean;
}

// --- Project Card Component --- //
export function ProjectCard({
  title,
  infoBadges,
  skillTags,
  description,
  client,
  budget,
  onApply,
  className,
  projectId,
  hasApplied = false,
}: ProjectCardProps) {
  // Log the client prop
  console.log('ProjectCard client prop:', client);

  const handleApplyClick = () => {
    if (onApply && !hasApplied) {
      onApply();
    }

    if (!hasApplied) {
      notify({
        description: `Application Sent! Successfully applied to project: ${title}`,
      });
    }

    console.log('Apply button clicked for project ID:', projectId);
  };

  return (
    <div
      className={cn(
        'overflow-hidden border-b border-stroke-soft-200 p-4 shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className='grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]'>
        {/* Left Column (Content) */}
        <div className='flex flex-col gap-3'>
          {/* Title and Info Badges */}
          <div className='flex flex-wrap items-center items-start gap-x-4'>
            <h3 className='text-[20px] font-medium text-text-strong-950'>{title}</h3>
            <div className='flex flex-wrap gap-1'>
              {infoBadges.map((badge) => (
                <Badge.Root
                  key={badge.label}
                  variant='light'
                  className={cn(
                    'inline-flex items-center capitalize',
                    'bg-[#F6F8FA]',
                    'px-[16px] py-[11px]',
                    'border border-[#E2E4E9]',
                    'h-7',
                    'rounded-full',
                    'text-[#6a6a6a] text-[0.875rem] leading-[16px]'
                  )}
                >
                  {badge.label}
                </Badge.Root>
              ))}
            </div>
          </div>

          {/* Skill Tags */}
          <div className='flex flex-wrap gap-1.5 font-medium text-[10px]'>
            {skillTags.map((skill, index) => (
              <Tag.Root
                key={skill}
                variant={index === 0 ? 'stroke' : 'gray'}
                className={index === 0 ? 'text-[10px] border border-black text-black hover:bg-[#F6F8FA]' : 'text-[10px] border border-[#E2E4E9] bg-white text-[#525866] hover:bg-[#F6F8FA] hover:text-black'}
              >
                {skill}
              </Tag.Root>
            ))}
          </div>

          {/* Description */}
          <p className='line-clamp-3 text-[14px] text-[#0E121B] text-text-secondary-600'>
            {description}
          </p>

          {/* Client Info */}
          <div className='flex items-center gap-2.5 pt-2'>
            <Avatar.Root size="20" className='bg-[#C0EAFF] text-[#124B68]'>
              {client.name?.charAt(0).toUpperCase()}
            </Avatar.Root>
            {/* {client.avatarUrl ? (
              <Avatar.Root className="w-[20px] h-[20px]">
                <Avatar.Image
                  src={client.avatarUrl}
                  alt={`${client.name}'s avatar`}
                  className="w-full h-full rounded-full object-cover"
                />
              </Avatar.Root>
            ) : (
              <Avatar.Root size="40" color="blue">
                {client.name?.charAt(0).toUpperCase()}
              </Avatar.Root>
            )} */}
            <span className='text-[12px] font-medium text-[#525866]'>
              {client.name}
            </span>
            <div className='flex items-center gap-0.5 text-[12px] text-[#525866]'>
              <RiStarFill className='text-yellow-500 size-4' />
              <span>
                {client.rating.toFixed(1)}({client.reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (Budget & Apply) */}
        <div className='flex flex-col gap-2'>
          <div className='text-right'>
            <p className='text-[14px] text-[#525866]'><Translate id="project.budget" /></p>
            <p className='text-[18px] font-medium text-text-strong-950 py-1'>
              ${budget.toLocaleString()}
            </p>
          </div>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            disabled={hasApplied}
            className={cn(
              'text-[0.875rem] w-full md:w-auto !shadow-[0_1px_2px_0_rgba(82,88,102,0.06)] leading-none font-medium p-3 gap-1',
              hasApplied && 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100'
            )}
            onClick={handleApplyClick}
          >
            {hasApplied ? (
              <>
                <Translate id="project.apply" />
                <RiArrowRightSLine className='w-[1.25rem] h-[1.25rem]' />
              </>
            ) : (
              <>
                <Translate id="project.apply" />
                <RiArrowRightSLine className='w-[1.25rem] h-[1.25rem]' />
              </>
            )}
          </Button.Root>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
