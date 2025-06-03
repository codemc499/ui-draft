"use client";

import * as React from 'react';
import * as Button from "@/components/ui/button";
import * as Avatar from "@/components/ui/avatar";
import * as FancyButton from "../../ui/fancy-button"; // Import FancyButton
import { RiStarFill, RiGoogleFill, RiMoreLine, RiLoader4Line, RiSendPlaneLine, RiAddLine, RiMore2Fill } from '@remixicon/react';
import { useTranslation } from 'react-i18next';

type UserRole = 'buyer' | 'seller';

interface ProfileSectionProps {
  userRole: UserRole;
  name: string;
  rating: number;
  totalReviews: number;
  specialty?: string;
  avatarUrl?: string;
  status?: 'online' | 'offline';
  onMessageClick: () => void;
  isMessagingLoading: boolean;
  onRehireClick: () => void;
  disabled?: boolean;
}

export function ProfileSection({
  userRole,
  name,
  rating,
  totalReviews,
  specialty,
  avatarUrl,
  status = 'online',
  onMessageClick,
  isMessagingLoading,
  onRehireClick,
  disabled = false,
}: ProfileSectionProps) {
  const { t } = useTranslation('common');

  return (
    <div
      className="
        flex items-center justify-between
        p-[16px] bg-white rounded-[12px]
        border border-[#E1E4EA]
        shadow-[0px_2px_4px_0px_rgba(14,18,27,0.03),0px_6px_10px_0px_rgba(14,18,27,0.06)]
      "
    >
      <div className="flex items-center gap-4">
        {/* Render Avatar */}
        <Avatar.Root size="80" className="relative">
          <Avatar.Image
            src={avatarUrl || "https://placekitten.com/200/200"}
            alt={name}
          />
          {status === 'online' && (
            <Avatar.Indicator position="bottom">
              <Avatar.Status status="online" />
            </Avatar.Indicator>
          )}
        </Avatar.Root>

        {/* Render Name and Rating */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-medium text-[#222530]">{name}</h2>
            <div className="flex items-center">
              <RiStarFill className="size-4 text-yellow-400" />
              <span className="text-[14px] text-[#525866]">
                {rating} ({totalReviews})
              </span>
            </div>
          </div>

          {specialty && (
            <div className="flex items-start gap-2 mt-1 hover:bg-[#F5F7FA] rounded-md px-1">
              <Button.Icon className="flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.1377 7.77283V10.3869H12.8446C12.6818 11.2276 12.1933 11.9395 11.4607 12.4181L13.6961 14.1179C14.9985 12.9397 15.7499 11.2093 15.7499 9.15358C15.7499 8.67495 15.7061 8.21468 15.6247 7.7729L9.1377 7.77283Z" fill="#4285F4" />
                  <path d="M2.98882 5.97491C2.51922 6.88306 2.25 7.90786 2.25 9.00012C2.25 10.0924 2.51922 11.1172 2.98882 12.0253C2.98882 12.0314 5.28061 10.2826 5.28061 10.2826C5.14286 9.87758 5.06144 9.44806 5.06144 9.00005C5.06144 8.55203 5.14286 8.12251 5.28061 7.71751L2.98882 5.97491Z" fill="#FBBC05" />
                  <path d="M9.13812 4.93774C10.1525 4.93774 11.0542 5.28137 11.7743 5.94411L13.7467 4.01117C12.5507 2.91891 10.9979 2.25 9.13812 2.25C6.44564 2.25 4.12261 3.76569 2.98926 5.9748L5.28098 7.71754C5.82571 6.12206 7.34731 4.93774 9.13812 4.93774Z" fill="#EA4335" />
                  <path d="M5.27802 10.2849L4.77385 10.6631L2.98926 12.0253C4.12261 14.2283 6.4455 15.7501 9.13798 15.7501C10.9976 15.7501 12.5568 15.1487 13.6964 14.1179L11.461 12.4181C10.8474 12.8231 10.0647 13.0685 9.13798 13.0685C7.34717 13.0685 5.82564 11.8842 5.28083 10.2887L5.27802 10.2849Z" fill="#34A853" />
                </svg>
              </Button.Icon>
              <p className="text-[12px] text-[#525866]">{specialty}</p>
            </div>
          )}
        </div>
      </div>

      {/* Render Buttons */}
      <div className="flex items-center gap-[16px] ml-6">
        <Button.Root
          variant="neutral"
          mode="stroke"
          size="medium"
          className="px-6 min-w-[110px] h-[36px]"
          onClick={onMessageClick}
          disabled={disabled || isMessagingLoading}
        >
          {isMessagingLoading ? (
            <>
              <RiLoader4Line className="animate-spin mr-2" size={18} />
              {t('orders.profile.opening')}
            </>
          ) : (
            <>
              {t('orders.profile.message')}
            </>
          )}
        </Button.Root>

        {userRole === 'buyer' && (
          <FancyButton.Root disabled={disabled} variant='neutral' size='medium' className="px-6 min-w-[100px] h-[36px]" onClick={onRehireClick}>
            {t('orders.profile.rehire')}
          </FancyButton.Root>
        )}

        <Button.Root
          variant="neutral"
          mode="stroke"
          size="medium"
          className="px-4 max-w-[36px]"
          disabled={disabled}
        >
          <Button.Icon as={RiMore2Fill} className="text-[#99A0AE] size-[22px] transform rotate-90" />
        </Button.Root>

      </div>
    </div>
  );
}
