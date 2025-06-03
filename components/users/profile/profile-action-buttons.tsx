'use client';

import React, { useState } from 'react';
import * as Button from '@/components/ui/button';
import * as FancyButton from '@/components/ui/fancy-button';
import { RiHeart3Line, RiLoader4Line, RiArrowRightSLine, RiHeart3Fill } from '@remixicon/react';
import { User } from '@/utils/supabase/types';
import { useTranslation } from 'react-i18next';
import { notification as toast } from '@/hooks/use-notification';

interface ProfileActionButtonsProps {
  targetUser: User; // The user whose profile is being viewed
  currentUser: User | null; // The logged-in user
  isLoadingChat: boolean;
  onHire: () => void; // Placeholder for hire action
  onMessage: () => void; // Action to open chat
}

export function ProfileActionButtons({
  targetUser,
  currentUser,
  isLoadingChat,
  onHire,
  onMessage,
}: ProfileActionButtonsProps) {
  const { t } = useTranslation('common');
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnProfile = currentUser?.id === targetUser.id;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      toast({ description: t('users.profile.followed', { name: targetUser.full_name || targetUser.username }) });
    } else {
      toast({ description: t('users.profile.unfollowed', { name: targetUser.full_name || targetUser.username }) });
    }
  };

  return (
    <div className="flex items-center justify-center gap-[20px]">
      {/* Hire Button (Previously Follow) */}
      {!(!currentUser || isLoadingChat || isOwnProfile) && <Button.Root
        variant="neutral"
        mode="stroke"
        size="xsmall"
        className="w-[85px] h-[32px] rounded-[8px] border !border-[#E1E4EA] hover:bg-[#F6F8FA] hover:text-[#0E121B] hover:border-none bg-bg-white-0 flex items-center justify-center gap-[8px] px-2 text-[#525866]"
        onClick={handleFollow}
        disabled={!currentUser || isOwnProfile}
        aria-label={isOwnProfile ? t('users.profile.actions.cannotHireSelf') : t('users.profile.actions.hire')}
      >
        <span className="text-paragraph-[14px]">{t('users.profile.actions.follow')}</span>
        <Button.Icon as={isFollowing ? RiHeart3Fill : RiHeart3Line} className={`size-5 ${isFollowing ? 'text-red-500' : 'text-[#525866]'}`} />
      </Button.Root>}

      {/* Touch Button */}
      {(!(!currentUser || isLoadingChat || isOwnProfile) && currentUser?.user_type !== targetUser.user_type) && <FancyButton.Root
        variant="neutral"
        size="xsmall"
        className="w-[83px] h-[30px] rounded-[8px]"
        onClick={onMessage}
        disabled={!currentUser || isLoadingChat || isOwnProfile}
        aria-label={isOwnProfile ? t('users.profile.actions.cannotMessageSelf') : t('users.profile.actions.message')}
      >
        {isLoadingChat ? (
          <RiLoader4Line className="animate-spin text-white" size={18} />
        ) : (
          <>
            <span className="text-paragraph-[14px] text-[#FFFFFF]">{t('users.profile.actions.touch')}</span>
            <FancyButton.Icon as="span">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5 text-static-white">
                <path d="M6.16689 5.26667L13.2419 2.90834C16.4169 1.85001 18.1419 3.58334 17.0919 6.75834L14.7336 13.8333C13.1502 18.5917 10.5502 18.5917 8.96689 13.8333L8.26689 11.7333L6.16689 11.0333C1.40856 9.45001 1.40856 6.85834 6.16689 5.26667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.4248 11.375L11.4081 8.38336" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </FancyButton.Icon>
          </>
        )}
      </FancyButton.Root>}
    </div>
  );
} 