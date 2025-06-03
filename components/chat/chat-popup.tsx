import React from 'react';
import ChatCore from './chat-core';
import { Chat, Message, User } from '@/utils/supabase/types';

interface ChatPopupProps {
  chat: Chat;
  initialMessages: Message[];
  currentUserProfile: User | null;
  otherUserProfile: User | null;
  currentUserId: string;
  onClose: () => void;
  position?: 'bottom-right' | 'bottom-left';
}

export default function ChatPopup({
  chat,
  initialMessages,
  currentUserProfile,
  otherUserProfile,
  currentUserId,
  onClose,
  position = 'bottom-right',
}: ChatPopupProps) {
  const positionClass = position === 'bottom-right'
    ? 'bottom-4 right-4'
    : 'bottom-4 left-4';

  return (
    <div className={`fixed z-50`}>
      <ChatCore
        chat={chat}
        initialMessages={initialMessages}
        currentUserProfile={currentUserProfile}
        otherUserProfile={otherUserProfile}
        currentUserId={currentUserId}
        isPopup={true}
        onClose={onClose}
      />
    </div>
  );
} 