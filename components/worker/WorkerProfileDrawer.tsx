'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as Avatar from '@/components/ui/avatar';
import * as Drawer from '@/components/ui/drawer';
import * as Tabs from '@/components/ui/tabs';
import { useAuth } from '@/utils/supabase/AuthContext';
import { chatOperations, userOperations } from '@/utils/supabase/database';
import { useNotification } from '@/hooks/use-notification';
import ChatPopupWrapper from '@/components/chat/chat-popup-wrapper';
import * as FancyButton from '@/components/ui/fancy-button';
import {
  RiCloseLine,
  RiStarFill,
  RiGoogleFill,
  RiArrowDropRightLine,
  RiHeart3Line,
  RiArrowRightCircleLine,
  RiLoader4Line,
  RiHeart3Fill,
} from '@remixicon/react';
import * as DialogPrimitive from "@radix-ui/react-dialog";

import BlockFileUploadDialog from '@/components/blocks/block-file-upload-dialog';
import { WorkItem } from '@/components/worker/profile/work-item';
import { ServiceCard } from '@/components/worker/profile/service-card';
import { ReviewItem } from '@/components/worker/profile/review-item';
import { User, Service, Chat, Message, MusicItem } from '@/utils/supabase/types';
import MusicUploadDialog from '@/components/blocks/music-upload-dialog';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useRouter } from 'next/navigation';

interface WorkerProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  worker: User | null;
  services: Service[] | null;
  isLoading: boolean;
}

const WorkerProfileDrawer: React.FC<WorkerProfileDrawerProps> = ({
  isOpen,
  onClose,
  worker,
  services,
  isLoading,
}) => {
  const { t } = useTranslation('common');
  const authContext = useAuth();
  const { notification: toast } = useNotification();
  const [activeTab, setActiveTab] = useState<'about' | 'work' | 'services' | 'reviews'>('about');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const router = useRouter();

  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<Message[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const placeholderWorkerData = {
    name: 'Cleve Music',
    avatar: 'https://via.placeholder.com/64',
    rating: 4.9,
    reviewCount: 125,
    specialty: t('worker.profile.placeholders.specialty'),
    about: t('worker.profile.placeholders.aboutEllipsis'),
    reviews: [
      {
        id: '1',
        reviewer: 'Cleve Music',
        reviewerAvatar: 'https://via.placeholder.com/32',
        rating: 4.9,
        date: 'Jan 8 2023',
        contractTitle: t('worker.profile.placeholders.review1.contractTitle'),
        content:
          t('worker.profile.placeholders.review1.content'),
        price: 1000,
      },
      {
        id: '2',
        reviewer: t('worker.profile.placeholders.reviewerName'),
        reviewerAvatar: 'https://via.placeholder.com/32',
        rating: 4.5,
        date: 'Feb 15 2023',
        contractTitle: t('worker.profile.placeholders.review2.contractTitle'),
        content: t('worker.profile.placeholders.review2.content'),
        price: 500,
      },
    ],
  };

  const dummyMusicData = [
    {
      url: 'https://example.com/audio1.mp3',
      title: t('worker.profile.dummyMusic.dreamscape.title'),
      remarks: t('worker.profile.dummyMusic.dreamscape.remarks'),
    },
    {
      url: 'https://example.com/audio2.mp3',
      title: t('worker.profile.dummyMusic.pulseRush.title'),
      remarks: t('worker.profile.dummyMusic.pulseRush.remarks'),
    },
    {
      url: 'https://example.com/audio3.mp3',
      title: t('worker.profile.dummyMusic.midnightGroove.title'),
      remarks: t('worker.profile.dummyMusic.midnightGroove.remarks'),
    },
  ];

  const [likeStatus, setLikeStatus] = useState(false);
  const displayName = worker?.full_name || worker?.username || (isLoading ? t('worker.profile.loadingWorker') : t('worker.profile.fallbackName'));
  const displayAvatar = worker?.avatar_url ?? undefined;
  const displayBio = worker?.bio || (isLoading ? t('worker.profile.loadingBio') : t('worker.profile.noBio'));

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      const isOverflowing = el.scrollHeight > el.clientHeight;
      setIsClamped(isOverflowing);
    }
  }, [displayBio]);

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      if (authContext.user?.id) {
        const profile = await userOperations.getUserById(authContext.user.id);
        setCurrentUserProfile(profile);
      }
    };
    fetchCurrentUserProfile();
  }, [authContext.user]);

  const handleHireClick = () => {
    toast({
      description: t('worker.profile.hireInitiatedToast', { name: displayName }),
    });
  };

  const handleOpenChat = async () => {
    if (!currentUserProfile || !worker) {
      setChatError(t('worker.profile.errors.chatUserProfilesError'));
      return;
    }
    if (currentUserProfile.id === worker.id) {
      setChatError(t('worker.profile.actions.cannotMessageSelf'));
      return;
    }

    setIsLoadingChat(true);
    setChatError(null);
    setActiveChat(null);
    setActiveChatMessages([]);

    try {
      const chat = await chatOperations.findOrCreateChat(currentUserProfile.id, worker.id);
      if (chat) {
        setActiveChat(chat);
        setIsLoadingMessages(true);
        const messages = await chatOperations.getChatMessages(chat.id);
        setActiveChatMessages(messages);
        // router.push(`/${i18n.language}/chat?id=${chat.id}`);
      } else {
        setChatError(t('projects.detail.page.chat.createError'));
      }
    } catch (error: any) {
      console.error('Error opening chat:', error);
      setChatError(error.message || t('auth.signup.unexpectedError'));
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

  const handleLikeStatus = () => {
    setLikeStatus(!likeStatus);

    if (!likeStatus) {
      toast({
        description: t('worker.profile.likeInitiatedToast', { name: displayName }),
      });
    } else {
      toast({
        description: t('worker.profile.unlikeInitiatedToast', { name: displayName }),
      });
    }
  };

  useEffect(() => {
    if (!isOpen && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (isOpen && !isLoading && worker) {
      setActiveTab('about');
    }
  }, [isOpen, isLoading, worker]);

  const disableActions = !currentUserProfile || !worker || isLoading || currentUserProfile?.id === worker?.id;

  const handleUploadComplete = (updatedMusicData: MusicItem[]) => {
    console.log('Drawer: Upload complete, new music data:', updatedMusicData);
    // TODO: Potentially refresh worker data or update state here
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Content
        className="fixed inset-y-0 right-0 z-50 h-[100dvh] w-full shadow-xl overflow-x-hidden bg-white flex flex-col"
        style={{ maxWidth: '800px' }}
      >
        <DialogPrimitive.Title className="sr-only">
          {`${t('worker.profile.title')}: ${displayName}`}
        </DialogPrimitive.Title>

        <div className="flex flex-col flex-grow">
          {/* header */}
          <div className="px-[24px] pt-4 flex-shrink-0">
            <div className="flex items-center justify-between h-[40px] px-1">
              <Drawer.Close asChild>
                <button className="rounded-sm hover:bg-[#F5F7FA] rounded-xl p-2">
                  <RiCloseLine className="size-6 text-[#0E121B]" />
                  <span className="sr-only">{t('common.close')}</span>
                </button>
              </Drawer.Close>

              <div className='flex items-center gap-1.5'>
                <Link
                  href={worker ? `/${i18n.language}/users/${worker.id}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 text-[14px] font-medium text-[#335CFF] underline underline-offset-2 hover:text-blue-700 ${!worker || isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                  {t('worker.profile.openInNewTab')}
                </Link>
                <RiArrowRightCircleLine className="size-6 text-[#525866]" />
              </div>
            </div>

            {isLoading ? (
              <div className="mt-5 flex h-[88px] items-center justify-center">
                <RiLoader4Line className="size-8 animate-spin text-text-secondary-600" />
              </div>
            ) : worker ? (
              <div className="mt-5 flex items-center justify-between px-3">
                <div className="flex items-center gap-4">
                  <Link href={`/${i18n.language}/users/${worker.id}`} passHref legacyBehavior>
                    <a className="inline-block">
                      <Avatar.Root size="64">
                        <Avatar.Image src={displayAvatar ? displayAvatar : undefined} alt={displayName} />
                        <Avatar.Indicator position="bottom">
                          <Avatar.Status status="online" />
                        </Avatar.Indicator>
                      </Avatar.Root>
                    </a>
                  </Link>

                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <Link href={`/${i18n.language}/users/${worker.id}`} passHref legacyBehavior>
                        <a className="inline-block hover:underline">
                          <h2 className="text-[18px] font-semibold text-text-strong-950">
                            {displayName}
                          </h2>
                        </a>
                      </Link>
                      <div className="flex items-center gap-0.5 text-[14px] text-gray-600">
                        <RiStarFill className="size-4 text-yellow-400" />
                        <span>{t('worker.profile.ratingText')}</span>
                      </div>
                    </div>
                    <div className="mt-1 ml-[-1px] flex items-center gap-1 text-[12px] text-text-secondary-600">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.1377 7.77283V10.3869H12.8446C12.6818 11.2276 12.1933 11.9395 11.4607 12.4181L13.6961 14.1179C14.9985 12.9397 15.7499 11.2093 15.7499 9.15358C15.7499 8.67495 15.7061 8.21468 15.6247 7.7729L9.1377 7.77283Z" fill="#4285F4" />
                        <path d="M2.98882 5.97491C2.51922 6.88306 2.25 7.90786 2.25 9.00012C2.25 10.0924 2.51922 11.1172 2.98882 12.0253C2.98882 12.0314 5.28061 10.2826 5.28061 10.2826C5.14286 9.87758 5.06144 9.44806 5.06144 9.00005C5.06144 8.55203 5.14286 8.12251 5.28061 7.71751L2.98882 5.97491Z" fill="#FBBC05" />
                        <path d="M9.13812 4.93774C10.1525 4.93774 11.0542 5.28137 11.7743 5.94411L13.7467 4.01117C12.5507 2.91891 10.9979 2.25 9.13812 2.25C6.44564 2.25 4.12261 3.76569 2.98926 5.9748L5.28098 7.71754C5.82571 6.12206 7.34731 4.93774 9.13812 4.93774Z" fill="#EA4335" />
                        <path d="M5.27802 10.2849L4.77385 10.6631L2.98926 12.0253C4.12261 14.2283 6.4455 15.7501 9.13798 15.7501C10.9976 15.7501 12.5568 15.1487 13.6964 14.1179L11.461 12.4181C10.8474 12.8231 10.0647 13.0685 9.13798 13.0685C7.34717 13.0685 5.82564 11.8842 5.28083 10.2887L5.27802 10.2849Z" fill="#34A853" />
                      </svg>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.1377 7.77283V10.3869H12.8446C12.6818 11.2276 12.1933 11.9395 11.4607 12.4181L13.6961 14.1179C14.9985 12.9397 15.7499 11.2093 15.7499 9.15358C15.7499 8.67495 15.7061 8.21468 15.6247 7.7729L9.1377 7.77283Z" fill="#4285F4" />
                        <path d="M2.98882 5.97491C2.51922 6.88306 2.25 7.90786 2.25 9.00012C2.25 10.0924 2.51922 11.1172 2.98882 12.0253C2.98882 12.0314 5.28061 10.2826 5.28061 10.2826C5.14286 9.87758 5.06144 9.44806 5.06144 9.00005C5.06144 8.55203 5.14286 8.12251 5.28061 7.71751L2.98882 5.97491Z" fill="#FBBC05" />
                        <path d="M9.13812 4.93774C10.1525 4.93774 11.0542 5.28137 11.7743 5.94411L13.7467 4.01117C12.5507 2.91891 10.9979 2.25 9.13812 2.25C6.44564 2.25 4.12261 3.76569 2.98926 5.9748L5.28098 7.71754C5.82571 6.12206 7.34731 4.93774 9.13812 4.93774Z" fill="#EA4335" />
                        <path d="M5.27802 10.2849L4.77385 10.6631L2.98926 12.0253C4.12261 14.2283 6.4455 15.7501 9.13798 15.7501C10.9976 15.7501 12.5568 15.1487 13.6964 14.1179L11.461 12.4181C10.8474 12.8231 10.0647 13.0685 9.13798 13.0685C7.34717 13.0685 5.82564 11.8842 5.28083 10.2887L5.27802 10.2849Z" fill="#34A853" />
                      </svg>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.1377 7.77283V10.3869H12.8446C12.6818 11.2276 12.1933 11.9395 11.4607 12.4181L13.6961 14.1179C14.9985 12.9397 15.7499 11.2093 15.7499 9.15358C15.7499 8.67495 15.7061 8.21468 15.6247 7.7729L9.1377 7.77283Z" fill="#4285F4" />
                        <path d="M2.98882 5.97491C2.51922 6.88306 2.25 7.90786 2.25 9.00012C2.25 10.0924 2.51922 11.1172 2.98882 12.0253C2.98882 12.0314 5.28061 10.2826 5.28061 10.2826C5.14286 9.87758 5.06144 9.44806 5.06144 9.00005C5.06144 8.55203 5.14286 8.12251 5.28061 7.71751L2.98882 5.97491Z" fill="#FBBC05" />
                        <path d="M9.13812 4.93774C10.1525 4.93774 11.0542 5.28137 11.7743 5.94411L13.7467 4.01117C12.5507 2.91891 10.9979 2.25 9.13812 2.25C6.44564 2.25 4.12261 3.76569 2.98926 5.9748L5.28098 7.71754C5.82571 6.12206 7.34731 4.93774 9.13812 4.93774Z" fill="#EA4335" />
                        <path d="M5.27802 10.2849L4.77385 10.6631L2.98926 12.0253C4.12261 14.2283 6.4455 15.7501 9.13798 15.7501C10.9976 15.7501 12.5568 15.1487 13.6964 14.1179L11.461 12.4181C10.8474 12.8231 10.0647 13.0685 9.13798 13.0685C7.34717 13.0685 5.82564 11.8842 5.28083 10.2887L5.27802 10.2849Z" fill="#34A853" />
                      </svg>
                      <span className='text-[#525866] font-medium'>{t('worker.profile.musicProducer')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="
                      w-[100px]
                      h-8
                      rounded-lg           
                      border border-[#E1E4EA]  
                      bg-white             
                      pl-[22px] pr-[8px] py-[6px]    
                      flex items-center justify-between gap-[2px] 
                      
                      text-sm font-medium text-[#525866] 
                      shadow-[0_1px_2px_0_rgba(10,13,20,0.03)] 
                      transition-colors
                      hover:bg-[#F5F7FA]
                      hover:border-none
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    onClick={handleHireClick}
                    disabled={disableActions}
                    aria-label={currentUserProfile?.id === worker?.id ? t('worker.profile.actions.cannotHireSelf') : t('worker.profile.actions.hire', { name: displayName })}
                  >
                    <div className="flex items-center text-[14px] font-medium gap-[2px]">
                      {t('worker.profile.actions.hire')} <RiArrowDropRightLine className="size-7" />
                    </div>
                  </button>

                  <FancyButton.Root
                    size="medium"
                    className="w-[100px] h-8 gap-[2px] px-[6px] py-[6px] font-medium text-sm text-white bg-text-strong-950 shadow-[0_0_0_1px_rgba(36,38,40,1),0_1px_2px_0_rgba(27,28,29,0.48)] hover:bg-text-strong-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (currentUserProfile?.user_type === worker?.user_type) {
                        toast({
                          description: t('worker.profile.actions.cannotMessageSameType'),
                        });
                        return;
                      }
                      handleOpenChat();
                    }}
                    disabled={disableActions || isLoadingChat}
                    aria-label={
                      currentUserProfile?.id === worker?.id
                        ? t('worker.profile.actions.cannotMessageSelf')
                        : t('worker.profile.actions.message', { name: displayName })
                    }
                  >
                    {isLoadingChat ? (
                      <RiLoader4Line className="animate-spin" size={18} />
                    ) : (
                      <div className="flex items-center text-[14px] font-medium gap-[2px]">
                        {t('worker.profile.actions.touch')}
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 stroke-current text-white"
                        >
                          <path
                            d="M6.66641 5.2668L13.7414 2.90846C16.9164 1.85013 18.6414 3.58346 17.5914 6.75846L15.2331 13.8335C13.6497 18.5918 11.0497 18.5918 9.46641 13.8335L8.76641 11.7335L6.66641 11.0335C1.90807 9.45013 1.90807 6.85846 6.66641 5.2668Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.92578 11.375L11.9091 8.3833"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </FancyButton.Root>

                  <button className="rounded-full text-[#525866] transition-colors " onClick={handleLikeStatus}>
                    {!likeStatus ? <RiHeart3Line className="size-[28px]" /> : <RiHeart3Fill className="size-[28px] text-red-500" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 flex h-[88px] items-center justify-center px-5 text-text-secondary-600">
                {t('worker.profile.error.loadFailed')}
              </div>
            )}
            {chatError && (
              <p className="text-xs text-red-600 px-5 mt-2 text-center">{t('common.error')}: {chatError}</p>
            )}
          </div>

          <div className="mt-[16px] h-px bg-stroke-soft-200 w-[95%] mx-auto flex-shrink-0" />

          {!isLoading && worker && (
            <div className="px-[36px] pt-4 flex-shrink-0">
              <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <Tabs.List className="flex justify-start gap-5 px-0">
                  {[
                    { key: 'about', label: t('worker.profile.page.tabs.about') },
                    { key: 'work', label: t('worker.profile.page.tabs.work') },
                    { key: 'services', label: t('worker.profile.page.tabs.services') },
                    { key: 'reviews', label: t('worker.profile.page.tabs.reviews') },
                  ].map(({ key, label }) => (
                    <Tabs.Trigger
                      key={key}
                      value={key}
                      className="
                        inline-flex 
                        justify-start 
                        border-b-2 
                        border-transparent 
                        bg-transparent 
                        px-0
                        py-2 
                        text-[20px] 
                        font-medium 
                        text-[#525866]
                        hover:text-[#0E121B]
                        transition-colors 
                        data-[state=active]:border-black 
                        data-[state=active]:text-[#0E121B]

                        data-[state=active]:bg-transparent
                      "
                    >
                      {label}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
              </Tabs.Root>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-[36px] py-5">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <RiLoader4Line className="size-10 animate-spin text-text-secondary-600" />
              </div>
            ) : worker ? (
              <>
                {activeTab === 'about' && (
                  <>
                    <div className="relative max-w-[95%] text-[#525866] text-paragraph-sm">
                      <p
                        ref={textRef}
                        className={`${expanded ? '' : 'line-clamp-5'} transition-all`}
                      >
                        {displayBio}
                      </p>

                      {!expanded && isClamped && (
                        <button
                          onClick={() => setExpanded(true)}
                          className="mt-1 text-sm font-medium text-blue-600 hover:underline"
                        >
                          {t('common.more')}
                        </button>
                      )}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <h3 className="text-[20px] font-medium text-text-strong-950 pb-2 border-b-[2px] border-black">
                        {t('worker.profile.page.tabs.work')}
                      </h3>
                    </div>
                    <div className="divide-y divide-stroke-soft-200 mt-1 border-b">
                      {worker?.music_data && worker?.music_data.length > 0 ? (
                        worker?.music_data.map((item: MusicItem, i) => (
                          <WorkItem
                            key={i}
                            url={item.url}
                            title={item.title}
                            remarks={item.remarks ?? ''}
                            sellerName={displayName}
                            sellerAvatarUrl={displayAvatar ?? null}
                            duration={`0:${(i % 60).toString().padStart(2, '0')}`}
                            bpm={`${90 + (i * 5) % 60} BPM`}
                            genres={['Pop', 'Electronic', 'Vocal'].slice(i % 2, (i % 2) + 2)}
                          />
                        ))
                      ) : (
                        <p className="py-4 text-[14px] text-[#525866]">{t('worker.profile.page.work.noWork')}</p>
                      )}
                    </div>

                    <h3 className="mt-6 inline-block text-[20px] font-medium text-text-strong-950 pb-1 border-b-[2px] border-text-strong-950">
                      {t('worker.profile.page.tabs.services')}
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {services && services.length > 0 ? (
                        services.slice(0, 3).map((svc) => (
                          <ServiceCard
                            key={svc.id}
                            service={svc}
                            sellerAvatarUrl={displayAvatar ? displayAvatar : undefined}
                            sellerName={displayName}
                          />
                        ))
                      ) : (
                        <p className="text-[14px] text-[#525866]">{t('worker.profile.page.services.noServices')}</p>
                      )}
                    </div>

                    <h3 className="mt-6 inline-block text-[20px] font-medium border-black text-text-strong-950 pb-1 border-b-[2px]">
                      {t('worker.profile.page.tabs.reviews')}
                    </h3>
                    <div className="mt-4">
                      {placeholderWorkerData.reviews.map((r) => (
                        <ReviewItem key={r.id} review={r} />
                      ))}
                      {placeholderWorkerData.reviews.length === 0 && (
                        <p className="py-4 text-center text-[14px] text-[#525866]">{t('worker.profile.page.reviews.noReviews')}</p>
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'work' && (
                  <div className="divide-y divide-stroke-soft-200">
                    {worker.music_data && worker.music_data.length > 0 ? (
                      worker.music_data.map((item: MusicItem, i) => (
                        <WorkItem
                          key={i}
                          url={item.url}
                          title={item.title}
                          remarks={item.remarks ?? ''}
                          sellerName={displayName}
                          sellerAvatarUrl={displayAvatar ?? null}
                          duration={`0:${(i % 60).toString().padStart(2, '0')}`}
                          bpm={`${90 + (i * 5) % 60} BPM`}
                          genres={['Pop', 'Electronic', 'Vocal'].slice(i % 2, (i % 2) + 2)}
                        />
                      ))
                    ) : (
                      <div className="text-center text-text-secondary-600 py-10">
                        <p>{t('worker.profile.page.work.noWork')}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'services' && (
                  <>
                    {services && services.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                        {services.map((svc) => (
                          <ServiceCard
                            key={svc.id}
                            service={svc}
                            sellerAvatarUrl={displayAvatar ? displayAvatar : undefined}
                            sellerName={displayName}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-text-secondary-600 py-10">
                        <p>{t('worker.profile.page.services.noServices')}</p>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-5 divide-y divide-stroke-soft-200">
                    {placeholderWorkerData.reviews.length > 0 ? (
                      placeholderWorkerData.reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} />
                      ))
                    ) : (
                      <div className="text-center text-text-secondary-600 py-10">
                        <p>{t('worker.profile.page.reviews.noReviews')}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-text-secondary-600">
                {t('worker.profile.error.loadFailed')}
              </div>
            )}
          </div>
        </div>

        {worker && (
          <MusicUploadDialog
            open={isUploadModalOpen}
            onOpenChange={setIsUploadModalOpen}
            userId={worker.id}
            onUploadComplete={handleUploadComplete}
          />
        )}
        {activeChat && currentUserProfile && worker && (
          <ChatPopupWrapper
            key={activeChat.id}
            chat={activeChat}
            initialMessages={activeChatMessages}
            currentUserProfile={currentUserProfile}
            otherUserProfile={worker}
            currentUserId={currentUserProfile.id}
            isLoadingMessages={isLoadingMessages}
            onClose={handleCloseChat}
            position="bottom-right"
          />
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default WorkerProfileDrawer;
