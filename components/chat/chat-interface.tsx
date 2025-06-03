import React from 'react';
import ChatFullscreen from './chat-fullscreen';
import ChatPopup from './chat-popup';
import { Chat, Message, User } from '@/utils/supabase/types';

interface ChatInterfaceProps {
  chat: Chat;
  initialMessages: Message[];
  currentUserProfile: User | null;
  otherUserProfile: User | null;
  currentUserId: string;
  mode?: 'fullscreen' | 'popup';
  onClose?: () => void;
  position?: 'bottom-right' | 'bottom-left';
}

export default function ChatInterface({
  chat,
  initialMessages,
  currentUserProfile,
  otherUserProfile,
  currentUserId,
  mode = 'fullscreen',
  onClose,
  position,
}: ChatInterfaceProps) {
  if (mode === 'popup') {
    return (
      <ChatPopup
        chat={chat}
        initialMessages={initialMessages}
        currentUserProfile={currentUserProfile}
        otherUserProfile={otherUserProfile}
        currentUserId={currentUserId}
        onClose={onClose || (() => { })}
        position={position}
      />
    );
  }

  return (
    <ChatFullscreen
      chat={chat}
      initialMessages={initialMessages}
      currentUserProfile={currentUserProfile}
      otherUserProfile={otherUserProfile}
      currentUserId={currentUserId}
    />
  );
}
