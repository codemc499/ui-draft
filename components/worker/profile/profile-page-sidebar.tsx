'use client';

import React, { useState, useEffect } from 'react';
import { Root as Textarea } from '@/components/ui/textarea';
import { userOperations } from '@/utils/supabase/database';
import Link from 'next/link';
import { useNotification } from '@/hooks/use-notification';
import { useTranslation } from 'react-i18next';

import * as Avatar from '@/components/ui/avatar';
import * as Divider from '@/components/ui/divider';
import {
  RiStarFill,
  RiPencilLine,
  RiTwitchFill,
  RiTwitterXFill,
} from '@remixicon/react';
import { cn } from '@/utils/cn';
import * as Tag from '@/components/ui/tag'; // Keep Tag import for tags section
import { User } from '@/utils/supabase/types';
import * as Button from '@/components/ui/button'; // Add Button import
import { ProfileActionButtons } from '../../users/profile/profile-action-buttons'; // Use relative path
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
interface SidebarLinkProps {
  href?: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean; // Add isActive prop for potential future use
  onClick?: () => void;
}

const SidebarLink = ({ href, icon: Icon, label, isActive, onClick }: SidebarLinkProps) => {
  const commonClasses = cn(
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-label-md transition-colors duration-200',
    'text-text-secondary-600 focus:outline-none focus:ring-2 focus:ring-border-focus-base',
    isActive ? 'bg-action-hover-bg-inverse-0 text-text-strong-950' : 'hover:bg-action-hover-bg-inverse-0 hover:text-text-strong-950'
  );

  const content = (
    <>
      <Icon className={cn('size-5', isActive ? 'text-text-strong-950' : 'text-text-secondary-600')} />
      <span className={isActive ? 'font-medium' : ''}>{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={commonClasses}>
        {content}
      </button>
    );
  }
  if (href) {
    return (
      <Link href={href} className={commonClasses}>
        {content}
      </Link>
    );
  }
  return (
    <div className={cn(commonClasses, 'cursor-not-allowed opacity-50')}>
      {content}
    </div>
  );
};

// --- Profile Page Sidebar Props ---
interface ProfilePageSidebarProps {
  userProfile: User;
  currentUser: User | null; // Add currentUser
  isLoadingChat: boolean; // Add isLoadingChat
  onHire: () => void; // Add onHire handler prop
  onMessage: () => void; // Add onMessage handler prop
}

// --- Profile Page Sidebar Component (Renamed) ---
export function ProfilePageSidebar({
  userProfile,
  currentUser,
  isLoadingChat,
  onHire,
  onMessage,
}: ProfilePageSidebarProps) {
  const { notification: toast } = useNotification();
  const { t } = useTranslation('common');

  // Add state for about section editing
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editableBio, setEditableBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [localBio, setLocalBio] = useState('');

  // Update editableBio and localBio state when the userProfile changes
  useEffect(() => {
    if (userProfile?.bio) {
      setLocalBio(userProfile.bio);
      setEditableBio(userProfile.bio);
    } else {
      setLocalBio('');
      setEditableBio('');
    }
  }, [userProfile]);

  // Add handlers for about section editing
  const handleEditBio = () => {
    setEditableBio(localBio);
    setIsEditingBio(true);
  };

  const handleCancelBio = () => {
    setIsEditingBio(false);
  };

  const handleSaveBio = async () => {
    if (!userProfile) return;
    if (editableBio === localBio) {
      setIsEditingBio(false);
      return;
    }
    setIsSaving(true);
    try {
      await userOperations.updateUser(userProfile.id, { bio: editableBio });
      toast({
        title: t('worker.profile.about.savedTitle'),
        description: t('worker.profile.about.savedDescription'),
      });
      setLocalBio(editableBio);
      setIsEditingBio(false);
    } catch (err) {
      console.error(err);
      toast({
        title: t('worker.profile.about.errorTitle'),
        description: t('worker.profile.about.errorDescription'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Use userProfile directly or map to a simpler structure if preferred
  const user = {
    name: userProfile.full_name ?? 'User',
    avatarUrl: userProfile.avatar_url ?? '',
    // Use mock/placeholder rating & reviews until fetched
    rating: 4.9, // Placeholder
    reviews: 125, // Placeholder
  };

  // Mock tags and links as per the image
  const mockAwards = [
    'Grammy',
    'Billboard Music',
    'American Music',
    'BRIT',
    'MTV Music',
    'Eurovision Awards',
  ];

  const cusGoogleIcon = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.2148 12.0911V16.1575H19.9811C19.7279 17.4652 18.9681 18.5725 17.8285 19.317L21.3057 21.9612C23.3317 20.1285 24.5006 17.4366 24.5006 14.2389C24.5006 13.4944 24.4324 12.7784 24.3057 12.0912L14.2148 12.0911Z"
        fill="#4285F4"
      />
      <path
        d="M4.64927 9.29431C3.91879 10.707 3.5 12.3011 3.5 14.0002C3.5 15.6993 3.91879 17.2934 4.64927 18.7061C4.64927 18.7155 8.21429 15.9951 8.21429 15.9951C8 15.3651 7.87334 14.697 7.87334 14.0001C7.87334 13.3032 8 12.635 8.21429 12.005L4.64927 9.29431Z"
        fill="#FBBC05"
      />
      <path
        d="M14.2133 7.68093C15.7913 7.68093 17.1939 8.21546 18.314 9.24639L21.3822 6.2396C19.5218 4.54053 17.1063 3.5 14.2133 3.5C10.025 3.5 6.41143 5.85774 4.64844 9.29413L8.21334 12.0051C9.0607 9.5232 11.4276 7.68093 14.2133 7.68093Z"
        fill="#EA4335"
      />
      <path
        d="M8.20873 15.9987L7.42447 16.587L4.64844 18.7061C6.41143 22.1329 10.0248 24.5002 14.2131 24.5002C17.1059 24.5002 19.5312 23.5647 21.304 21.9611L17.8267 19.317C16.8722 19.947 15.6546 20.3288 14.2131 20.3288C11.4274 20.3288 9.06058 18.4866 8.21311 16.0047L8.20873 15.9987Z"
        fill="#34A853"
      />
    </svg>
  )

  const socialLinks = [
    { platform: 'twitch', icon: RiTwitchFill, color: '#6441A5', href: '#' },
    { platform: 'twitter', icon: RiTwitterXFill, color: '#000000', href: '#' },
    { platform: 'google', icon: cusGoogleIcon, color: '#DB4437', href: '#' }, // Example color
  ];

  // --- Mock State & Handlers for Buttons/Reviews --- 
  const chatError = null; // Mock chat error state
  const reviewAvatars = [
    'https://i.pravatar.cc/40?img=32',
    'https://i.pravatar.cc/40?img=45',
    'https://i.pravatar.cc/40?img=12',
  ]; // Mock review avatars

  const handleHireMeClick = () => {
    toast({
      title: t('worker.profile.actions.hireSuccess'),
      description: t('worker.profile.actions.hireSuccessDesc', { name: userProfile.full_name || userProfile.username })
    });
  };
  const handleOpenChat = () => {
    toast({
      title: t('worker.profile.actions.touchClicked'),
      description: t('worker.profile.actions.touchClickedDesc', { name: userProfile.full_name || userProfile.username })
    });
  };
  // --- End Mock State & Handlers ---

  return (
    <aside className='hidden w-[352px] max-w-[352px] shrink-0 lg:block'>
      <div className='sticky top-20 flex flex-col gap-[16px] border border-stroke-soft-200 bg-bg-white-0  rounded-[20px] pb-6 shadow-[0_2px_4px_0_rgba(14,18,27,0.03),0_6px_10px_0_rgba(14,18,27,0.06)]'>
        {/* Wrapper Div from UserSidebar */}
        <div className="flex flex-col max-w-[352px] max-h-[328px] p-[16px] gap-[16px]">
          {/* Profile Section */}
          <div className='flex flex-col items-center gap-1 text-center p-[16px]'>
            {user.avatarUrl && user.avatarUrl !== "" ?
              <Avatar.Root size='80'>
                <Avatar.Image src={user.avatarUrl} alt={user.name} />
                <Avatar.Indicator position='bottom'>
                  <Avatar.Status status='online' />
                </Avatar.Indicator>
              </Avatar.Root>
              :
              <Avatar.Root size='80' color='yellow'>{user.name.charAt(0).toUpperCase()}</Avatar.Root> // Matched size
            }
            <div className='text-center'>
              <h2 className='text-[#0E121B] text-[16px] font-medium'> {/* Matched size/weight */}
                {user.name}
              </h2>
              <div className='text-[#525866] flex items-center justify-center gap-0.5 text-[12px] mb-[8px]'>
                <RiStarFill className='size-4 text-yellow-400' />
                <span className='text-text-secondary-600 text-paragraph-xs'> {/* Kept original styling for rating */}
                  {user.rating}({t('worker.profile.reviews', { count: user.reviews })})
                </span>
              </div>
            </div>
            <div className='flex items-center justify-center gap-3'> {/* Updated Google icons/text */}
              <div className='flex items-center justify-center gap-1.5'>
                <Button.Icon className="flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.00015 11.4999C9.93325 11.4999 11.5003 9.93274 11.5003 7.99964C11.5003 6.06654 9.93325 4.49942 8.00015 4.49942C6.06704 4.49942 4.5 6.06654 4.5 7.99964C4.5 9.93274 6.06704 11.4999 8.00015 11.4999Z" fill="white" />
                    <path d="M4.96887 9.75055L1.93811 4.5011C1.32358 5.56517 1 6.77226 1 8.0011C1 9.22994 1.32343 10.437 1.93789 11.5011C2.55235 12.5652 3.43615 13.4488 4.50037 14.063C5.56459 14.6771 6.77182 15.0004 8.00059 15L11.0313 9.75055V9.74974C10.7244 10.2821 10.2826 10.7242 9.75055 11.0316C9.21848 11.339 8.61485 11.5009 8.00036 11.501C7.38588 11.5011 6.7822 11.3394 6.25004 11.0322C5.71788 10.7249 5.27602 10.2829 4.96887 9.75069V9.75055Z" fill="#229342" />
                    <path d="M11.0319 9.75033L8.00125 14.9998C9.23002 15 10.4372 14.6766 11.5013 14.0623C12.5655 13.4479 13.4491 12.5642 14.0634 11.5C14.6777 10.4358 15.001 9.22862 15.0008 7.99985C15.0006 6.77109 14.6769 5.564 14.0622 4.5H8.00073L8 4.50052C8.61449 4.50022 9.21822 4.66173 9.75048 4.9688C10.2828 5.27592 10.7247 5.71767 11.0321 6.24982C11.3394 6.78195 11.5012 7.38562 11.5012 8.00012C11.5012 8.61462 11.3394 9.21829 11.032 9.7504L11.0319 9.75033Z" fill="#FBC116" />
                    <path d="M7.99949 10.7714C9.52986 10.7714 10.7705 9.53082 10.7705 8.00037C10.7705 6.46993 9.52986 5.2294 7.99949 5.2294C6.46911 5.2294 5.22852 6.47 5.22852 8.00037C5.22852 9.53075 6.46911 10.7714 7.99949 10.7714Z" fill="#1A73E8" />
                    <path d="M7.99946 4.50022H14.0609C13.4467 3.436 12.5631 2.5522 11.4989 1.93774C10.4348 1.32333 9.22771 0.999907 7.99895 1C6.77018 1.00007 5.5631 1.32366 4.4991 1.93826C3.43506 2.55283 2.55158 3.43671 1.9375 4.50103L4.96826 9.75048L4.96907 9.75092C4.66157 9.21889 4.49957 8.61527 4.49938 8.00077C4.49919 7.38627 4.6608 6.78255 4.96797 6.25033C5.27509 5.71811 5.71706 5.27613 6.24921 4.96894C6.78135 4.66175 7.38508 4.5 7.99961 4.50015L7.99946 4.50022Z" fill="#E33B2E" />
                  </svg>
                </Button.Icon>
                <span className="text-[12px] text-[#525866]">{t('worker.profile.google')}</span>
              </div>
            </div>
          </div>
          {/* Removed Action Buttons */}

          {/* ADD ACTION BUTTONS COMPONENT */}
          <ProfileActionButtons
            targetUser={userProfile}
            currentUser={currentUser}
            isLoadingChat={isLoadingChat}
            onHire={onHire} // Pass down the prop
            onMessage={onMessage} // Pass down the prop
          />

          {/* Recent Reviews Section */}
          <div> {/* Original wrapper */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between"> {/* Removed mb-2 */}
              <div className="hover:bg-[#F5F7FA] rounded-lg text-[#0A0D14] hover:text-[#525866] flex items-center gap-1 font-medium text-text-strong-950 px-[12px] py-[10px]"> {/* Removed text-label-md */}
                {/* Inline SVG Star */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5"> {/* Changed size-4 back to size-5 and reverted width/height */}
                  <path d="M11.4416 2.92501L12.9083 5.85835C13.1083 6.26668 13.6416 6.65835 14.0916 6.73335L16.7499 7.17501C18.4499 7.45835 18.8499 8.69168 17.6249 9.90835L15.5583 11.975C15.2083 12.325 15.0166 13 15.1249 13.4833L15.7166 16.0417C16.1833 18.0667 15.1083 18.85 13.3166 17.7917L10.8249 16.3167C10.3749 16.05 9.63326 16.05 9.17492 16.3167L6.68326 17.7917C4.89992 18.85 3.81659 18.0583 4.28326 16.0417L4.87492 13.4833C4.98326 13 4.79159 12.325 4.44159 11.975L2.37492 9.90835C1.15826 8.69168 1.54992 7.45835 3.24992 7.17501L5.90826 6.73335C6.34992 6.65835 6.88326 6.26668 7.08326 5.85835L8.54992 2.92501C9.34992 1.33335 10.6499 1.33335 11.4416 2.92501Z" fill="#0A0D14" stroke="#0A0D14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span className="text-[14px] ml-[5px]">{t('worker.profile.recentReviews')}</span> {/* Changed text-sm to text-xs */}
              </div>
              {/* Right section - Avatars (Styled) */}
              <AvatarGroupDemo />
            </div>
          </div>
          {/* Sections outside the wrapper */}
          <Divider.Root />
        </div> {/* End Wrapper Div */}


        {/* Skills Section - NEW (Based on original ProfileSidebar structure) */}
        <div className='px-4'>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='text-[#0E121B] text-[16px]'>
              {t('worker.profile.skills')}
            </h3>
            {/* TODO: Implement edit functionality later */}
            <button className='text-icon-secondary-400 hover:text-icon-primary-500'>
              <RiPencilLine className='size-4 text-[#99A0AE]' />
            </button>
          </div>
          <div className='space-y-2 text-[12px]'>
            {/* Mock Skills Data - Add actual data source later */}
            {[
              { name: 'Singer', details: 'Female', price: '$150 per song' },
              { name: 'Songwriter', details: 'Lyric', contactForPricing: true },
              {
                name: 'Top-line writer',
                details: 'vocal melody',
                contactForPricing: true,
              },
              { name: 'Vocal Tuning', details: '', contactForPricing: true },
            ].map((skill, idx) => (
              <div key={idx}>
                <p className='text-[12px] font-medium text-text-strong-950'>
                  {skill.name}
                  {skill.details ? ` - ${skill.details}` : ''}
                </p>
                {skill.price && (
                  <p className='text-[12px] text-[#525866]'>{skill.price}</p>
                )}
                {skill.contactForPricing && (
                  <p className='text-[12px] text-[#525866]'>
                    Contact for pricing
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <Divider.Root />

        {/* Awards Section - Styled like Tags section */}
        <div className='px-4 max-w-[352px] max-h-[116px]'>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='text-text-strong-950 text-[#0E121B] text-[14px]'>
              {t('worker.profile.awards')}
            </h3>
            <button className='text-icon-secondary-400 hover:text-icon-primary-500'>
              <RiPencilLine className='size-4 text-[#99A0AE]' />
            </button>
          </div>
          <div className='flex flex-wrap gap-1.5'>
            {mockAwards.map((award, idx) => (
              <Tag.Root key={idx} className="bg-white rounded-md border border-stroke-soft-300 text-gray-600 px-2 py-0.5">
                {award}
              </Tag.Root>
            ))}
          </div>
        </div>
        <Divider.Root />

        {/* Combined About and Social Links Section - Copied from UserSidebar styles */}
        <div className="flex flex-col max-w-[352px] pb-4 px-4 gap-5">
          {/* About Content */}
          <div className='flex items-center justify-between'>
            <h3 className='text-text-strong-950 text-[14px] font-semibold'>
              {t('worker.profile.about.title')}
            </h3>
            {currentUser?.id === userProfile.id && !isEditingBio && (
              <button
                onClick={handleEditBio}
                className='text-icon-secondary-400 hover:text-icon-primary-500'
                aria-label={t('worker.profile.about.edit')}
                disabled={isSaving}
              >
                <RiPencilLine className='size-4 text-[#99A0AE]' />
              </button>
            )}
          </div>
          {isEditingBio ? (
            <div className="space-y-2">
              <Textarea
                value={editableBio}
                onChange={(e) => setEditableBio(e.target.value)}
                placeholder={t('worker.profile.about.placeholder')}
                rows={4}
                className="text-sm"
                disabled={isSaving}
              />
              <div className="flex justify-end space-x-2">
                <Button.Root
                  variant="neutral"
                  mode="stroke"
                  size="small"
                  onClick={handleCancelBio}
                  disabled={isSaving}
                >
                  {t('sidebar.cancel')}
                </Button.Root>
                <Button.Root
                  variant="primary"
                  size="small"
                  onClick={handleSaveBio}
                  disabled={isSaving || editableBio === localBio}
                >
                  {isSaving ? t('sidebar.saving') : t('sidebar.save')}
                </Button.Root>
              </div>
            </div>
          ) : (
            <p className='line-clamp-5 font-normal text-[12px] leading-4 tracking-normal text-[#525866]'>
              {localBio || t('worker.profile.noBio')}
            </p>
          )}

          {/* Social Links */}
          <div className='flex items-center gap-3'>
            {socialLinks.map(({ platform, icon: Icon, color, href }) => (
              <Link
                key={platform}
                href={href}
                className='text-icon-secondary-400 hover:opacity-80'
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className='size-7' style={{ color: color }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
} 