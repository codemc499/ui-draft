'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Avatar from '@/components/ui/avatar';
import * as AvatarGroup from '@/components/ui/avatar-group';
import * as Divider from '@/components/ui/divider';
import * as Button from '@/components/ui/button';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Badge from '@/components/ui/badge';
import * as Tag from '@/components/ui/tag';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import * as Notification from '@/components/ui/notification';
import { useAuth } from '@/utils/supabase/AuthContext';
import { chatOperations, userOperations, jobOperations } from '@/utils/supabase/database';
import { User, Job, Chat, Message } from '@/utils/supabase/types';
import ChatPopupWrapper from '@/components/chat/chat-popup-wrapper';
import { ProfileActionButtons } from '@/components/users/profile/profile-action-buttons';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { usePathname } from 'next/navigation';

import {
  RiStarFill,
  RiTwitchFill,
  RiTwitterXFill,
  RiGoogleFill,
  RiArrowRightSLine,
} from '@remixicon/react';
import { useNotification } from '@/hooks/use-notification';
import SellerProfilePage from '@/app/[lang]/users/[id]/seller-profile-page';

import * as AvatarGroupCompact from '@/components/ui/avatar-group-compact';


export function AvatarGroupDemo() {
  return (
    <AvatarGroupCompact.Root size='24'>
      <AvatarGroupCompact.Stack>
        <Avatar.Root>
          <Avatar.Image src='https://i.pravatar.cc/40?img=32' />
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Image src='https://i.pravatar.cc/40?img=45' />
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Image src='https://i.pravatar.cc/40?img=12' />
        </Avatar.Root>
      </AvatarGroupCompact.Stack>
      <AvatarGroupCompact.Overflow>+4</AvatarGroupCompact.Overflow>
    </AvatarGroupCompact.Root>
  );
}


// Helper function to get currency symbol
const getCurrencySymbol = (currency: string): string => {
  switch (currency?.toUpperCase()) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'CNY':
      return '¥';
    default:
      return '$'; // Default to USD
  }
};

// User Sidebar Component
const UserSidebar = ({ userData }: { userData: User | null }) => {
  const { user: currentUser } = useAuth();
  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<Message[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const { notification: toast } = useNotification();
  const { t } = useTranslation('common');

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      if (currentUser?.id) {
        const profile = await userOperations.getUserById(currentUser.id);
        setCurrentUserProfile(profile);
      }
    };
    fetchCurrentUserProfile();
  }, [currentUser]);

  const handleOpenChat = async () => {
    if (!currentUser || !userData) {
      setChatError('Could not load user profiles. Please try again later.');
      console.error('Cannot open chat: Missing current user or viewed user profile.');
      return;
    }
    if (currentUser.id === userData.id) {
      setChatError("You cannot start a chat with yourself.");
      return;
    }

    setIsLoadingChat(true);
    setChatError(null);
    setActiveChat(null);
    setActiveChatMessages([]);

    try {
      const chat = await chatOperations.findOrCreateChat(currentUser.id, userData.id);
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

  // --- Follow Button Handler ---
  const handleFollowClick = () => {
    toast({
      title: t('users.profile.page.follow.success'),
      description: t('users.profile.page.follow.description', {
        name: userData?.full_name || userData?.username || 'this user'
      })
    });
  };
  // --- End Follow Button Handler ---

  if (!userData) {
    return (
      <aside className='hidden max-w-[352px] w-full shrink-0 lg:block'>
        <div className='shadow-sm sticky top-20 flex flex-col gap-4 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4'>
          <div className='flex flex-col items-center gap-3 text-center'>
            <div className='h-20 w-20 rounded-full bg-gray-200 animate-pulse'></div>
            <div className='h-6 w-32 bg-gray-200 animate-pulse'></div>
          </div>
          <div className='h-4 w-full bg-gray-200 animate-pulse'></div>
          <div className='h-20 w-full bg-gray-200 animate-pulse'></div>
        </div>
      </aside>
    );
  }

  const tags = [
    'Grammy',
    'Billboard Music',
    'American Music',
    'BRIT',
    'MTV Music',
    'Eurovision Awards',
  ];
  const reviewAvatars = [
    'https://i.pravatar.cc/40?img=32',
    'https://i.pravatar.cc/40?img=45',
    'https://i.pravatar.cc/40?img=12',
  ];

  return (
    <aside className='hidden w-[352px] max-w-[352px] shrink-0 lg:block'>
      <div className='sticky top-20 flex flex-col gap-4 border border-stroke-soft-200 bg-bg-white-0 max-h-[686px] rounded-[20px] pb-6 shadow-[0_2px_4px_0_rgba(14,18,27,0.03),0_6px_10px_0_rgba(14,18,27,0.06)]'>
        {/* New Wrapper Div */}
        <div className="flex flex-col max-w-[352px] max-h-[328px] pt-8 px-4 gap-4">
          {/* Profile Section */}
          <div className='flex flex-col items-center gap-2 text-center'>
            <Avatar.Root size='80' className="relative">
              <Avatar.Image
                src={userData.avatar_url || 'https://via.placeholder.com/80'}
                alt={userData.full_name || userData.username}
              />
              <Avatar.Indicator position="bottom">
                <Avatar.Status status="online" />
              </Avatar.Indicator>
            </Avatar.Root>
            <div>
              <h2 className='font-medium text-[#525866]  text-[16px]'>
                {userData.full_name || userData.username}
              </h2>
              <div className='mt-1 flex items-center justify-center gap-1'>
                <RiStarFill className='size-3.5 text-yellow-400' />
                <span className='text-text-secondary-600 text-[#525866] text-paragraph-xs'>
                  4.9(125) {/* Placeholder ratings - could be added to user schema later */}
                </span>
              </div>
            </div>
            <div className='flex items-center justify-center gap-3 mb-3'>
              <div className='gap-1 flex flex-row hover:bg-[#F6F8FA] hover:text-text-strong-950 px-2 rounded-md'>
                <Image src="/images/Chrome.svg" alt="Icon" width={16} height={16} /> <span className="text-[12px]">Google</span>
              </div>
              <div className='gap-1 flex flex-row hover:bg-[#F6F8FA] hover:text-text-strong-950 px-2 rounded-md'>
                <Image src="/images/Chrome.svg" alt="Icon" width={16} height={16} /> <span className="text-[12px]">Google</span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Replaced with component */}
          <ProfileActionButtons
            targetUser={userData}
            currentUser={currentUserProfile}
            isLoadingChat={isLoadingChat}
            onHire={handleFollowClick}
            onMessage={handleOpenChat}
          />

          {/* Display Chat Error */}
          {chatError && (
            <p className="text-xs text-red-600 mb-2 text-center">Error: {chatError}</p>
          )}

          {/* Recent Reviews */}
          <div className='px-3'>
            <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between">
              {/* Left section - Star and text */}
              <div className="flex items-center gap-1 text-label-md font-medium w-full text-text-strong-950 hover:bg-[#F6F8FA] hover:text-text-strong-950 py-2 px-2 rounded-md">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5">
                  <path d="M11.4416 2.92501L12.9083 5.85835C13.1083 6.26668 13.6416 6.65835 14.0916 6.73335L16.7499 7.17501C18.4499 7.45835 18.8499 8.69168 17.6249 9.90835L15.5583 11.975C15.2083 12.325 15.0166 13 15.1249 13.4833L15.7166 16.0417C16.1833 18.0667 15.1083 18.85 13.3166 17.7917L10.8249 16.3167C10.3749 16.05 9.63326 16.05 9.17492 16.3167L6.68326 17.7917C4.89992 18.85 3.81659 18.0583 4.28326 16.0417L4.87492 13.4833C4.98326 13 4.79159 12.325 4.44159 11.975L2.37492 9.90835C1.15826 8.69168 1.54992 7.45835 3.24992 7.17501L5.90826 6.73335C6.34992 6.65835 6.88326 6.26668 7.08326 5.85835L8.54992 2.92501C9.34992 1.33335 10.6499 1.33335 11.4416 2.92501Z" fill="#0A0D14" stroke="#0A0D14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span className="text-[14px]">Recent reviews</span>
              </div>

              {/* Right section - Avatars */}
              <AvatarGroupDemo />
            </div>
          </div>
        </div> {/* End of New Wrapper Div */}

        <Divider.Root />

        {/* Tags Section */}
        <div className="max-w-[352px] max-h-[116px] px-4">
          <h3 className="mb-2 text-text-strong-950 font-semibold text-[12px]">
            Tags
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge.Root
                key={tag}
                variant="light"
                size="medium"
                className="bg-white min-h-[24px] rounded-md border border-stroke-soft-300 text-gray-600 px-2 py-0.5 hover:bg-[#F6F8FA] hover:text-text-strong-950"
              >
                {tag}
              </Badge.Root>
            ))}
          </div>
        </div>

        <Divider.Root />

        {/* About Section */}
        {/* New Wrapper for About and Social Links */}
        <div className="flex flex-col max-w-[352px] max-h-[218px] p-4 gap-5">
          <div>
            <div className='mb-2 flex items-center justify-between'>
              <h3 className='text-text-strong-950 text-[12px] font-semibold'>
                About
              </h3>
            </div>
            <p className='line-clamp-5 font-normal text-[12px] leading-4 tracking-normal text-[#525866]'>
              {userData.bio || "This user hasn't added a bio yet."}
            </p>
          </div>

          {/* Social Links */}
          <div className='flex items-center gap-3'>
            <Link
              href='#'
              className='text-icon-secondary-400 hover:text-icon-primary-500 text-[#6441A5]'
            >
              <RiTwitchFill className='size-7' />
            </Link>
            <Link
              href='#'
              className='text-icon-secondary-400 hover:text-icon-primary-500'
            >
              <RiTwitterXFill className='size-7' />
            </Link>
            <Link href="#">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.2139 12.0911V16.1575H19.9801C19.7269 17.4652 18.9671 18.5725 17.8275 19.317L21.3048 21.9612C23.3307 20.1285 24.4996 17.4366 24.4996 14.2389C24.4996 13.4944 24.4314 12.7784 24.3048 12.0912L14.2139 12.0911Z" fill="#4285F4" />
                <path d="M4.64927 9.29431C3.91879 10.707 3.5 12.3011 3.5 14.0002C3.5 15.6993 3.91879 17.2934 4.64927 18.7061C4.64927 18.7155 8.21429 15.9951 8.21429 15.9951C8 15.3651 7.87334 14.697 7.87334 14.0001C7.87334 13.3032 8 12.635 8.21429 12.005L4.64927 9.29431Z" fill="#FBBC05" />
                <path d="M14.2143 7.68093C15.7923 7.68093 17.1949 8.21546 18.315 9.24639L21.3832 6.2396C19.5228 4.54053 17.1072 3.5 14.2143 3.5C10.026 3.5 6.41241 5.85774 4.64941 9.29413L8.21432 12.0051C9.06168 9.5232 11.4286 7.68093 14.2143 7.68093Z" fill="#EA4335" />
                <path d="M8.20971 15.9987L7.42545 16.587L4.64941 18.7061C6.41241 22.1329 10.0258 24.5002 14.2141 24.5002C17.1069 24.5002 19.5322 23.5647 21.305 21.9611L17.8277 19.317C16.8732 19.947 15.6556 20.3288 14.2141 20.3288C11.4284 20.3288 9.06156 18.4866 8.21409 16.0047L8.20971 15.9987Z" fill="#34A853" />
              </svg>

            </Link>

          </div>
        </div>
      </div>

      {/* Conditionally render Chat Popup */}
      {activeChat && currentUserProfile && userData && currentUser && (
        <ChatPopupWrapper
          key={activeChat.id}
          chat={activeChat}
          initialMessages={activeChatMessages}
          currentUserProfile={currentUserProfile}
          otherUserProfile={userData}
          currentUserId={currentUser.id}
          isLoadingMessages={isLoadingMessages}
          onClose={handleCloseChat}
          position="bottom-right"
        />
      )}
    </aside>
  );
};

// Order List Item Component
const OrderListItem = ({ job, loggedInUserType }: { job: Job; loggedInUserType?: User['user_type'] | null }) => {
  const [showNotification, setShowNotification] = useState(false);
  const { t } = useTranslation('common');
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  // Fixed placeholder tags 
  const placeholderTags = ['Mixing', 'Singing', 'Jazz'];

  // Ensure we always have exactly 3 tags to display
  let displayTags: string[] = [];

  // Add available skill_levels first
  if (job.skill_levels && Array.isArray(job.skill_levels)) {
    displayTags = [...job.skill_levels];
  }

  // If we have fewer than 3 tags, add placeholders until we have 3
  while (displayTags.length < 3) {
    const placeholderIndex = displayTags.length;
    if (placeholderIndex < placeholderTags.length) {
      displayTags.push(placeholderTags[placeholderIndex]);
    } else {
      // In case we run out of placeholders
      displayTags.push(`Tag ${displayTags.length + 1}`);
    }
  }

  // Handle apply button click
  const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(`Applying for job: ${job.title} (ID: ${job.id})`);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <Link
      href={`/${lang}/projects/${job.id}`}
      className='block border-b border-stroke-soft-200 px-[16px] py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 last:border-b-0'
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 max-w-[80%]'>
          {/* Title */}
          <h3 className='mb-2.5 text-paragraph-lg font-medium text-[20px] text-text-strong-950'>
            {job.title}
          </h3>

          {/* Tags */}
          <div className='mb-2 flex flex-wrap gap-1.5'>
            {displayTags.map((tag, i) => (
              <Tag.Root
                key={i}
                className=' hover:bg-white hover:border hover:border-black hover:text-black font-medium'
                data-state={i === 0 ? "active" : "default"}
              >
                {tag}
              </Tag.Root>
            ))}
          </div>

          {/* Description */}
          <p className='text-text-secondary-600 line-clamp-2 text-paragraph-sm mt-3'>
            {job.description || "No description provided."}
          </p>
        </div>

        <div className='shrink-0 text-right'>
          <div className='text-gray-600 text-label-sm'>Budget</div>
          <div className='my-2.5 text-label-lg font-medium text-text-strong-950'>
            {getCurrencySymbol(job.currency)}{job.budget.toLocaleString()}
          </div>
          {loggedInUserType === 'seller' && (
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              onClick={handleApply}
            >
              Apply
              <Button.Icon as={RiArrowRightSLine} />
            </Button.Root>
          )}
        </div>

        {/* Success notification */}
        {showNotification && (
          <Notification.Root
            description={t('users.profile.page.apply.description', { title: job.title })}
            open={showNotification}
            onOpenChange={setShowNotification}
          />
        )}
      </div>
    </Link>
  );
};

// Review List Item Component
const ReviewListItem = () => {
  const review = {
    avatarUrl: 'https://via.placeholder.com/40',
    name: 'Cleve Music',
    rating: 4.9,
    date: 'Jan 8, 2023',
    title: 'Contract title text here...',
    description:
      "Working with Ralph on a UX audit for our website was a game-changer. Ralph didn't just identify pain points-he offered innovative solutions that empowered me to make key business decisions with confidence.123confidence.123confidence.123confidence.123confidence.123confidence.123confidence.123confidence.123confidence.123",
    amount: 1000.0,
  };

  return (
    <div className='border-b border-stroke-soft-200 py-4 hover:bg-[#F6F8FA] hover:text-text-strong-950 px-[16px]'>
      {/* Top row with user info and amount */}
      <div className='flex items-start justify-between mb-3'>
        {/* LEFT SIDE: Avatar + User Info */}
        <div className='flex items-start gap-2.5'>
          <Avatar.Root size='48' className='shrink-0'>
            <Avatar.Image src={review.avatarUrl} alt={review.name} />
          </Avatar.Root>

          <div className='flex flex-col gap-2.5'>
            {/* Row 1: Name */}
            <div className='text-text-secondary-600 text-label-sm font-medium'>
              {review.name}
            </div>

            {/* Row 2: Rating and Date */}
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-0.5'>
                <RiStarFill className='size-3.5 text-yellow-400' />
                <span className='text-gray-600 text-paragraph-xs'>
                  {review.rating}
                </span>
              </div>
              <span className='text-gray-600 text-paragraph-xs'>
                {review.date}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Amount */}
        <div className='shrink-0 text-right text-label-lg font-medium text-text-strong-950'>
          ${review.amount.toFixed(2)}
        </div>
      </div>

      {/* Bottom row with title and description */}
      <div>
        <h3 className='mb-1 mt-1.5 text-paragraph-lg font-medium text-text-strong-950'>
          {review.title}
        </h3>
        <p className='text-gray-600 ml-0.5 line-clamp-2 text-paragraph-sm'>
          {review.description}
        </p>
      </div>
    </div>
  );
};

// User Profile Page Component 
export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { user: currentUser } = useAuth();
  const { t } = useTranslation('common');
  const [, lang] = usePathname().split('/');
  const [activeTab, setActiveTab] = useState('Order');
  const [userData, setUserData] = useState<User | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(null);
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = resolvedParams.id; // Access id from the resolved params

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  // Fetch user data when component mounts or userId changes
  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching user data for ID:', userId);
        const user = await userOperations.getUserById(userId);

        if (user) {
          console.log('User data fetched successfully:', user);
          setUserData(user);
        } else {
          console.error('Failed to fetch user data, getUserById returned null');
          setError('User not found');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [userId]);

  // Fetch logged-in user's profile data
  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      if (currentUser?.id) {
        const profile = await userOperations.getUserById(currentUser.id);
        setCurrentUserProfile(profile);
      } else {
        setCurrentUserProfile(null); // Clear profile if user logs out
      }
    };
    fetchCurrentUserProfile();
  }, [currentUser]);

  // Fetch jobs when user data is available
  useEffect(() => {
    async function fetchUserJobs() {
      if (!userData) return;

      setIsLoadingJobs(true);
      try {
        console.log('Fetching jobs for buyer ID:', userId);
        const jobs = await jobOperations.getJobsByBuyerId(userId);

        if (jobs && jobs.length > 0) {
          console.log('Jobs fetched successfully:', jobs);
          setUserJobs(jobs);
        } else {
          console.log('No jobs found for this user');
          setUserJobs([]);
        }
      } catch (err) {
        console.error('Error fetching user jobs:', err);
      } finally {
        setIsLoadingJobs(false);
      }
    }

    fetchUserJobs();
  }, [userData, userId]);

  // Example data for multiple review items with different content
  const reviewsData = [
    {
      avatarUrl: 'https://via.placeholder.com/40',
      name: 'Cleve Music',
      rating: 4.9,
      date: 'Jan 8, 2023',
      title: 'Contract title text here...Contract title text here..ntr',
      description:
        "Working with Ralph on a UX audit for our website was a game-changer. Ralph didn't just identify pain points-he offered innovative solutions that empowered me to make key business decisions with confidence.",
      amount: 1000.0,
    },
    {
      avatarUrl: 'https://via.placeholder.com/40',
      name: 'Cleve Music',
      rating: 4.9,
      date: 'Jan 8, 2023',
      title: 'Contract title text here...',
      description:
        "Working with Ralph on a UX audit for our website was a game-changer. Ralph didn't just identify pain points-he offered innovative solutions that empowered me to make key business decisions with confidence.",
      amount: 1000.0,
    },
    {
      avatarUrl: 'https://via.placeholder.com/40',
      name: 'Cleve Music',
      rating: 4.9,
      date: 'Jan 8, 2023',
      title: 'Contract title text here...',
      description:
        "Working with Ralph on a UX audit for our website was a game-changer. Ralph didn't just identify pain points-he offered innovative solutions that empowered me to make key business decisions with confidence.",
      amount: 1000.0,
    },
  ];

  // If there's an error loading the user data
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">{t('users.profile.page.error.title')}</h2>
          <p className="mt-2">{error}</p>
          <Link href={`/${lang}/home`} className="mt-4 inline-block text-blue-600 underline">
            {t('users.profile.page.error.returnHome')}
          </Link>
        </div>
      </div>
    );
  }

  // --- Conditional Rendering for Seller ---
  if (userData?.user_type === 'seller') {
    // Render the worker detail page if the user is a seller
    // NOTE: WorkerDetailPage currently uses its own mock data.
    // We will need to pass actual data later.
    return <SellerProfilePage user={userData} />;
  }
  // --- End Conditional Rendering ---

  // Function to render content based on active tab
  const renderTabContent = () => {
    if (activeTab === "Order") {
      return (
        <div className="flex flex-col divide-y divide-stroke-soft-200">
          {isLoadingJobs ? (
            // Loading skeleton for jobs
            <>
              <div className="py-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="py-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </>
          ) : userJobs.length > 0 ? (
            userJobs.map((job) => (
              <OrderListItem
                key={job.id}
                job={job}
                loggedInUserType={currentUserProfile?.user_type}
              />
            ))
          ) : (
            <div className="py-6 text-center">
              <p className="text-gray-500">{t('users.profile.page.noOrders')}</p>
            </div>
          )}
        </div>
      );
    } else if (activeTab === "Review") {
      return (
        <div className="flex flex-col divide-y divide-stroke-soft-200">
          {reviewsData.map((review, i) => (
            <ReviewListItem key={i} />
          ))}
        </div>
      );
    }
  };

  return (
    <Notification.Provider>
      <div className='flex flex-1 gap-8 px-8 pt-7'>
        <UserSidebar userData={userData} />
        <main className="flex-1 max-w-[1000px] max-h-[964px]">
          <div className="w-full lg:max-w-[1000px] mx-auto flex flex-col gap-4">
            <div className="border-t-0 px-[16px]">
              <TabMenuHorizontal.Root value={activeTab} onValueChange={setActiveTab}>
                <TabMenuHorizontal.List className="flex items-center justify-start w-fit gap-4 border-none border-y-0">
                  <TabMenuHorizontal.Trigger
                    value="Order"
                    className="pb-2 font-medium text-gray-400 data-[state=active]:text-black text-[24px]"
                  >
                    {t('users.profile.page.tabs.order')}
                  </TabMenuHorizontal.Trigger>
                  <TabMenuHorizontal.Trigger
                    value="Review"
                    className="pb-2 font-medium text-gray-400 data-[state=active]:text-black text-[24px]"
                  >
                    {t('users.profile.page.tabs.review')}
                  </TabMenuHorizontal.Trigger>
                </TabMenuHorizontal.List>
              </TabMenuHorizontal.Root>
            </div>

            <div className="pb-4">
              {renderTabContent()}
            </div>
          </div>
        </main>
        <Notification.Viewport />
      </div>
    </Notification.Provider>
  );
} 