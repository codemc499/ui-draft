'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import * as Avatar from '@/components/ui/avatar';
import * as Divider from '@/components/ui/divider';
import { Root as Button } from '@/components/ui/button';
import { Root as Textarea } from '@/components/ui/textarea';
import { notification as toast } from '@/hooks/use-notification';
import {
  RiStarFill,
  RiHomeLine,
  RiFileList2Line,
  RiBriefcaseLine,
  RiChat1Line,
  RiBuildingLine,
  RiCouponLine,
  RiQuestionLine,
  RiArticleLine,
  RiPencilLine,
  RiTwitchFill,
  RiTwitterXFill,
  RiGoogleFill,
} from '@remixicon/react';
import SidebarLink from './SidebarLink';
import { User } from '@/utils/supabase/types';
import { userOperations } from '@/utils/supabase/database';

// Define props for Sidebar
interface SidebarProps {
  userProfile: User | null;
}

// Sidebar Component
const Sidebar = ({ userProfile }: SidebarProps) => {
  const { t } = useTranslation('common');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editableBio, setEditableBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [localBio, setLocalBio] = useState('');

  // Original static data for elements not replaced by userProfile
  const placeholderData = {
    name: 'Cleve Music',
    rating: 4.9,
    reviews: 125,
    about:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer too",
  };

  // Use real data if available, otherwise use placeholder or default
  const displayName = userProfile?.full_name || placeholderData.name;
  const displayAvatar = userProfile?.avatar_url;
  const displayBio = localBio || userProfile?.bio || placeholderData.about;

  // Update editableBio and localBio state when the userProfile changes
  useEffect(() => {
    if (userProfile?.bio) {
      setLocalBio(userProfile.bio);
      setEditableBio(userProfile.bio);
    } else {
      setLocalBio(placeholderData.about);
      setEditableBio(placeholderData.about);
    }
  }, [userProfile]);

  // Function to get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleEditClick = () => {
    setEditableBio(displayBio);
    setIsEditingBio(true);
  };

  const handleCancelClick = () => {
    setIsEditingBio(false);
  };

  const handleSaveClick = async () => {
    if (!userProfile) {
      toast({ title: "Error", description: "User not found." });
      return;
    }
    if (editableBio === displayBio) {
      setIsEditingBio(false);
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser = await userOperations.updateUser(userProfile.id, { bio: editableBio });
      if (updatedUser) {
        toast({ title: "Success", description: "Bio updated successfully." });
        setLocalBio(editableBio); // Update local state immediately
        setIsEditingBio(false);
      } else {
        throw new Error('Update operation returned null.');
      }
    } catch (error) {
      console.error("Error saving bio:", error);
      toast({ title: "Error", description: "Failed to save bio. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Notification Handler --- 
  const handleComingSoonClick = () => {
    toast({
      title: t('sidebar.comingSoon.title'),
      description: t('sidebar.comingSoon.description'),
    });
  };
  // --- End Notification Handler ---

  return (
    <aside className='hidden w-[300px] shrink-0 lg:block'>
      <div className='sticky top-20 flex flex-col border border-stroke-soft-200 bg-bg-white-0 pb-5 mb-6 shadow-[0_2px_4px_0_rgba(14,18,27,0.03),0_6px_10px_0_rgba(14,18,27,0.06)] rounded-[20px]'>
        {' '}
        {/* Profile Section */}
        <div className='flex flex-col items-center gap-2 pt-8 px-4 max-w-[300px] max-h-[228px]'>
          {displayAvatar ? (
            <Avatar.Root size='80'>
              <Avatar.Image src={displayAvatar} alt={displayName} />
              <Avatar.Indicator position='bottom'>
                <Avatar.Status status='online' />
              </Avatar.Indicator>
            </Avatar.Root>
          ) : (
            <Avatar.Root size='80' color='yellow'>
              {getInitials(displayName)}
            </Avatar.Root>
          )}
          <div className='text-center'>
            <h2 className='text-[16px] font-md text-[#525866];
]'>
              {displayName}
            </h2>
            <div className='text-text-secondary-600 mt-1 flex items-center justify-center gap-1 text-paragraph-sm'>
              <RiStarFill className='size-4 text-yellow-500' />
              <span className='text-[14px] text-[#525866]'>
                {placeholderData.rating} ({placeholderData.reviews})
              </span>
            </div>
          </div>
          {/* Static Google Icons */}
          <div className='flex items-center  font-medium gap-2 '>
            <div className='flex flex-row items-center px-1 gap-1 text-[#525866] hover:bg-[#F6F8FA] hover:text-text-strong-950'>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.14258 6.72729V9.4382H11.9868C11.818 10.31 11.3114 11.0482 10.5517 11.5446L12.8699 13.3073C14.2205 12.0855 14.9998 10.291 14.9998 8.15918C14.9998 7.66283 14.9543 7.18551 14.8699 6.72737L8.14258 6.72729Z" fill="#4285F4" />
                <path d="M4.13966 9.33234L3.61681 9.72456L1.76611 11.1373C2.94145 13.4218 5.35039 15 8.14261 15C10.0712 15 11.688 14.3763 12.8699 13.3073L10.5517 11.5445C9.91532 11.9645 9.10362 12.2191 8.14261 12.2191C6.28545 12.2191 4.70756 10.9909 4.14258 9.33638L4.13966 9.33234Z" fill="#34A853" />
                <path d="M1.76619 4.86285C1.27919 5.80463 1 6.86737 1 8.00007C1 9.13278 1.27919 10.1955 1.76619 11.1373C1.76619 11.1436 4.14288 9.33003 4.14288 9.33003C4.00002 8.91003 3.91558 8.46461 3.91558 8C3.91558 7.5354 4.00002 7.08997 4.14288 6.66997L1.76619 4.86285Z" fill="#FBBC05" />
                <path d="M8.14275 3.78726C9.19473 3.78726 10.1298 4.14361 10.8766 4.83089L12.922 2.82638C11.6817 1.69368 10.0714 1 8.14275 1C5.35054 1 2.94145 2.57181 1.76611 4.86272L4.14273 6.66999C4.70764 5.01543 6.2856 3.78726 8.14275 3.78726Z" fill="#EA4335" />
              </svg>
              <span className="text-[12px]">Google</span>
            </div>
            <div className='flex flex-row items-center px-1 gap-1 text-[#525866] hover:bg-[#F6F8FA] hover:text-text-strong-950'>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.14258 6.72729V9.4382H11.9868C11.818 10.31 11.3114 11.0482 10.5517 11.5446L12.8699 13.3073C14.2205 12.0855 14.9998 10.291 14.9998 8.15918C14.9998 7.66283 14.9543 7.18551 14.8699 6.72737L8.14258 6.72729Z" fill="#4285F4" />
                <path d="M4.13966 9.33234L3.61681 9.72456L1.76611 11.1373C2.94145 13.4218 5.35039 15 8.14261 15C10.0712 15 11.688 14.3763 12.8699 13.3073L10.5517 11.5445C9.91532 11.9645 9.10362 12.2191 8.14261 12.2191C6.28545 12.2191 4.70756 10.9909 4.14258 9.33638L4.13966 9.33234Z" fill="#34A853" />
                <path d="M1.76619 4.86285C1.27919 5.80463 1 6.86737 1 8.00007C1 9.13278 1.27919 10.1955 1.76619 11.1373C1.76619 11.1436 4.14288 9.33003 4.14288 9.33003C4.00002 8.91003 3.91558 8.46461 3.91558 8C3.91558 7.5354 4.00002 7.08997 4.14288 6.66997L1.76619 4.86285Z" fill="#FBBC05" />
                <path d="M8.14275 3.78726C9.19473 3.78726 10.1298 4.14361 10.8766 4.83089L12.922 2.82638C11.6817 1.69368 10.0714 1 8.14275 1C5.35054 1 2.94145 2.57181 1.76611 4.86272L4.14273 6.66999C4.70764 5.01543 6.2856 3.78726 8.14275 3.78726Z" fill="#EA4335" />
              </svg>
              <span className="text-[12px]">Google</span>
            </div>
          </div>
        </div>
        <Divider.Root className="mt-[2rem] mb-[16px]" />
        {/* Navigation Section */}
        <nav className='px-4 max-w-[300px]  '>
          <ul className='flex flex-col gap-1'>
            <li><SidebarLink href={`/${i18n.language}/home`} icon={RiHomeLine} label={t('sidebar.navigation.home')} /></li>
            <li><SidebarLink href={`/${i18n.language}/settings`} icon={RiBriefcaseLine} label={t('sidebar.navigation.order')} /></li>
            <li><SidebarLink href={`/${i18n.language}/chats`} icon={RiBuildingLine} label={t('sidebar.navigation.chat')} /></li>
            <li><SidebarLink onClick={handleComingSoonClick} icon={RiBuildingLine} label={t('sidebar.navigation.bonus')} /></li>
            <li><SidebarLink onClick={handleComingSoonClick} icon={RiArticleLine} label={t('sidebar.navigation.helpCenter')} /></li>
          </ul>
        </nav>
        <Divider.Root className="mt-[2rem] mb-[16px]" />
        {/* About Section */}
        <div className='px-4 max-w-[300px]  flex flex-col'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-[14px] text-[#525866]  font-medium'>{t('sidebar.about')}</h3>
            {!isEditingBio && (
              <button
                onClick={handleEditClick}
                className='text-[#99A0AE] hover:text-icon-primary-500 disabled:opacity-50'
                disabled={!userProfile}
                aria-label={t('sidebar.editBio')}
              >
                <RiPencilLine className='size-5' />
              </button>
            )}
          </div>
          {
            isEditingBio ? (
              <div className="space-y-2">
                <Textarea
                  value={editableBio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditableBio(e.target.value)} // Added type for event
                  placeholder={t('sidebar.bioPlaceholder')}
                  rows={4}
                  className="text-sm"
                  disabled={isSaving}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="neutral"
                    mode="stroke"
                    size="small"
                    onClick={handleCancelClick}
                    disabled={isSaving}
                  >
                    {t('sidebar.cancel')}
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleSaveClick}
                    disabled={isSaving || editableBio === displayBio}
                  >
                    {isSaving ? t('sidebar.saving') : t('sidebar.save')}
                  </Button>
                </div>
              </div>
            ) : (
              <p className='text-[12px] text-[#525866]'>
                {displayBio}
              </p>
            )
          }
          {/* Static Social Icons */}
          <div className='flex items-center gap-3 mt-4'>
            <Link href='#' className='text-icon-secondary-400 hover:text-icon-primary-500'>
              <RiTwitchFill className='size-7 text-[#6441A5]' />
            </Link>
            <Link href='#' className='text-icon-secondary-400 hover:text-icon-primary-500'>
              <RiTwitterXFill className='size-7' />
            </Link>
            <Link href='#' className='text-icon-secondary-400 hover:text-icon-primary-500'>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.2144 12.0911V16.1575H19.9806C19.7274 17.4652 18.9676 18.5725 17.828 19.317L21.3052 21.9612C23.3312 20.1285 24.5001 17.4366 24.5001 14.2389C24.5001 13.4944 24.4319 12.7784 24.3052 12.0912L14.2144 12.0911Z" fill="#4285F4" />
                <path d="M4.64927 9.29431C3.91879 10.707 3.5 12.3011 3.5 14.0002C3.5 15.6993 3.91879 17.2934 4.64927 18.7061C4.64927 18.7155 8.21429 15.9951 8.21429 15.9951C8 15.3651 7.87334 14.697 7.87334 14.0001C7.87334 13.3032 8 12.635 8.21429 12.005L4.64927 9.29431Z" fill="#FBBC05" />
                <path d="M14.2143 7.68093C15.7923 7.68093 17.1949 8.21546 18.315 9.24639L21.3832 6.2396C19.5228 4.54053 17.1072 3.5 14.2143 3.5C10.026 3.5 6.41241 5.85774 4.64941 9.29413L8.21432 12.0051C9.06168 9.5232 11.4286 7.68093 14.2143 7.68093Z" fill="#EA4335" />
                <path d="M8.20971 15.9987L7.42545 16.587L4.64941 18.7061C6.41241 22.1329 10.0258 24.5002 14.2141 24.5002C17.1069 24.5002 19.5322 23.5647 21.305 21.9611L17.8277 19.317C16.8732 19.947 15.6556 20.3288 14.2141 20.3288C11.4284 20.3288 9.06156 18.4866 8.21409 16.0047L8.20971 15.9987Z" fill="#34A853" />
              </svg>
            </Link>
          </div>
        </div >
      </div >
    </aside >
  );
};

export default Sidebar;
