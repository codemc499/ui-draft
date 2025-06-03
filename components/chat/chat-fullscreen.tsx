import React from 'react';
import ChatCore from './chat-core';
import { Chat, Message, User } from '@/utils/supabase/types';

interface ChatFullscreenProps {
  chat: Chat;
  initialMessages: Message[];
  currentUserProfile: User | null;
  otherUserProfile: User | null;
  currentUserId: string;
}

export default function ChatFullscreen({
  chat,
  initialMessages,
  currentUserProfile,
  otherUserProfile,
  currentUserId,
}: ChatFullscreenProps) {
  return (
    <ChatCore
      chat={chat}
      initialMessages={initialMessages}
      currentUserProfile={currentUserProfile}
      otherUserProfile={otherUserProfile}
      currentUserId={currentUserId}
      isPopup={false}
    />
  );
} 