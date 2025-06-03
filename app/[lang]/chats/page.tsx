'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useAuth } from '@/utils/supabase/AuthContext';
import { chatOperations, userOperations } from '@/utils/supabase/database';
import { Chat, User, Message } from '@/utils/supabase/types';
// Removed ChatPopupWrapper import as it's no longer used here
import ChatList from '@/components/chat/chat-list';
import ChatFullscreen from '@/components/chat/chat-fullscreen'; // Import the fullscreen component
import ChatDetailsPanel from '@/components/chat/chat-details-panel'; // Import the new details panel

export type ChatWithLatestMessage = Chat & { latest_message: Message };

// Placeholder components (replace with actual implementations later)
const FullScreenChatWindow = ({ chat, messages, currentUserProfile, otherUserProfile, currentUserId, isLoadingMessages }: any) => (
  <div className="flex h-full flex-col border-x border-stroke-soft-200 bg-bg-white-0">
    {chat ? (
      <>
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-stroke-soft-200 p-4">
          <img src={otherUserProfile?.avatar_url || 'https://via.placeholder.com/40'} alt={otherUserProfile?.full_name || 'User'} className="size-10 rounded-full" />
          <div>
            <h2 className="font-medium">{otherUserProfile?.full_name || 'User'}</h2>
            {/* Add online/offline status later */}
          </div>
        </div>
        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4">{/* Messages will go here */}</div>
        {/* Input Area */}
        <div className="border-t border-stroke-soft-200 p-4">{/* Input field will go here */}</div>
      </>
    ) : (
      <div className="flex h-full items-center justify-center text-text-secondary-600">
        Select a chat to start messaging.
      </div>
    )}
  </div>
);

export default function ChatsPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const { t } = useTranslation('common');
  const pathname = usePathname();
  const [, lang] = pathname.split('/');

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);



  // const router = useRouter(); // Removed
  const [chats, setChats] = useState<ChatWithLatestMessage[]>([]);
  const [chatProfiles, setChatProfiles] = useState<Record<string, User | null>>({});
  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState<Message[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // // Effect for redirection based on auth state - REMOVED
  // useEffect(() => {
  //   if (!authLoading && !currentUser) {
  //     router.push('/');
  //   }
  // }, [currentUser, authLoading, router]);

  // Effect to fetch initial chat data *only* if logged in
  useEffect(() => {
    // Only proceed if authentication is not loading and user is logged in
    // Middleware handles the redirect, so we only need to check if currentUser exists before fetching
    if (authLoading || !currentUser) {
      setIsLoadingData(false);
      return;
    }

    const fetchInitialData = async () => {
      setIsLoadingData(true);
      setError(null);
      try {
        const currentUserId = currentUser.id;
        const [userProfile, userChats] = await Promise.all([
          userOperations.getUserById(currentUserId),
          chatOperations.getUserChats(currentUserId),
        ]);

        setCurrentUserProfile(userProfile);
        setChats(userChats);

        const profilePromises = userChats.map(chat => {
          const otherUserId = chat.buyer_id === currentUserId
            ? chat.seller_id
            : chat.buyer_id;
          return userOperations.getUserById(otherUserId).then(profile => ({ chatId: chat.id, profile }));
        });

        const profilesResults = await Promise.all(profilePromises);
        const profiles: Record<string, User | null> = profilesResults.reduce((acc, { chatId, profile }) => {
          acc[chatId] = profile;
          return acc;
        }, {} as Record<string, User | null>);

        setChatProfiles(profiles);

      } catch (err: any) {
        console.error('Error fetching initial chat data:', err);
        setError(err.message || 'Failed to load initial chat data');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchInitialData();
    // Ensure dependency array only relies on necessary variables for fetching
  }, [currentUser, authLoading]);

  // Effect to fetch messages when a chat is selected
  useEffect(() => {
    // Only fetch if logged in and a chat is selected
    if (!selectedChatId || !currentUser || authLoading) {
      setSelectedChatMessages([]);
      setIsLoadingMessages(false);
      return;
    }

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const messages = await chatOperations.getChatMessages(selectedChatId);
        setSelectedChatMessages(messages);
      } catch (err: any) {
        console.error(`Error fetching messages for chat ${selectedChatId}:`, err);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedChatId, currentUser, authLoading]); // Dependency array remains the same

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(prevId => (prevId === chatId ? null : chatId));
  };

  // --- Add function to close the chat popup ---
  const handleCloseChat = () => {
    setSelectedChatId(null);
  };
  // --- End added function ---

  const getSelectedChat = () => {
    if (!selectedChatId) return null;
    return chats.find(c => c.id === selectedChatId);
  };

  const selectedChat = getSelectedChat();
  const otherUserProfile = selectedChat ? chatProfiles[selectedChat.id] : null;

  // Loading State: Show loading if auth is loading OR initial data is loading
  // If middleware redirects, this component might unmount before rendering, but this is still good practice.
  // if (authLoading || isLoadingData) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       {/* Add a more sophisticated loading skeleton later */}
  //       <p>Loading chats...</p>
  //     </div>
  //   );
  // }

  // Middleware should prevent rendering if !currentUser, but this is a safeguard
  if (!currentUser) {
    // This case should ideally not be reached if middleware is working correctly
    return null;
  }

  // Error State
  if (error) {
    return <div className="p-4 text-center text-red-500">{t('chat.error')}: {error}</div>;
  }

  // Main 3-Column Layout
  return (
    <div className="flex h-[calc(100vh-70px)] w-full overflow-hidden bg-bg-subtle-50 px-[32px] pt-1">
      {/* Left Column: Chat List */}
      <div className="w-full max-w-xs shrink-0 lg:w-[200px] border-r border-t border-[#E2E4E9] h-full flex flex-col">
        <h1 className="sticky top-0 z-10 bg-bg-white-0 px-6 py-4 text-[24px] text-[#0E121B] font-medium">{t('chat.title')}</h1>
        {chats.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-[#525866] text-[14px] font-medium mb-36">{t('chat.noChats')}</p>
          </div>
        ) : (
          <div className="flex-1">
            <ChatList
              chats={chats}
              chatProfiles={chatProfiles}
              selectedChatId={selectedChatId}
              onChatSelect={handleChatSelect}
              currentUserId={currentUser.id}
            />
          </div>
        )}
      </div>

      {/* Middle Column: Chat Window */}
      <div className="relative flex flex-1 flex-col h-full"> {/* Added relative positioning for overlay */}
        {selectedChat && currentUserProfile && otherUserProfile ? (
          <ChatFullscreen
            chat={selectedChat}
            initialMessages={selectedChatMessages} // Pass fetched messages
            currentUserProfile={currentUserProfile}
            otherUserProfile={otherUserProfile}
            currentUserId={currentUser.id}
          // isLoadingMessages is handled internally by ChatCore/ChatFullscreen likely, but could pass if needed
          />
        ) : (
          // Placeholder when no chat is selected
          <div className="flex h-full items-center justify-center border-x border-stroke-soft-200 bg-bg-white-0 text-[#525866] text-[14px]">
            {t('chat.selectChat')}
          </div>
        )}
        {/* Potential loading state overlay for messages within the middle panel */}
        {isLoadingMessages && selectedChatId && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70">
            {/* Add a spinner or loading indicator here */}
            <p>{t('chat.loadingMessages')}</p>
          </div>
        )}
      </div>

      {/* Right Column: Details Panel */}
      <div className="hidden w-full max-w-[20rem] shrink-0 lg:block">
        <ChatDetailsPanel
          chat={selectedChat || null}
          otherUserProfile={otherUserProfile}
          currentUserProfile={currentUserProfile}
        />
      </div>
    </div>
  );
} 