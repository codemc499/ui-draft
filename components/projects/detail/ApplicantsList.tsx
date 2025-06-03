'use client';

import React from 'react';
import ApplicantCard from './ApplicantCard';
import { useTranslation } from 'react-i18next';
import { JobApplication, User } from '@/utils/supabase/types';
import { RiUserSearchLine } from '@remixicon/react';

interface ApplicantsListProps {
  applications: Array<JobApplication & { seller: User }>;
  userRole: 'buyer' | 'seller';
  onMessageClick?: (applicantData: User) => void;
}

const ApplicantsList: React.FC<ApplicantsListProps> = ({
  applications,
  userRole,
  onMessageClick
}) => {
  const { t } = useTranslation('common');

  if (applications.length === 0) {
    return (
      <div className="shadow-[0_16px_32px_-12px_rgba(14,18,27,0.1)] rounded-xl">
        <div className="p-[16px]">
          <h3 className="text-[16px] font-medium text-text-strong-950">
            {t('projects.applicants.list')}
          </h3>
        </div>
        <div className="w-[90%] mx-auto mb-2 mb-[16px] h-px bg-stroke-soft-200" />
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <RiUserSearchLine className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">
            {t('projects.applicants.noApplicants')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shadow-[0_16px_32px_-12px_rgba(14,18,27,0.1)] rounded-xl">
      <div className="p-[16px]">
        <h3 className="text-[16px] font-medium text-text-strong-950">
          {t('projects.applicants.list')}
        </h3>
      </div>
      <div className="w-[90%] mx-auto mb-2 mb-[16px] h-px bg-stroke-soft-200" />
      <div>
        {applications.map((application) => (
          <ApplicantCard
            key={application.id}
            applicant={{
              id: application.seller.id,
              name: application.seller.full_name,
              avatar: application.seller.avatar_url || 'https://via.placeholder.com/40',
              status: application.status,
              created_at: application.created_at,
              onMessageClick: onMessageClick ? () => onMessageClick(application.seller) : undefined
            }}
            userRole={userRole}
          />
        ))}
      </div>
    </div>
  );
};

export default ApplicantsList;
