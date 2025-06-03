// components/worker/profile/AboutSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { RiPencilLine } from '@remixicon/react';
import { useTranslation } from 'react-i18next';
import { Root as Textarea } from '@/components/ui/textarea';
import { Root as Button } from '@/components/ui/button';
import { notification as toast } from '@/hooks/use-notification';
import { userOperations } from '@/utils/supabase/database';
import { User } from '@/utils/supabase/types';
import { useAuth } from '@/utils/supabase/AuthContext';

interface AboutSectionProps {
  userProfile: User;
  /** Called after a successful save to allow parent to re-fetch or update state */
  onSaved?: () => void;
}

export function AboutSection({ userProfile, onSaved }: AboutSectionProps) {
  const { t } = useTranslation('common');

  const { user } = useAuth();

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(userProfile.bio ?? '');
  const [editableBio, setEditableBio] = useState(bio);
  const [isSaving, setIsSaving] = useState(false);

  // Sync with incoming prop
  useEffect(() => {
    const initialBio = userProfile.bio ?? '';
    setBio(initialBio);
    setEditableBio(initialBio);
  }, [userProfile.bio]);

  // Handlers
  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setEditableBio(bio);
    setIsEditing(false);
  };

  const handleSave = async () => {
    // nothing changed
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
      onSaved?.();
    } catch (error) {
      console.error('Error updating bio:', error);
      toast({
        title: t('worker.profile.about.errorTitle'),
        description: t('worker.profile.about.errorDescription'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[20px] font-semibold">
          {t('worker.profile.about.title')}
        </h3>
        {user?.id === userProfile.id && !isEditing && (
          <button
            onClick={handleEdit}
            className="text-icon-secondary-400 hover:text-icon-primary-500"
            aria-label={t('worker.profile.about.edit')}
            disabled={isSaving}
          >
            <RiPencilLine className="size-5 text-gray-600" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="mt-2 space-y-2">
          <Textarea
            value={editableBio}
            onChange={(e) => setEditableBio(e.target.value)}
            rows={4}
            disabled={isSaving}
            className="text-paragraph-sm"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="neutral"
              mode="stroke"
              size="small"
              onClick={handleCancel}
              disabled={isSaving}
            >
              {t('sidebar.cancel')}
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? t('sidebar.saving') : t('sidebar.save')}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 line-clamp-5 text-paragraph-sm mt-2">
          {bio.trim() || t('worker.profile.noBio')}
        </p>
      )}
    </div>
  );
}
