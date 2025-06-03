'use client';

import React from 'react';
import * as Badge from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import * as Tag from '@/components/ui/tag';

interface SkillsSectionProps {
  skills: string[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const { t } = useTranslation('common');

  if (!skills || skills.length === 0) return null;

  return (
    <div className='pt-[20px]'>
      <h2
        className='
          text-base
          font-semibold
          leading-6
          tracking-[-0.015em]
          text-[#161922]
          mb-4
          text-[16px]
        '
      >
        {t('projects.details.skills')}
      </h2>
      <div className='flex flex-wrap gap-2'>
        {skills.map((skill, idx) => (
          <Tag.Root className='text-[#525866] border border-[#E2E4E9] hover:border-[#F6F8FA]'>
            {skill}
          </Tag.Root>
        ))}
      </div>

      {/* underline */}
      <div className="h-[1.5px] bg-stroke-soft-200 mx-auto mt-[24px]" />
    </div>
  );
};

export default SkillsSection;
