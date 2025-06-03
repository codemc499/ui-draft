import React, { useState } from 'react';
import * as Avatar from '@/components/ui/avatar';
import * as Tag from '@/components/ui/tag';
import { User } from '@/utils/supabase/types';
import Translate from '@/components/Translate';

import {
  RiStarFill,
  RiBriefcaseLine,
  RiMoneyDollarCircleLine,
  RiSparklingLine,
} from '@remixicon/react';
import * as Divider from '@/components/ui/divider';

// --- Worker Card Component ---
interface WorkerCardProps {
  worker?: User;
  onClick?: () => void;
}


const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onClick }) => {
  // Use worker data if available, otherwise use placeholders
  const name = worker?.full_name || 'Music Professional';

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();        // stop the card's onClick if needed
    setIsPlaying(p => !p);
    // audioPlayer.loadTrack(...); // or whatever play action you need
  };

  const [isPlaying, setIsPlaying] = useState(false);

  const avatarUrl = worker?.avatar_url || null;
  const bio = worker?.bio || <Translate id="worker.profile.noBio" />;

  // Get the first character of the name for the fallback avatar
  const nameInitial = name.charAt(0).toUpperCase();

  return (
    <div
      className="
        w-full
        overflow-hidden
        bg-bg-white-0
        px-4 py-3.5
        h-auto
        rounded-xl
        flex flex-col gap-4
        border border-[#E1E4EA]
        group
        /* --- shadow tweaks --- */
        transition-shadow duration-200
        /* base (very light) shadow */
        shadow-[0_2px_4px_0_rgba(14,18,27,0.03)]
        /* stronger shadow on hover, shifted down */
        hover:shadow-[0_8px_16px_-4px_rgba(14,18,27,0.10)]
      "
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-2.5'>
          <div className="relative">
            <Avatar.Root size="48" color="sky">
              {avatarUrl ? (
                <Avatar.Image src={avatarUrl} alt={`${name}'s Avatar`} />
              ) : (
                <div className="flex items-center justify-center size-full">
                  {nameInitial}
                </div>
              )}
            </Avatar.Root>

            {/* ② overlay */}
            <button
              type="button"
              onClick={handlePlay}
              className={`
                h-[26px] w-[26px] m-auto
                absolute inset-0 z-10 flex items-center justify-center rounded-full 
                ${!isPlaying ? 'bg-[#0E121B]' : 'bg-transparent'}
                text-white
                ${isPlaying
                  ? 'bg-transparent opacity-100'               /* pause icon */
                  : 'bg-[#0E121B] opacity-0 group-hover:opacity-100'}  /* play icon */
                transition-opacity duration-200
              `}
            >
              {isPlaying ? (
                /* ◼◼  Pause‑in‑circle  */
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
                  <rect x="9" y="7" width="2.5" height="10" fill="currentColor" />
                  <rect x="12.5" y="7" width="2.5" height="10" fill="currentColor" />
                </svg>
              ) : (
                /* ▶︎  Play triangle */
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex flex-row gap-2 items-center'>
              <div className='text-[14px] font-medium mt-1 text-[#525866]'>
                {name}
              </div>
              <div className='text-text-secondary-600 ml-1 mt-0.5 flex items-center gap-0.5 text-[11px]'>
                <RiStarFill className='size-4 text-yellow-500' />
                <span className='text-[#525866]'>4.9 (125)</span> {/* Placeholder Rating */}
              </div>
            </div>
            <div className='text-text-secondary-600 mb-2 flex items-center gap-1.5 text-[12px]'>
              <span className='inline-flex items-center gap-0.5'>
                <RiMoneyDollarCircleLine className='size-5' /> <Translate id="worker.salary" />
              </span>
              <span className='inline-flex items-center gap-0.5'>
                <RiBriefcaseLine className='size-5' /> <Translate id="worker.work" />
              </span>
              <span className='inline-flex items-center gap-0.5'>
                <RiSparklingLine className='size-5' /> <Translate id="worker.special" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <Divider.Root />

      <p className='text-[#525866] line-clamp-2 text-[14px] min-h-[44px]'>
        {bio}
      </p>
      <div className='flex flex-wrap gap-2'>
        {/* Placeholder Tags */}
        <Tag.Root className='text-[12px] font-medium text-[#525866] hover:text-black hover:bg-[#F6F8FA]'>Mixing</Tag.Root>
        <Tag.Root className='text-[12px] font-medium text-[#525866] hover:text-black hover:bg-[#F6F8FA]'>Singing</Tag.Root>
        <Tag.Root className='text-[12px] font-medium text-[#525866] hover:text-black hover:bg-[#F6F8FA]'>Jazz</Tag.Root>
        <Tag.Root className='text-[12px] font-medium text-[#525866] hover:text-black hover:bg-[#F6F8FA]'>Hip hop</Tag.Root>
      </div>
    </div>
  );
};

export default WorkerCard;
