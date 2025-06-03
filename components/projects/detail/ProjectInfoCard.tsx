'use client';

import React from 'react';
import {
  RiMoneyCnyCircleLine,
  RiTimeLine,
  RiCalendarLine,
  RiGroupLine,
} from '@remixicon/react';
import { useTranslation } from 'react-i18next';

interface ProjectInfoCardProps {
  budget: string;
  releaseTime: string;
  deadline: string;
  proposals: number;
}

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({
  budget,
  releaseTime,
  deadline,
  proposals,
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="m-[20px]">
      {/* Budget */}
      <div className="flex items-center justify-between pt-2 pb-1">
        <div className="flex items-center gap-2">
          <RiMoneyCnyCircleLine className="text-icon-secondary-400 size-5 text-[#525866]" />
          <span className="text-[14px] font-medium text-gray-600">
            {t('projects.info.budget')}
          </span>
        </div>
        <span className="text-[24px] text-text-strong-950">
          {`${budget}`}
        </span>
      </div>

      {/* Release time */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <RiTimeLine className="text-icon-secondary-400 size-5 text-[#525866]" />
          <span className="text-[14px] font-medium text-gray-600">
            {t('projects.info.releaseTime')}
          </span>
        </div>
        <span className="text-[14px] text-text-secondary-600">
          {releaseTime}
        </span>
      </div>

      {/* Deadline */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <RiCalendarLine className="text-icon-secondary-400 size-5 text-[#525866]" />
          <span className="text-[14px] font-medium text-gray-600">
            {t('projects.info.deadline')}
          </span>
        </div>
        <span className="text-[14px] text-text-secondary-600">
          {deadline}
        </span>
      </div>

      {/* Proposals */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <RiGroupLine className="text-icon-secondary-400 size-5 text-[#525866]" />
          <span className="text-[14px] font-medium text-gray-600">
            {t('projects.info.proposals')}
          </span>
        </div>
        <span className="text-[14px] text-text-secondary-600">
          {proposals}
        </span>
      </div>
    </div>
  );
};

export default ProjectInfoCard;
