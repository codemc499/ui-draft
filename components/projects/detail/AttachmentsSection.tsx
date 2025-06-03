'use client';

import React from 'react';
import { RiPauseCircleLine, RiPlayCircleFill, RiDownload2Line } from '@remixicon/react';
import { BaseFileData, User, MusicItem } from '@/utils/supabase/types';
import { useAudioPlayer } from '@/contexts/AudioContext';
import { useTranslation } from 'react-i18next';

// Updated props to use BaseFileData and accept client info
interface AttachmentsSectionProps {
  attachments: BaseFileData[];
  client: User | null;
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  attachments,
  client,
}) => {
  const { t } = useTranslation('common');
  const { loadTrack, togglePlayPause, currentTrack, isPlaying } = useAudioPlayer();

  if (!attachments || attachments.length === 0) return null;

  const handlePlayAudio = (attachment: BaseFileData) => {
    if (!client) {
      console.error('Client information is missing, cannot play audio.');
      return;
    }

    const trackData: MusicItem = {
      url: attachment.url,
      title: attachment.name,
    };

    const sellerInfo = {
      name: client.full_name ?? t('projects.attachments.unknownUser'),
      avatarUrl: client.avatar_url ?? null,
    };

    if (currentTrack?.url === attachment.url) {
      togglePlayPause();
    } else {
      loadTrack(trackData, sellerInfo);
    }
  };

  return (
    <div className='pt-[20px]'>
      <h2 className="text-base font-semibold leading-6 tracking-[-0.015em] text-[#161922] mb-4">
        {t('projects.attachments.title')}
      </h2>

      <ul className="space-y-3">
        {attachments.map((attachment, index) => {
          // Check mimeType first, then fallback to file extension
          const isAudio =
            attachment.mimeType?.startsWith('audio/') ||
            /\.(mp3|wav|ogg|aac|flac)$/i.test(attachment.name);

          return (
            <li key={index}>
              {isAudio ? (
                <button
                  onClick={() => handlePlayAudio(attachment)}
                  className="inline-flex items-center rounded-xl border border-stroke-soft-200 p-[14px] hover:bg-[#F6F8FA] dark:hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer text-left w-full md:w-auto bg-[#FDFDFD] gap-16"
                  title={t('projects.attachments.playAudio', { name: attachment.name })}
                >
                  <span className="text-[14px] pr-[16px] font-medium text-text-strong-950 truncate" title={attachment.name}>
                    {attachment.name}
                  </span>
                  {currentTrack?.url === attachment.url && isPlaying ? (
                    <RiPauseCircleLine className="size-6 text-[#525866] flex-shrink-0" />
                  ) : (
                    <RiPlayCircleFill className="size-6 text-[#525866] flex-shrink-0" />
                  )}
                </button>
              ) : (
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={attachment.name}
                  className="inline-flex items-center rounded-xl border border-stroke-soft-200 p-[14px] hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  title={t('projects.attachments.downloadFile', { name: attachment.name })}
                >
                  <span className="text-[14px] pr-[16px] font-medium text-text-strong-950 truncate" title={attachment.name}>
                    {attachment.name}
                  </span>
                  <RiDownload2Line className="size-6 text-gray-500 flex-shrink-0" />
                </a>
              )}
            </li>
          );
        })}
      </ul>

      <div className="h-[1.5px] bg-stroke-soft-200 mx-auto mt-[24px]" />
    </div>
  );
};

export default AttachmentsSection;
