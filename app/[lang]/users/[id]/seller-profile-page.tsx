'use client';

import React, { useState, useEffect, useCallback } from 'react';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import MusicUploadDialog from '@/components/blocks/music-upload-dialog';
import { ProfilePageSidebar } from '@/components/worker/profile/profile-page-sidebar';
import { ServiceCard } from '@/components/worker/profile/service-card';
import { WorkItem } from '@/components/worker/profile/work-item';
import { ReviewItem } from '@/components/worker/profile/review-item';
import { AboutSection } from '@/components/worker/profile/AboutSection';
import { RiArrowUpCircleLine, RiUploadCloud2Line, RiLoader4Line } from '@remixicon/react';
import { User, Service, MusicItem, Chat, Message } from '@/utils/supabase/types';
import { serviceOperations, chatOperations, userOperations } from '@/utils/supabase/database';
import { useAuth } from '@/utils/supabase/AuthContext';
import { useNotification } from '@/hooks/use-notification';
import ChatPopupWrapper from '@/components/chat/chat-popup-wrapper';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { usePathname } from 'next/navigation';

// --- Restore Mock Data ---
const workerData = {
  id: '1',
  name: 'Cleve Music', // This won't be used directly, user prop takes precedence
  avatar: 'https://via.placeholder.com/100', // This won't be used directly
  rating: 4.9, // Use this for mock display
  reviewCount: 125, // Use this for mock display
  isGoogle: true, // This won't be used directly
  socialLinks: ['twitch', 'twitter', 'google'], // This won't be used directly
  about: {
    description: // This won't be used directly, user.bio takes precedence
      'Next.js & TypeScript Specialist\n5+ Years Experience in Frontend Development\nReal Time Web Applications\nFreelance & Startup Experience\nProblem Solving, High-Performance UIs',
  },
  skills: [], // Keep empty, handled by sidebar
  awards: [], // Keep empty, handled by sidebar
  workItems: [
    {
      title: 'Funky Bounce Logo',
      description: 'Worker Remarks Text',
      duration: '0:22',
      bpm: '112 BPM',
      genres: ['Mixing', 'Singing', 'Jazz', 'Hip hop', 'K pop'],
    },
    // Add other mock work items as needed...
    {
      title: 'Another Work Item',
      description: 'More Remarks',
      duration: '1:30',
      bpm: '90 BPM',
      genres: ['Pop', 'Mixing'],
    },
  ],
  reviews: [
    {
      id: 'mock-rev-1',
      reviewer: 'Cleve Music',
      reviewerAvatar: 'https://via.placeholder.com/40',
      rating: 4.9,
      date: 'Jan 8, 2023',
      contractTitle: 'Contract title text here..ntr',
      content:
        'idence.123confidence.123confidence.123cidence.123confidence.123confidence.',
      price: 1000,
    },
    // Add other mock reviews...
    {
      id: 'mock-rev-2',
      reviewer: 'Another Client',
      reviewerAvatar: 'https://via.placeholder.com/40?img=2',
      rating: 5.0,
      date: 'Feb 15, 2023',
      contractTitle: 'Second contract title',
      content:
        'Excellent work, delivered on time!',
      price: 500,
    },
  ],
};
// --- End Restore Mock Data ---

interface SellerProfilePageProps {
  user: User;
}

export default function SellerProfilePage({ user: targetSeller }: SellerProfilePageProps) {
  const { user: currentUser } = useAuth();
  const { t } = useTranslation('common');
  const [, lang] = usePathname().split('/');
  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [errorServices, setErrorServices] = useState<string | null>(null);
  const [sellerProfile, setSellerProfile] = useState<User | null>(targetSeller);
  const [isLoadingSellerProfile, setIsLoadingSellerProfile] = useState(false);
  const [errorSellerProfile, setErrorSellerProfile] = useState<string | null>(null);

  // --- Chat State & Handlers (Copied from page.tsx) ---
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<Message[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const { notification: toast } = useNotification();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      if (currentUser?.id) {
        const profile = await userOperations.getUserById(currentUser.id);
        setCurrentUserProfile(profile);
      }
    };
    fetchCurrentUserProfile();
  }, [currentUser]);

  // --- Refetch Seller Profile ---
  const refetchSellerProfile = async () => {
    if (!targetSeller?.id) return;

    setIsLoadingSellerProfile(true);
    setErrorSellerProfile(null);
    try {
      const profile = await userOperations.getUserById(targetSeller.id);
      setSellerProfile(profile);
    } catch (error) {
      console.error('Error refetching seller profile:', error);
      setErrorSellerProfile('Failed to reload profile data.');
    } finally {
      setIsLoadingSellerProfile(false);
    }
  };
  // --- End Refetch Seller Profile ---

  const handleOpenChat = async () => {
    if (!currentUser || !sellerProfile) {
      setChatError('Could not load user profiles. Please try again later.');
      console.error('Cannot open chat: Missing current user or viewed user profile.');
      return;
    }
    if (currentUser.id === sellerProfile.id) {
      setChatError("You cannot start a chat with yourself.");
      return;
    }

    setIsLoadingChat(true);
    setChatError(null);
    setActiveChat(null);
    setActiveChatMessages([]);

    try {
      const chat = await chatOperations.findOrCreateChat(currentUser.id, sellerProfile.id);
      if (chat) {
        setActiveChat(chat);
        setIsLoadingMessages(true);
        const messages = await chatOperations.getChatMessages(chat.id);
        setActiveChatMessages(messages);
      } else {
        setChatError('Failed to find or create chat conversation.');
      }
    } catch (error: any) {
      console.error('Error opening chat:', error);
      setChatError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoadingChat(false);
      setIsLoadingMessages(false);
    }
  };

  const handleCloseChat = () => {
    setActiveChat(null);
    setActiveChatMessages([]);
    setChatError(null);
  };
  // --- End Chat State & Handlers ---

  // --- Hire Handler ---
  const handleHire = () => {
    console.log('Hire clicked');
    toast({
      title: "Hire Clicked (Placeholder)",
      description: `Proceed to hire ${sellerProfile?.full_name || sellerProfile?.username || 'this seller'}.`,
    });
  };
  // --- End Hire Handler ---

  useEffect(() => {
    async function fetchServices() {
      if (!targetSeller?.id) {
        setIsLoadingServices(false);
        setErrorServices('Seller ID is missing.');
        return;
      }

      setIsLoadingServices(true);
      setErrorServices(null);
      try {
        const fetchedServices = await serviceOperations.getServicesBySellerId(targetSeller.id);
        console.log('Fetched services:', fetchedServices);
        setServices(fetchedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        setErrorServices('Failed to load services.');
      } finally {
        setIsLoadingServices(false);
      }
    }

    fetchServices();
  }, [targetSeller?.id]);

  const renderTabContent = () => {
    if (isLoadingSellerProfile) {
      return <div className="p-4 text-center"><RiLoader4Line className="animate-spin inline-block size-6 mr-2" /> {t('users.profile.seller.page.loading.profile')}</div>;
    }
    if (errorSellerProfile || !sellerProfile) {
      return <div className="p-4 text-red-600 text-center">{errorSellerProfile || t('users.profile.seller.page.error.loadFailed')}</div>;
    }

    switch (activeTab) {
      case 'about':
        return (
          <>
            <AboutSection
              userProfile={sellerProfile}
              onSaved={refetchSellerProfile}
            />

            {/* 1) Work - Use workerData */}
            <div className="mt-8 flex items-center justify-between mb-4">
              <h3 className="text-[24px] font-medium leading-8 tracking-normal text-text-strong-950 pb-1 border-b-2 border-text-strong-950">
                {t('users.profile.seller.page.work.title')}
              </h3>
              {currentUser?.id === sellerProfile.id && (
                <button
                  className="
                  flex items-center justify-center gap-[2px]
                  w-[90px] h-[32px]
                  rounded-lg
                  shadow-[0_1px_2px_rgba(27,28,29,0.48),0_0_0_1px_#242628]
                "
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%), #20232D'
                  }}
                  onClick={handleUploadModalOpen}
                >
                  <RiArrowUpCircleLine className="size-5 text-white" />
                  <span className="text-[14px] font-medium leading-5 text-white">
                    {t('users.profile.seller.page.work.upload')}
                  </span>
                </button>
              )}
            </div>
            <div className="divide-y divide-stroke-soft-200">
              {sellerProfile.music_data && sellerProfile.music_data.length > 0 ? (
                sellerProfile.music_data.map((item: MusicItem, i) => (
                  <WorkItem
                    key={i}
                    url={item.url}
                    title={item.title}
                    remarks={item.remarks ?? ''}
                    sellerName={sellerProfile.full_name ?? sellerProfile.username ?? 'Seller'}
                    sellerAvatarUrl={sellerProfile.avatar_url ?? null}
                    duration={`0:${(i % 60).toString().padStart(2, '0')}`}
                    bpm={`${90 + (i * 5) % 60} BPM`}
                    genres={['Pop', 'Electronic', 'Vocal'].slice(i % 2, (i % 2) + 2)}
                  />
                ))
              ) : (
                <p className="py-4 text-text-secondary-400">{t('users.profile.seller.page.work.noWork')}</p>
              )}
            </div>

            {/* 2) Services - Use fetched services */}
            <h3 className="inline-block text-[24px] font-medium leading-8 tracking-normal text-text-strong-950 mt-8 pb-1 border-b-2 border-text-strong-950">{t('users.profile.seller.page.services.title')}</h3>
            <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {isLoadingServices ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="border border-stroke-soft-200 rounded-lg p-4 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : errorServices ? (
                <p className="py-4 text-red-600 col-span-full">{errorServices}</p>
              ) : services.length > 0 ? (
                services.slice(0, 3).map((svc) => (
                  <ServiceCard
                    key={svc.id}
                    service={svc}
                    rating={workerData.rating}
                    reviewCount={workerData.reviewCount}
                  />
                ))
              ) : (
                <p className="py-4 text-text-secondary-400 col-span-full">{t('users.profile.seller.page.services.noServices')}</p>
              )}
            </div>

            {/* 3) Reviews - Use workerData */}
            <h3 className="inline-block text-[24px] font-medium leading-8 tracking-normal text-text-strong-950 mt-8 pb-1 border-b-2 border-text-strong-950">{t('users.profile.seller.page.reviews.title')}</h3>
            <div>
              {workerData.reviews.length > 0 ? (
                workerData.reviews.map((r) => (
                  <ReviewItem key={r.id} review={r} />
                ))
              ) : (
                <p className="py-4 text-text-secondary-400">{t('users.profile.seller.page.reviews.noReviews')}</p>
              )}
            </div>
          </>
        );
      case 'work':
        return (
          <div className='divide-y divide-stroke-soft-200'>
            {sellerProfile.music_data && sellerProfile.music_data.length > 0 ? (
              sellerProfile.music_data.map((item: MusicItem, index) => (
                <WorkItem
                  key={index}
                  url={item.url}
                  title={item.title}
                  remarks={item.remarks ?? ''}
                  sellerName={sellerProfile.full_name ?? sellerProfile.username ?? 'Seller'}
                  sellerAvatarUrl={sellerProfile.avatar_url ?? null}
                  duration={`0:${(index % 60).toString().padStart(2, '0')}`}
                  bpm={`${90 + (index * 5) % 60} BPM`}
                  genres={['Pop', 'Electronic', 'Vocal'].slice(index % 2, (index % 2) + 2)}
                />
              ))
            ) : (
              <p className="py-4 text-text-secondary-400">{t('users.profile.seller.page.work.noWork')}</p>
            )}
          </div>
        );
      case 'services':
        return (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {isLoadingServices ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border border-stroke-soft-200 rounded-lg p-4 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : errorServices ? (
              <p className="py-4 text-red-600 col-span-full">{errorServices}</p>
            ) : services.length > 0 ? (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  rating={workerData.rating}
                  reviewCount={workerData.reviewCount}
                />
              ))
            ) : (
              <p className="py-4 text-text-secondary-400 col-span-full">{t('users.profile.seller.page.services.noServices')}</p>
            )}
          </div>
        );
      case 'reviews':
        return (
          <div>
            {workerData.reviews.length > 0 ? (
              workerData.reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))
            ) : (
              <p className="py-4 text-text-secondary-400">{t('users.profile.seller.page.reviews.noReviews')}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleUploadModalOpen = useCallback(() => {
    setIsUploadModalOpen(true);
  }, []);

  const handleUploadModalClose = useCallback(() => {
    setIsUploadModalOpen(false);
  }, []);

  const handleUploadComplete = () => {
    console.log('Upload complete, refetching seller profile...');
    refetchSellerProfile();
  };

  return (
    <div className='px-8 py-8'>
      <div className='flex gap-[24px]'>
        <div className='w-[352px] shrink-0'>
          <div className='sticky'>
            {sellerProfile && (
              <ProfilePageSidebar
                userProfile={sellerProfile}
                currentUser={currentUserProfile}
                isLoadingChat={isLoadingChat}
                onHire={handleHire}
                onMessage={handleOpenChat}
              />
            )}
          </div>
        </div>

        <div className='flex-1 overflow-hidden max-w-[1000px] flex flex-col gap-6 px-[16px]'>
          <div>
            <TabMenuHorizontal.Root
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabMenuHorizontal.List className="border-y-0">
                <TabMenuHorizontal.Trigger value='about' className="text-[24px] font-medium leading-8 tracking-normal text-center text-[#525866] hover:text-[#0E121B]">
                  {t('users.profile.seller.page.tabs.about')}
                </TabMenuHorizontal.Trigger>
                <TabMenuHorizontal.Trigger value='work' className="text-[24px] font-medium leading-8 tracking-normal text-center text-[#525866] hover:text-[#0E121B]">
                  {t('users.profile.seller.page.tabs.work')}
                </TabMenuHorizontal.Trigger>
                <TabMenuHorizontal.Trigger value='services' className="text-[24px] font-medium leading-8 tracking-normal text-center text-[#525866] hover:text-[#0E121B]">
                  {t('users.profile.seller.page.tabs.services')}
                </TabMenuHorizontal.Trigger>
                <TabMenuHorizontal.Trigger value='reviews' className="text-[24px] font-medium leading-8 tracking-normal text-center text-[#525866] hover:text-[#0E121B]">
                  {t('users.profile.seller.page.tabs.reviews')}
                </TabMenuHorizontal.Trigger>
              </TabMenuHorizontal.List>
            </TabMenuHorizontal.Root>
          </div>

          <div>{renderTabContent()}</div>
        </div>
      </div>

      <MusicUploadDialog
        open={isUploadModalOpen}
        onOpenChange={handleUploadModalClose}
        userId={targetSeller.id}
        onUploadComplete={handleUploadComplete}
      />

      {activeChat && currentUserProfile && sellerProfile && currentUser && (
        <ChatPopupWrapper
          key={activeChat.id}
          chat={activeChat}
          initialMessages={activeChatMessages}
          currentUserProfile={currentUserProfile}
          otherUserProfile={sellerProfile}
          currentUserId={currentUser.id}
          isLoadingMessages={isLoadingMessages}
          onClose={handleCloseChat}
          position="bottom-right"
        />
      )}
    </div>
  );
} 