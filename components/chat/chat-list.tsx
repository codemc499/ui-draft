'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Chat, User, Message } from '@/utils/supabase/types';
import clsx from 'clsx';
import * as Avatar from '@/components/ui/avatar';
import { RiFileListLine } from '@remixicon/react';

export type ChatWithLatestMessage = Chat & { latest_message: Message };

interface ChatListProps {
  chats: ChatWithLatestMessage[];
  chatProfiles: Record<string, User | null>;
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  currentUserId: string;
}

// Helper function to format relative time
const formatRelativeTime = (t: (key: string, options?: any) => string, dateString?: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffTime < 60 * 1000) {
    return t('chatList.justNow');
  } else if (diffTime < 60 * 60 * 1000) {
    const minutes = Math.floor(diffTime / (60 * 1000));
    return t('chatList.minutesAgo', { count: minutes });
  } else if (diffTime < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diffTime / (60 * 60 * 1000));
    return t('chatList.hoursAgo', { count: hours });
  } else if (diffTime < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diffTime / (24 * 60 * 60 * 1000));
    return t('chatList.daysAgo', { count: days });
  } else if (diffTime < 30 * 24 * 60 * 60 * 1000) {
    const weeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
    return t('chatList.weeksAgo', { count: weeks });
  } else if (diffTime < 365 * 24 * 60 * 60 * 1000) {
    const months = Math.floor(diffTime / (30 * 24 * 60 * 60 * 1000));
    return t('chatList.monthsAgo', { count: months });
  } else {
    const years = Math.floor(diffTime / (365 * 24 * 60 * 60 * 1000));
    return t('chatList.yearsAgo', { count: years });
  }
};

export default function ChatList({
  chats,
  chatProfiles,
  selectedChatId,
  onChatSelect,
  currentUserId,
}: ChatListProps) {
  const { t } = useTranslation('common');

  if (chats.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-text-secondary-600">{t('chatList.noChats')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 gap-2 custom-scrollbar h-[calc(100vh-180px)] overflow-y-auto">
      {chats.map((chat) => {
        const otherUserProfile = chatProfiles[chat.id];
        const displayName = otherUserProfile?.full_name || otherUserProfile?.username || 'Unknown User';
        const displayInitial = displayName[0]?.toUpperCase() || '?';
        const isSelected = selectedChatId === chat.id;
        const lastActivityTime = chat.latest_message?.created_at || chat.created_at;
        const relativeTime = formatRelativeTime(t, lastActivityTime);
        const isContractChat = chat.contract_id !== null;

        return (
          <div key={chat.id} className={`flex gap-3 p-2 items-center ${isSelected ? 'bg-[#F5F7FA]' : 'bg-white'} rounded-lg cursor-pointer hover:bg-[#F5F7FA]`} onClick={() => onChatSelect(chat.id)}>
            <div className="relative">
              {otherUserProfile?.avatar_url && otherUserProfile?.avatar_url != "" ? (
                <Avatar.Root size='40'>
                  <Avatar.Image src={otherUserProfile?.avatar_url} alt={displayName} />
                  <Avatar.Indicator position='bottom'>
                    <Avatar.Status status='online' />

                  </Avatar.Indicator>
                </Avatar.Root>
              ) : (
                <Avatar.Root size='40' color='yellow'>
                  {displayInitial}
                  <Avatar.Indicator position='bottom'>
                    <Avatar.Status status='online' />
                  </Avatar.Indicator>
                </Avatar.Root>
              )}
              {isContractChat && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                  <RiFileListLine className="w-3 h-3 text-[#0E121B]" />
                </div>
              )}
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-[#525866] text-[12px] font-medium'>{displayName}</p>
              <p className='text-[#525866] text-[12px]'>{relativeTime}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
} 