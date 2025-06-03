// components/order/OrderSidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Avatar from '@/components/ui/avatar';
import * as AvatarGroup from '@/components/ui/avatar-group';
import * as Divider from '@/components/ui/divider';
import * as Button from '@/components/ui/button';
import * as Badge from '@/components/ui/badge';
import { Root as Textarea } from '@/components/ui/textarea';
import {
  RiStarFill,
  RiStarSFill,
  RiHeart3Line,
  RiHeart3Fill,
  RiSendPlane2Fill,
  RiPencilLine,
  RiTwitchFill,
  RiTwitterXFill,
  RiGoogleFill,
} from '@remixicon/react';
import { useTranslation } from 'react-i18next';
import { notification as toast } from '@/hooks/use-notification';
import { userOperations } from '@/utils/supabase/database';
import { User } from '@/utils/supabase/types';

interface OrderSidebarProps {
  /** Seller being displayed */
  userProfile: User | null;
  /** Logged‑in user (to decide if editing is allowed) */
  currentUser?: User | null;
}

export default function OrderSidebar({
  userProfile,
  currentUser,
}: OrderSidebarProps) {
  const { t } = useTranslation('common');
  const [isFollowing, setIsFollowing] = useState(false);

  /* --- editable‑bio state --- */
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(userProfile?.bio ?? '');
  const [editableBio, setEditableBio] = useState(bio);
  const [isSaving, setIsSaving] = useState(false);

  /* sync when prop changes */
  useEffect(() => {
    const initial = userProfile?.bio ?? '';
    setBio(initial);
    setEditableBio(initial);
  }, [userProfile?.bio]);

  const canEdit =
    !!currentUser && !!userProfile && currentUser.id === userProfile.id;

  /* ---- handlers ---- */
  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setEditableBio(bio);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!userProfile) return;
    if (editableBio === bio) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await userOperations.updateUser(userProfile.id, { bio: editableBio });
      toast({
        title: t('worker.profile.about.savedTitle'),
        description: t('worker.profile.about.savedDescription'),
      });
      setBio(editableBio);
      setIsEditing(false);
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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      toast({ description: t('orderSidebar.followed', { name: displayName }) });
    } else {
      toast({ description: t('orderSidebar.unfollowed', { name: displayName }) });
    }
  };

  /* --- placeholder fallbacks (for mocks / loading) --- */
  const displayName = userProfile?.full_name || 'Cleve Music';
  const avatarUrl = userProfile?.avatar_url || 'https://via.placeholder.com/80';
  const rating = 4.9;
  const reviews = 125;
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
    <aside className="hidden w-full max-w-[352px] shrink-0 lg:block">
      <div className="sticky top-20 flex flex-col gap-4 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-sm">
        {/* ---------- Profile ---------- */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar.Root size="80" className="relative">
            <Avatar.Image src={avatarUrl} alt={displayName} />
            <Avatar.Indicator position="bottom">
              <Avatar.Status status="online" />
            </Avatar.Indicator>
          </Avatar.Root>

          <div>
            <h2 className="text-label-lg font-medium text-text-strong-950">
              {displayName}
            </h2>
            <div className="mt-1 flex items-center justify-center gap-1">
              <RiStarFill className="size-3.5 text-yellow-400" />
              <span className="text-paragraph-xs text-text-secondary-600">
                {rating} ({reviews})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <RiGoogleFill className="size-5 text-text-sub-600" />
            {t('orderSidebar.google')}
            <RiGoogleFill className="size-5 text-text-sub-600" />
            {t('orderSidebar.google')}
          </div>
        </div>

        {/* ---------- Follow / Touch buttons ---------- */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <Button.Root
            variant="neutral"
            mode="stroke"
            size="xsmall"
            className="flex h-[32px] w-[85px] items-center justify-center gap-[6px] rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-2 shadow-sm"
            onClick={handleFollow}
          >
            <span className="text-paragraph-xs">
              {t('orderSidebar.follow')}
            </span>
            <Button.Icon as={isFollowing ? RiHeart3Fill : RiHeart3Line} className={`size-[18px] ${isFollowing ? 'text-red-500' : ''}`} />
          </Button.Root>

          <Button.Root
            variant="neutral"
            mode="filled"
            size="xsmall"
            className="flex h-[32px] w-[83px] items-center justify-center gap-[6px] rounded-lg border border-[#242628] bg-[#20232D] px-2 shadow-md"
          >
            <span className="text-paragraph-xs text-bg-white-0">
              {t('orderSidebar.touch')}
            </span>
            <Button.Icon as={RiSendPlane2Fill} className="size-[18px]" />
          </Button.Root>
        </div>

        {/* ---------- Recent reviews ---------- */}
        <div>
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1 text-label-md font-medium text-text-strong-950">
              <RiStarSFill className="size-6" />
              <span>{t('orderSidebar.recentReviews')}</span>
            </div>

            <div className="mt-1 flex items-center gap-2 sm:mt-0">
              <AvatarGroup.Root size="24">
                {reviewAvatars.map((src) => (
                  <Avatar.Root key={src} size="24">
                    <Avatar.Image src={src} />
                  </Avatar.Root>
                ))}
              </AvatarGroup.Root>
              <span className="text-paragraph-xs text-text-secondary-600">
                +4
              </span>
            </div>
          </div>
        </div>

        <Divider.Root />

        {/* ---------- Tags ---------- */}
        <div>
          <h3 className="mb-2 text-label-md font-medium text-text-strong-950">
            {t('orderSidebar.tags')}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge.Root
                key={tag}
                variant="light"
                size="medium"
                className="rounded-md border border-stroke-soft-300 bg-white px-2 py-0.5 text-gray-600"
              >
                {tag}
              </Badge.Root>
            ))}
          </div>
        </div>

        <Divider.Root />

        {/* ---------- About (editable) ---------- */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-label-md font-medium text-text-strong-950">
              {t('orderSidebar.about')}
            </h3>
            {canEdit && !isEditing && (
              <button
                onClick={handleEdit}
                className="text-icon-secondary-400 hover:text-icon-primary-500"
                aria-label={t('worker.profile.about.edit')}
              >
                <RiPencilLine className="size-4" />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editableBio}
                onChange={(e) => setEditableBio(e.target.value)}
                rows={4}
                disabled={isSaving}
              />
              <div className="flex justify-end gap-2">
                <Button.Root
                  variant="neutral"
                  mode="stroke"
                  size="xsmall"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  {t('sidebar.cancel')}
                </Button.Root>
                <Button.Root
                  variant="primary"
                  size="xsmall"
                  onClick={handleSave}
                  disabled={isSaving || editableBio === bio}
                >
                  {isSaving ? t('sidebar.saving') : t('sidebar.save')}
                </Button.Root>
              </div>
            </div>
          ) : (
            <p className="line-clamp-5 text-paragraph-sm text-gray-600">
              {bio.trim() || t('worker.profile.noBio')}
            </p>
          )}
        </div>

        {/* ---------- Social links ---------- */}
        <div className="flex items-center gap-3 border-t border-stroke-soft-200 pt-4">
          <Link
            href="#"
            className="text-icon-secondary-400 hover:text-icon-primary-500"
          >
            <RiTwitchFill className="size-5" />
          </Link>
          <Link
            href="#"
            className="text-icon-secondary-400 hover:text-icon-primary-500"
          >
            <RiTwitterXFill className="size-5" />
          </Link>
          <Link
            href="#"
            className="text-icon-secondary-400 hover:text-icon-primary-500"
          >
            <RiGoogleFill className="size-5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
