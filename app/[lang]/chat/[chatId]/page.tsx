'use client'; // Make this page a Client Component

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, notFound, usePathname } from 'next/navigation'; // Use useParams hook
import { useAuth } from '@/utils/supabase/AuthContext';
import { chatOperations, userOperations } from '@/utils/supabase/database';
import { Chat, Message, User } from '@/utils/supabase/types';
import ChatInterface from '@/components/chat/chat-interface';
import ChatLoadingSkeleton from '@/components/chat/chat-loading-skeleton';
import i18n from '@/i18n'
// No longer needs PageProps interface, gets params via hook

export default function ChatClientPage() {
  const params = useParams();
  const chatId = params.chatId as string;

  // grab the [lang] segment and tell i18n to switch
  const [, lang] = usePathname().split('/');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  const { user: currentUser, loading: authLoading } = useAuth();

  // State for fetched data
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(
    null,
  );
  const [otherUserProfile, setOtherUserProfile] = useState<User | null>(null);

  // Status State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if auth is loading or chatId is missing
    if (authLoading || !chatId) {
      setIsLoading(true);
      return;
    }

    if (!currentUser) {
      setError('Authentication required to view chat.');
      setIsLoading(false);
      // Optionally redirect here or show login prompt
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const currentUserId = currentUser.id;

        // Fetch chat details
        const fetchedChat = await chatOperations.getChatById(chatId);
        if (!fetchedChat) {
          throw new Error('Chat not found.');
        }

        // Authorization check
        if (
          fetchedChat.buyer_id !== currentUserId &&
          fetchedChat.seller_id !== currentUserId
        ) {
          throw new Error('Not authorized to view this chat.');
        }
        setChat(fetchedChat);

        // Fetch initial messages
        const initialMessages = await chatOperations.getChatMessages(chatId);
        setMessages(initialMessages);

        // Fetch participant profiles
        const otherUserId =
          fetchedChat.buyer_id === currentUserId
            ? fetchedChat.seller_id
            : fetchedChat.buyer_id;
        const [fetchedCurrentUserProfile, fetchedOtherUserProfile] =
          await Promise.all([
            userOperations.getUserById(currentUserId),
            userOperations.getUserById(otherUserId),
          ]);

        if (!fetchedCurrentUserProfile || !fetchedOtherUserProfile) {
          console.warn('Could not load one or both user profiles for chat.');
        }
        setCurrentUserProfile(fetchedCurrentUserProfile);
        setOtherUserProfile(fetchedOtherUserProfile);
      } catch (err: any) {
        console.error('Error fetching chat page data:', err);
        setError(err.message || 'Failed to load chat.');
        // If chat not found or unauthorized, potentially call notFound() from next/navigation
        // if (err.message.includes('Chat not found') || err.message.includes('Not authorized')) {
        //   notFound();
        // }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [chatId, currentUser, authLoading]); // Dependencies

  // Render based on state
  if (isLoading) {
    return <ChatLoadingSkeleton />;
  }

  if (error) {
    // Consider using notFound() hook here for specific errors if desired
    if (error.includes('Chat not found') || error.includes('Not authorized')) {
      notFound(); // Trigger 404 page
    }
    return <div className='p-4 text-red-500'>Error: {error}</div>;
  }

  if (!chat || !currentUser || !currentUserProfile) {
    // Should be covered by loading/error, but added as safeguard
    return <div className='p-4'>Chat data unavailable.</div>;
  }

  return (
    // No need for Suspense here as loading is handled internally by this component
    <ChatInterface
      chat={chat}
      initialMessages={messages}
      currentUserProfile={currentUserProfile} // Pass fetched data
      otherUserProfile={otherUserProfile} // Pass fetched data (can be null)
      currentUserId={currentUser.id} // Pass current user ID
    />
  );
}

// Removed metadata function as data is fetched client-side now
