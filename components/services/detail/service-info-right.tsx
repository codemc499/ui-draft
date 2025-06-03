'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Service, Chat, Message, User } from '@/utils/supabase/types'; // Import Chat, Message, User
import { useAuth } from '@/utils/supabase/AuthContext'; // Added useAuth
import { chatOperations, userOperations } from '@/utils/supabase/database'; // Added chatOperations, userOperations
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Tag from '@/components/ui/tag'; // Import Tag
import { notification as toast } from '@/hooks/use-notification'; // Added import for toast
import ChatPopupWrapper from '@/components/chat/chat-popup-wrapper'; // Added ChatPopupWrapper
import {
  RiStarFill,
  RiHeart3Line,
  RiSendPlaneLine,
  RiArrowRightSLine,
  RiGoogleFill,
  RiTwitchFill,
  RiTwitterXFill,
  RiMoneyCnyCircleLine,
  RiGroupLine,
  RiCalendarLine,
  RiLoader4Line, // Added loader icon
  RiHeart3Fill
} from '@remixicon/react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';



// Remove the old specific data interfaces
/*
interface ServiceProviderInfo { ... }
interface ServiceInfoRightData { ... }
*/

interface ServiceInfoRightProps {
  service: Service; // Use the full Service type
}

// Define dummy tools data
const dummyTools = ['Adobe Audition', 'Pro Tools', 'Logic Pro X', 'FL Studio'];

export function ServiceInfoRight({ service }: ServiceInfoRightProps) {
  const { t } = useTranslation('common');
  const { user: currentUser, userProfile } = useAuth(); // Get current user
  const isSeller = userProfile?.user_type === 'seller';

  const [sellerProfile, setSellerProfile] = useState<User | null>(null); // State for seller profile
  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(null); // State for current user profile
  const [activeChat, setActiveChat] = useState<Chat | null>(null); // State for active chat
  const [activeChatMessages, setActiveChatMessages] = useState<Message[]>([]); // State for messages
  const [isLoadingChat, setIsLoadingChat] = useState(false); // State for loading chat
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // Separate loading state for messages
  const [chatError, setChatError] = useState<string | null>(null); // State for chat errors
  const [liked, setLiked] = useState(false);
  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      if (service.seller_id) {
        const profile = await userOperations.getUserById(service.seller_id);
        setSellerProfile(profile);
      }
      if (currentUser?.id) {
        const profile = await userOperations.getUserById(currentUser.id);
        setCurrentUserProfile(profile);
      }
    };
    fetchProfiles();
  }, [service.seller_id, currentUser]);

  // Keep social icon helper if needed, otherwise remove
  // const getSocialIcon = (platform: string) => { ... };

  // Helper to format currency (basic example)
  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', { // Adjust locale as needed
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0, // Adjust as needed
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // --- Hire Button Handler --- 
  const handleHireClick = async () => {
    // TODO: Implement actual hiring logic later

    if (!currentUser || !sellerProfile) {
      console.error('Cannot hire: Missing current user or seller profile.');
      return;
    }
    if (currentUser.id === sellerProfile.id) {
      console.log("Cannot hire yourself");
      return;
    }

    try {
      const chat = await chatOperations.findOrCreateChat(currentUser.id, sellerProfile.id);
      if (chat) {

        await chatOperations.sendMessage({
          chat_id: chat.id,
          sender_id: currentUser.id,
          content: '',
          message_type: 'hire_request',
          data: {
            status: 'pending',
            service_id: service.id,
            title: service.title,
            price: service.price,
            description: service.description,
          },
        });

      } else {
        setChatError('Failed to find or create chat conversation.');
      }
    } catch (error: any) {
      console.error('Error sending hire request ', error);
      setChatError(error.message || 'An unexpected error occurred.');
    } finally {

    }

    toast({
      description: `Hire Request Sent! Successfully initiated hiring process for service: ${service.title}.`, // Combine title and description
    });



  };
  // --- End Hire Button Handler ---

  // --- Message Button Handlers --- 
  const handleOpenChat = async () => {
    if (!currentUser || !sellerProfile) {
      setChatError('Could not load user profiles. Please try again later.');
      console.error('Cannot open chat: Missing current user or seller profile.');
      return;
    }
    if (currentUser.id === sellerProfile.id) {
      toast({ description: t('service.info.cannotMessageSelf') });
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
  // --- End Message Button Handlers ---

  const handleLike = () => {
    setLiked(!liked);

    if (liked) {
      toast({ description: "Added to Favorites" })
    } else {
      toast({ description: "Removed from Favorites" })
    }
  };

  return (
    <div className='sticky top-20'>
      <div className='rounded-[20px] border border-[#E2E4E9] bg-bg-white-0 p-[20px] shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.1)]'>
        {/* Provider Info - Use service.seller_name, seller_avatar_url */}
        <div className="relative p-[16px]">
          <div className="flex flex-col items-center text-center p-[16px]">

            <div className="flex flex-col items-center">

              {/* heart icon top-right */}
              <button className="absolute top-7 right-7 p-1 text-[#525866] hover:text-icon-primary-500" onClick={handleLike}>
                {liked ? <RiHeart3Line className="size-7 text-[#525866]" /> : <RiHeart3Fill className="size-7 text-red-500" />}
              </button>

              <Link href={`/${i18n.language}/users/${service.seller_id}`} passHref legacyBehavior>
                <a className="inline-block">
                  <Avatar.Root size="80">
                    <Avatar.Image
                      src={service.seller_avatar_url || 'https://via.placeholder.com/56'}
                      alt={service.seller_name || t('services.info.unknownSeller')}
                    />
                    {/* online-status dot */}
                    <Avatar.Indicator position="bottom">
                      <div className="size-3 rounded-full bg-green-500 ring-2 ring-white" />
                    </Avatar.Indicator>
                  </Avatar.Root>
                </a>
              </Link>

              <Link href={`/${i18n.language}/users/${service.seller_id}`} passHref>
                <h2 className="text-[16px] mt-[6px] font-medium text-[#525866]">
                  {service.seller_name || t('services.info.unknownSeller')}
                </h2>
              </Link>

              {/* rating (no "reviews" text) */}
              <div className="mt-1 flex items-center justify-center gap-1 text-xs text-[#525866] font-normal">
                <RiStarFill className="size-4 text-yellow-400" />
                <span className="text-gray-600 text-[12px]" >4.9 (125)</span>
              </div>
            </div>
            <div className="mt-[7px]">
              {/* two Google icons + "Google" twice */}
              <div className="mt-1 flex items-center justify-center gap-1 text-[12px] text-[#525866] font-medium">
                <div className='gap-1 flex hover:bg-[#F6F8FA] px-2 rounded-md'>
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48">
                    <path fill="#fff" d="M34,24c0,5.521-4.479,10-10,10s-10-4.479-10-10s4.479-10,10-10S34,18.479,34,24z"></path><linearGradient id="Pax8JcnMzivu8f~SZ~k1ya_ejub91zEY6Sl_gr1" x1="5.789" x2="31.324" y1="34.356" y2="20.779" gradientTransform="matrix(1 0 0 -1 0 50)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4caf50"></stop><stop offset=".489" stop-color="#4aaf50"></stop><stop offset=".665" stop-color="#43ad50"></stop><stop offset=".79" stop-color="#38aa50"></stop><stop offset=".892" stop-color="#27a550"></stop><stop offset=".978" stop-color="#11a050"></stop><stop offset="1" stop-color="#0a9e50"></stop></linearGradient><path fill="url(#Pax8JcnMzivu8f~SZ~k1ya_ejub91zEY6Sl_gr1)" d="M31.33,29.21l-8.16,14.77C12.51,43.55,4,34.76,4,24C4,12.96,12.96,4,24,4v11 c-4.97,0-9,4.03-9,9s4.03,9,9,9C27.03,33,29.7,31.51,31.33,29.21z"></path><linearGradient id="Pax8JcnMzivu8f~SZ~k1yb_ejub91zEY6Sl_gr2" x1="33.58" x2="33.58" y1="6" y2="34.797" gradientTransform="matrix(1 0 0 -1 0 50)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffd747"></stop><stop offset=".482" stop-color="#ffd645"></stop><stop offset=".655" stop-color="#fed43e"></stop><stop offset=".779" stop-color="#fccf33"></stop><stop offset=".879" stop-color="#fac922"></stop><stop offset=".964" stop-color="#f7c10c"></stop><stop offset="1" stop-color="#f5bc00"></stop></linearGradient><path fill="url(#Pax8JcnMzivu8f~SZ~k1yb_ejub91zEY6Sl_gr2)" d="M44,24c0,11.05-8.95,20-20,20h-0.84l8.17-14.79C32.38,27.74,33,25.94,33,24 c0-4.97-4.03-9-9-9V4c7.81,0,14.55,4.48,17.85,11C43.21,17.71,44,20.76,44,24z"></path><linearGradient id="Pax8JcnMzivu8f~SZ~k1yc_ejub91zEY6Sl_gr3" x1="36.128" x2="11.574" y1="44.297" y2="28.954" gradientTransform="matrix(1 0 0 -1 0 50)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f7572f"></stop><stop offset=".523" stop-color="#f7552d"></stop><stop offset=".712" stop-color="#f75026"></stop><stop offset=".846" stop-color="#f7461b"></stop><stop offset=".954" stop-color="#f7390a"></stop><stop offset="1" stop-color="#f73100"></stop></linearGradient><path fill="url(#Pax8JcnMzivu8f~SZ~k1yc_ejub91zEY6Sl_gr3)" d="M41.84,15H24c-4.97,0-9,4.03-9,9c0,1.49,0.36,2.89,1.01,4.13H16L7.16,13.26H7.14 C10.68,7.69,16.91,4,24,4C31.8,4,38.55,8.48,41.84,15z"></path><linearGradient id="Pax8JcnMzivu8f~SZ~k1yd_ejub91zEY6Sl_gr4" x1="19.05" x2="28.95" y1="30.95" y2="21.05" gradientTransform="matrix(1 0 0 -1 0 50)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2aa4f4"></stop><stop offset="1" stop-color="#007ad9"></stop></linearGradient><path fill="url(#Pax8JcnMzivu8f~SZ~k1yd_ejub91zEY6Sl_gr4)" d="M31,24c0,3.867-3.133,7-7,7s-7-3.133-7-7s3.133-7,7-7S31,20.133,31,24z"></path>
                  </svg>
                  <span>Google</span>
                </div>
                <div className='gap-1 flex hover:bg-[#F6F8FA] px-2 rounded-md'>
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48">
                    <path fill="#fff" d="M34,24c0,5.521-4.479,10-10,10s-10-4.479-10-10s4.479-10,10-10S34,18.479,34,24z"></path><linearGradient id="Pax8JcnMzivu8f~SZ~k1ya_ejub91zEY6Sl_gr1" x1="5.789" x2="31.324" y1="34.356" y2="20.779" gradientTransform="matrix(1 0 0 -1 0 50)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4caf50"></stop><stop offset=".489" stop-color="#4aaf50"></stop><stop offset=".665" stop-color="#43ad50"></stop><stop offset=".79" stop-color="#38aa50"></stop><stop offset=".892" stop-color="#27a550"></stop><stop offset=".978" stop-color="#11a050"></stop><stop offset="1" stop-color="#0a9e50"></stop></linearGradient><path fill="url(#Pax8JcnMzivu8f~SZ~k1ya_ejub91zEY6Sl_gr1)" d="M31.33,29.21l-8.16,14.77C12.51,43.55,4,34.76,4,24C4,12.96,12.96,4,24,4v11 c-4.97,0-9,4.03-9,9s4.03,9,9,9C27.03,33,29.7,31.51,31.33,29.21z"></path><linearGradient id="Pax8JcnMzivu8f~SZ~k1yb_ejub91zEY6Sl_gr2" x1="33.58" x2="33.58" y1="6" y2="34.797" gradientTransform="matrix(1 0 0 -1 0 50)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffd747"></stop><stop offset=".482" stop-color="#ffd645"></stop><stop offset=".655" stop-color="#fed43e"></stop><stop offset=".779" stop-color="#fccf33"></stop><stop offset=".879" stop-color="#fac922"></stop><stop offset=".964" stop-color="#f7c10c"></stop><stop offset="1" stop-color="#f5bc00"></stop></linearGradient><path fill="url(#Pax8JcnMzivu8f~SZ~k1yb_ejub91zEY6Sl_gr2)" d="M44,24c0,11.05-8.95,20-20,20h-0.84l8.17-14.79C32.38,27.74,33,25.94,33,24 c0-4.97-4.03-9-9-9V4c7.81,0,14.55,4.48,17.85,11C43.21,17.71,44,20.76,44,24z"></path><linearGradient id="Pax8JcnMzivu8f~SZ~k1yc_ejub91zEY6Sl_gr3" x1="36.128" x2="11.574" y1="44.297" y2="28.954" gradientTransform="matrix(1 0 0 -1 0 50)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f7572f"></stop><stop offset=".523" stop-color="#f7552d"></stop><stop offset=".712" stop-color="#f75026"></stop><stop offset=".846" stop-color="#f7461b"></stop><stop offset=".954" stop-color="#f7390a"></stop><stop offset="1" stop-color="#f73100"></stop></linearGradient><path fill="url(#Pax8JcnMzivu8f~SZ~k1yc_ejub91zEY6Sl_gr3)" d="M41.84,15H24c-4.97,0-9,4.03-9,9c0,1.49,0.36,2.89,1.01,4.13H16L7.16,13.26H7.14 C10.68,7.69,16.91,4,24,4C31.8,4,38.55,8.48,41.84,15z"></path><linearGradient id="Pax8JcnMzivu8f~SZ~k1yd_ejub91zEY6Sl_gr4" x1="19.05" x2="28.95" y1="30.95" y2="21.05" gradientTransform="matrix(1 0 0 -1 0 50)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2aa4f4"></stop><stop offset="1" stop-color="#007ad9"></stop></linearGradient><path fill="url(#Pax8JcnMzivu8f~SZ~k1yd_ejub91zEY6Sl_gr4)" d="M31,24c0,3.867-3.133,7-7,7s-7-3.133-7-7s3.133-7,7-7S31,20.133,31,24z"></path>
                  </svg>
                  <span>Google</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className='mb-[20px] h-px w-full bg-stroke-soft-200'></div>

        {/* Pricing, Delivery & Proposals */}
        <div className='mb-[28px] space-y-3'>

          <div className='flex items-center justify-between'>
            <div className='text-[#525866] flex items-center gap-2 '>
              <Button.Icon className="flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.02975 2.38251C4.39977 1.16704 6.16852 0.497123 8 0.500009C12.1423 0.500009 15.5 3.85776 15.5 8.00001C15.5024 9.53294 15.0329 11.0295 14.1553 12.2863L12.125 8.00001H14C14 6.80703 13.6444 5.64112 12.9786 4.65122C12.3128 3.66133 11.367 2.89239 10.262 2.44263C9.15706 1.99287 7.94312 1.88271 6.77525 2.12623C5.60739 2.36975 4.53863 2.95588 3.7055 3.80976L3.0305 2.38326L3.02975 2.38251ZM12.9703 13.6175C11.6002 14.833 9.83148 15.5029 8 15.5C3.85775 15.5 0.5 12.1423 0.5 8.00001C0.5 6.40626 0.99725 4.92876 1.84475 3.71376L3.875 8.00001H2C1.99998 9.19299 2.35559 10.3589 3.02141 11.3488C3.68723 12.3387 4.63303 13.1076 5.73798 13.5574C6.84294 14.0071 8.05688 14.1173 9.22475 13.8738C10.3926 13.6303 11.4614 13.0441 12.2945 12.1903L12.9695 13.6168L12.9703 13.6175ZM8.75 9.15126H11V10.6513H8.75V12.1513H7.25V10.6513H5V9.15126H7.25V8.40126H5V6.90126H6.9395L5.348 5.31051L6.41 4.25001L8 5.84076L9.59075 4.25001L10.652 5.31051L9.0605 6.90201H11V8.40201H8.75V9.15201V9.15126Z" fill="#525866" />
                </svg>
              </Button.Icon>
              <span className='text-[14px]'>{t('service.info.price')}</span>
            </div>
            <span className='text-[24px] text-[#0E121B] text-text-strong-950'>
              {formatCurrency(service.price, service.currency || 'USD')}
            </span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='text-[#525866] flex items-center gap-2 mt-[-12px] ml-[1px]'>
              <Button.Icon className="flex-shrink-0">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.5 16.5C0.5 14.9087 1.13214 13.3826 2.25736 12.2574C3.38258 11.1321 4.9087 10.5 6.5 10.5C8.0913 10.5 9.61742 11.1321 10.7426 12.2574C11.8679 13.3826 12.5 14.9087 12.5 16.5H11C11 15.3065 10.5259 14.1619 9.68198 13.318C8.83807 12.4741 7.69347 12 6.5 12C5.30653 12 4.16193 12.4741 3.31802 13.318C2.47411 14.1619 2 15.3065 2 16.5H0.5ZM6.5 9.75C4.01375 9.75 2 7.73625 2 5.25C2 2.76375 4.01375 0.75 6.5 0.75C8.98625 0.75 11 2.76375 11 5.25C11 7.73625 8.98625 9.75 6.5 9.75ZM6.5 8.25C8.1575 8.25 9.5 6.9075 9.5 5.25C9.5 3.5925 8.1575 2.25 6.5 2.25C4.8425 2.25 3.5 3.5925 3.5 5.25C3.5 6.9075 4.8425 8.25 6.5 8.25ZM12.713 11.0273C13.767 11.5019 14.6615 12.2709 15.2889 13.2418C15.9164 14.2126 16.2501 15.344 16.25 16.5H14.75C14.7502 15.633 14.4999 14.7844 14.0293 14.0562C13.5587 13.328 12.8878 12.7512 12.0972 12.3953L12.7123 11.0273H12.713ZM12.197 2.55975C12.9526 2.87122 13.5987 3.40015 14.0533 4.07942C14.5078 4.75869 14.7503 5.55768 14.75 6.375C14.7503 7.40425 14.3658 8.39642 13.6719 9.15662C12.978 9.91682 12.025 10.3901 11 10.4835V8.97375C11.5557 8.89416 12.0713 8.63851 12.471 8.24434C12.8707 7.85017 13.1335 7.33824 13.2209 6.7837C13.3082 6.22916 13.2155 5.66122 12.9563 5.16327C12.6971 4.66531 12.2851 4.26356 11.7808 4.017L12.197 2.55975Z" fill="#525866" />
                </svg>
              </Button.Icon>
              <span className='text-[14px]'>{t('service.info.sold')}</span>
            </div>
            <span className='font-[16px] text-[#0E121B] text-text-strong-950'>
              5
            </span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='text-[#525866] flex items-center gap-2'>
              <Button.Icon className="flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.75 2.25H14.75C14.9489 2.25 15.1397 2.32902 15.2803 2.46967C15.421 2.61032 15.5 2.80109 15.5 3V15C15.5 15.1989 15.421 15.3897 15.2803 15.5303C15.1397 15.671 14.9489 15.75 14.75 15.75H1.25C1.05109 15.75 0.860322 15.671 0.71967 15.5303C0.579018 15.3897 0.5 15.1989 0.5 15V3C0.5 2.80109 0.579018 2.61032 0.71967 2.46967C0.860322 2.32902 1.05109 2.25 1.25 2.25H4.25V0.75H5.75V2.25H10.25V0.75H11.75V2.25ZM10.25 3.75H5.75V5.25H4.25V3.75H2V6.75H14V3.75H11.75V5.25H10.25V3.75ZM14 8.25H2V14.25H14V8.25Z" fill="#525866" />
                </svg>

              </Button.Icon>
              <span className='text-[14px]'>{t('service.info.deadline')}</span>
            </div>
            <span className='text-[14px] text-[#0E121B] text-text-strong-950'>
              05.25.2025
            </span>
          </div>

        </div>

        {/* Action Buttons - Update links/actions */}
        {userProfile?.user_type === 'buyer' && <div className='mb-[24px] grid grid-cols-1 gap-2 sm:grid-cols-2'>
          {/* Message Button - Changed to use onClick */}
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={handleOpenChat}
            disabled={!currentUser || isLoadingChat || !sellerProfile} // Disable conditions
            aria-label={currentUser?.id === service.seller_id ? t('service.info.cannotMessageSelf') : t('service.info.messageSeller')}
            className="border-[#E1E4EA]"
          >
            {isLoadingChat ? (
              <>
                <RiLoader4Line className="animate-spin mr-2" size={16} />
                {t('service.info.opening')}
              </>
            ) : (
              <>
                {t('service.info.message')}

                <Button.Icon className="flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 stroke-current text-[#525866]"
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
                </Button.Icon>
              </>
            )}
          </Button.Root>
          {/* Hire Button */}

          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={handleHireClick}
            className="border-[#E1E4EA]"
            disabled={isSeller || currentUser?.id === service.seller_id}
          >
            {t('service.info.hire')}
            <Button.Icon as={RiArrowRightSLine} />
          </Button.Root>

        </div>}

        {/* Display Chat Error if exists */}
        {chatError && (
          <p className="text-xs text-red-600 mb-4 text-center">Error: {chatError}</p>
        )}

        {/* About Seller Section */}
        {service.seller_bio && (
          <div className="mb-[24px]">
            <h3 className="mb-[10px] text-[14px] font-medium text-text-strong-950">
              {t('service.info.about')}
            </h3>
            <p className="text-text-secondary-600 line-clamp-3 text-paragraph-xs text-[#525866]">
              {service.seller_bio}
            </p>
            {/* social icons: Twitch, Twitter, Google */}
            <div className="mt-[18px] flex items-center gap-3">
              <Button.Icon className="flex-shrink-0">
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8843 7.41288L8.9303 9.3418H5.86088L4.1864 10.9946V9.3418H1.67476V1.35202H10.8843V7.41288ZM0.558062 0.25L0 2.45417V12.3722H2.51193V13.75H3.90687L5.30267 12.3722H7.53492L12 7.96467V0.25H0.558062Z" fill="#6441A5" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.74447 6.86233H5.86074V3.55572H4.74447V6.86233ZM7.81403 6.86233H8.9303V3.55572H7.81403V6.86233Z" fill="#6441A5" />
                </svg>
              </Button.Icon>
              <Button.Icon className="flex-shrink-0">
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.723087 0.25L6.36963 7.69613L0.6875 13.75H1.96642L6.94123 8.44963L10.9606 13.75H15.3125L9.34813 5.88513L14.6371 0.25H13.3582L8.77678 5.13139L5.075 0.25H0.723087ZM2.60379 1.17922H4.60304L13.4315 12.821H11.4323L2.60379 1.17922Z" fill="#010101" />
                </svg>
              </Button.Icon>
              <Button.Icon className="flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.1377 7.77283V10.3869H12.8446C12.6818 11.2276 12.1933 11.9395 11.4607 12.4181L13.6961 14.1179C14.9985 12.9397 15.7499 11.2093 15.7499 9.15358C15.7499 8.67495 15.7061 8.21468 15.6247 7.7729L9.1377 7.77283Z" fill="#4285F4" />
                  <path d="M2.98882 5.97491C2.51922 6.88306 2.25 7.90786 2.25 9.00012C2.25 10.0924 2.51922 11.1172 2.98882 12.0253C2.98882 12.0314 5.28061 10.2826 5.28061 10.2826C5.14286 9.87758 5.06144 9.44806 5.06144 9.00005C5.06144 8.55203 5.14286 8.12251 5.28061 7.71751L2.98882 5.97491Z" fill="#FBBC05" />
                  <path d="M9.13812 4.93774C10.1525 4.93774 11.0542 5.28137 11.7743 5.94411L13.7467 4.01117C12.5507 2.91891 10.9979 2.25 9.13812 2.25C6.44564 2.25 4.12261 3.76569 2.98926 5.9748L5.28098 7.71754C5.82571 6.12206 7.34731 4.93774 9.13812 4.93774Z" fill="#EA4335" />
                  <path d="M5.27802 10.2849L4.77385 10.6631L2.98926 12.0253C4.12261 14.2283 6.4455 15.7501 9.13798 15.7501C10.9976 15.7501 12.5568 15.1487 13.6964 14.1179L11.461 12.4181C10.8474 12.8231 10.0647 13.0685 9.13798 13.0685C7.34717 13.0685 5.82564 11.8842 5.28083 10.2887L5.27802 10.2849Z" fill="#34A853" />
                </svg>
              </Button.Icon>
            </div>
          </div>
        )}


        <div className='mb-[24px] h-px w-full bg-stroke-soft-200'></div>

        {/* Tags Section - Use service.tags and Tag component */}
        {service.tags && service.tags.length > 0 && (
          <div className='mb-[24px]'>
            <h3 className='mb-2 text-[14px] font-medium text-text-strong-950'>
              {t('service.info.skills')}
            </h3>
            <div className='flex flex-wrap gap-1.5'>
              {service.tags.map((tag, index) => (
                <Tag.Root key={index}>
                  {tag}
                </Tag.Root>
              ))}
            </div>
          </div>
        )}

        {/* Tools Section (Dummy Data) - Use Tag component */}
        <div>
          <h3 className='mb-2 text-[14px] font-medium text-text-strong-950'>
            {t('service.info.tools')}
          </h3>
          <div className='flex flex-wrap gap-1.5'>
            {dummyTools.map((tool, index) => (
              <Tag.Root key={index}>
                {tool}
              </Tag.Root>
            ))}
          </div>
        </div>

      </div>

      {/* Conditionally render Chat Popup */}
      {activeChat && currentUserProfile && sellerProfile && currentUser && (
        <ChatPopupWrapper
          key={activeChat.id} // Important for re-rendering if chat changes
          chat={activeChat}
          initialMessages={activeChatMessages}
          currentUserProfile={currentUserProfile}
          otherUserProfile={sellerProfile} // Pass fetched seller profile
          currentUserId={currentUser.id} // Safe now due to check above
          isLoadingMessages={isLoadingMessages} // Pass message loading state
          onClose={handleCloseChat}
          position="bottom-right" // Or configure as needed
        />
      )}
    </div>
  );
}
