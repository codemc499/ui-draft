'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioPlayer } from '@/contexts/AudioContext';
import * as Avatar from '@/components/ui/avatar';
import * as Slider from '@/components/ui/slider';
import {
  RiPlayFill,
  RiPauseCircleLine,
  RiSkipBackFill,
  RiSkipForwardFill,
  RiHeart3Line,
  RiHeart3Fill,
  RiVolumeUpLine,
  RiVolumeDownLine,
  RiVolumeMuteLine,
  RiPlayList2Line,
  RiArrowUpSLine,
  RiArrowDownSLine,
} from '@remixicon/react';
import { cn } from '@/utils/cn';
import { notification as toast } from '@/hooks/use-notification';

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === Infinity) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function GlobalAudioPlayer() {
  const { t } = useTranslation('common');
  const {
    currentTrack,
    currentSeller,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
  } = useAudioPlayer();

  const [isVisible, setIsVisible] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (currentTrack) {
      setIsVisible(true);
    }
  }, [currentTrack]);

  // Don't render anything if no track is loaded OR if hidden
  if (!currentTrack || !currentSeller) {
    return null;
  }

  const handleSeek = (value: number[]) => seek(value[0]);
  const handleVolumeChange = (value: number[]) => setVolume(value[0]);

  const getVolumeIcon = () => {
    if (volume === 0) return RiVolumeMuteLine;
    if (volume < 0.5) return RiVolumeDownLine;
    return RiVolumeUpLine;
  };
  const VolumeIcon = getVolumeIcon();

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      toast({ description: t('audioPlayer.addedToFavorites') });
    } else {
      toast({ description: t('audioPlayer.removedFromFavorites') });
    }
  };

  return (
    <>
      {currentTrack && currentSeller && (
        <div className="fixed bottom-0 left-0 right-0 z-[9998]">
          <div className="relative bg-white border-t border-stroke-soft-200 shadow-md px-4 md:px-6">
            {/* Toggle Button */}
            <div className="absolute -top-[2.3rem] left-[95%] transform -translate-x-1/2 z-10">
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="flex items-center gap-2 bg-white border-t border-l border-r border-stroke-soft-200 shadow-md text-black px-6 py-2 rounded-t-xl shadow-md hover:bg-neutral-1600 transition-colors"
                aria-label={t('audioPlayer.toggleVisibility')}
              >
                <span
                  onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                  className="cursor-pointer"
                  aria-label={volume === 0 ? t('audioPlayer.unmute') : t('audioPlayer.mute')}
                >
                  <VolumeIcon className="w-5 h-5" />
                </span>
                {isVisible ? (
                  <RiArrowDownSLine className="w-5 h-5" />
                ) : (
                  <RiArrowUpSLine className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Audio Player Content */}
            {isVisible && (
              <div className="h-20 flex items-center justify-between pt-[6px]">
                {/* Left: Track Info */}
                <div className="flex items-center gap-3 min-w-0 w-1/4">
                  <Avatar.Root size="40">
                    <Avatar.Image
                      src={currentSeller.avatarUrl ?? undefined}
                      alt={currentSeller.name}
                    />
                  </Avatar.Root>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-strong-950 truncate">
                      {currentTrack.title}
                    </p>
                    <p className="text-xs text-text-secondary-600 truncate">
                      {currentSeller.name}
                    </p>
                  </div>
                </div>

                {/* Center: Controls & Progress */}
                <div className="flex flex-col items-center justify-center flex-grow mx-4 md:mx-8">
                  {/* Controls */}
                  <div className="flex items-center gap-3 md:gap-4 mb-1">
                    <button
                      className="text-text-secondary-600 hover:text-text-strong-950 transition-colors"
                      aria-label={t('audioPlayer.previous')}
                    >
                      <RiSkipBackFill className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={togglePlayPause}
                      className="bg-gray-900 hover:bg-gray-700 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-colors"
                      aria-label={isPlaying ? t('audioPlayer.pause') : t('audioPlayer.play')}
                    >
                      {isPlaying ? (
                        <RiPauseCircleLine className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        <RiPlayFill className="w-4 h-4 md:w-5 md:h-5" />
                      )}
                    </button>
                    <button
                      className="text-text-secondary-600 hover:text-text-strong-950 transition-colors"
                      aria-label={t('audioPlayer.next')}
                    >
                      <RiSkipForwardFill className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 w-full max-w-md md:max-w-lg lg:max-w-xl">
                    <span className="text-xs text-text-secondary-600 font-mono w-10 text-right">
                      {formatTime(currentTime)}
                    </span>
                    <Slider.Root
                      value={[currentTime]}
                      max={duration || 0}
                      step={1}
                      onValueChange={handleSeek}
                      className="w-full cursor-pointer [&>span:first-of-type>span]:bg-black"
                    >
                      <Slider.Thumb />
                    </Slider.Root>
                    <span className="text-xs text-text-secondary-600 font-mono w-10 text-left">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>

                {/* Right: Volume & Actions */}
                <div className="flex items-center gap-3 md:gap-4 w-1/4 justify-end">
                  <button
                    className="text-text-secondary-600 hover:text-red-500 transition-colors"
                    onClick={handleLike}
                  >
                    {liked ? <RiHeart3Fill className="w-5 h-5 text-red-500" /> : <RiHeart3Line className="w-5 h-5" />}
                  </button>
                  <div className="flex items-center gap-2 w-24">
                    <VolumeIcon className="w-5 h-5 text-text-secondary-600" />
                    <Slider.Root
                      value={[volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="w-full cursor-pointer [&>span:first-of-type>span]:bg-black"
                      aria-label={t('audioPlayer.volume')}
                    >
                      <Slider.Thumb />
                    </Slider.Root>
                  </div>
                  <button
                    className="text-text-secondary-600 hover:text-text-strong-950 transition-colors"
                    aria-label={t('audioPlayer.playlist')}
                  >
                    <RiPlayList2Line className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}  