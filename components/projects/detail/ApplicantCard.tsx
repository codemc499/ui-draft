'use client';

import React from 'react';
import * as Avatar from '@/components/ui/avatar';
import { RiStarFill, RiMessage3Line, RiMessage2Line } from '@remixicon/react';
import * as Button from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';

export interface Applicant {
  id: string;
  name: string;
  avatar: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  onMessageClick?: () => void;
}

interface ApplicantCardProps {
  applicant: Applicant;
  userRole: 'buyer' | 'seller';
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ applicant, userRole }) => {
  const { t } = useTranslation('common');
  const timeAgo = formatDistanceToNow(new Date(applicant.created_at), { addSuffix: true });

  const getStatusBadge = () => {
    switch (applicant.status) {
      case 'accepted':
        return (
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            {t('projects.applicants.status.hired')}
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
            {t('projects.applicants.status.rejected')}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-[16px] pb-[16px]">
      <div className="flex items-center justify-between">
        {/* Avatar + Info */}
        <div className="flex items-start gap-3">
          <Avatar.Root size="40">
            <Avatar.Image src={applicant.avatar} alt={applicant.name} />
            <Avatar.Indicator position="bottom">
              <div className="size-3 rounded-full bg-green-500 ring-2 ring-white" />
            </Avatar.Indicator>
          </Avatar.Root>

          <div className="flex-1">
            {/* Name */}
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-text-strong-950 leading-6">
                {applicant.name}
              </h4>
              {getStatusBadge()}
            </div>

            {/* Time pill */}
            <p className="text-[12px] text-gray-600">
              {timeAgo}
            </p>
          </div>
        </div>

        {/* Right-side action */}
        {userRole === 'buyer' && applicant.onMessageClick && (
          <Button.Root
            variant="neutral"
            mode="ghost"
            size="small"
            onClick={applicant.onMessageClick}
            className="flex items-center gap-1"
          >
            <RiMessage3Line className="size-8 text-icon-secondary-400 hover:text-icon-primary-500" />
            {/* {unread > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                {unread}
              </span>
            )} */}
          </Button.Root>
        )}
      </div>
      {applicant.status === 'accepted' && userRole === 'buyer' && (
        /* 95% width separator */
        <div className="w-[95%] mx-auto mt-[16px] h-px bg-stroke-soft-200" />
      )}
    </div>
  );
};

export default ApplicantCard;
