import React, { useState } from 'react';
import { Chat, Message, User } from '@/utils/supabase/types';
import ChatInterface from './chat-interface';
import ChatLoadingSkeleton from './chat-loading-skeleton';

interface ChatPopupWrapperProps {
  chat: Chat;
  initialMessages: Message[];
  currentUserProfile: User | null;
  otherUserProfile: User | null;
  currentUserId: string;
  buttonLabel?: string;
  position?: 'bottom-right' | 'bottom-left';
  isLoadingMessages?: boolean;
  onClose?: () => void;
}

export default function ChatPopupWrapper({
  chat,
  initialMessages,
  currentUserProfile,
  otherUserProfile,
  currentUserId,
  position = 'bottom-right',
  isLoadingMessages = false,
  onClose,
}: ChatPopupWrapperProps) {
  return (
    <>
      {isLoadingMessages ? (
        <div className={`fixed ${position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4'} z-50`}>
          {/* <ChatLoadingSkeleton isPopup={true} /> */}
        </div>
      ) : (
        <ChatInterface
          chat={chat}
          initialMessages={initialMessages}
          currentUserProfile={currentUserProfile}
          otherUserProfile={otherUserProfile}
          currentUserId={currentUserId}
          mode="popup"
          position={position}
          onClose={onClose}
        />
      )}
    </>
  );
} 