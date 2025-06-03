'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface ProjectDetailsSectionProps {
  description: string[];
  requirements: string[];
}

const ProjectDetailsSection: React.FC<ProjectDetailsSectionProps> = ({
  description,
  requirements,
}) => {
  const { t } = useTranslation('common');

  return (
    <div className='pt-[20px]'>
      <h2
        className="
          text-base
          font-semibold
          leading-6
          tracking-[-0.015em]
          text-[#161922]
          mb-4
          text-[16px]
        "
      >
        {t('projects.details.title')}
      </h2>

      {description.map((paragraph, idx) => (
        <p
          key={idx}
          className="
            text-[14px]
            font-medium
            leading-5
            tracking-[-0.006em]
            text-[#525866]
            mb-4
          "
        >
          {paragraph}
        </p>
      ))}

      {requirements.length > 0 && (
        <>
          <h3 className='text-md mb-2 mt-6 font-medium text-text-strong-950'>
            {t('projects.details.requirements')}
          </h3>
          <ul className='space-y-2 pl-5'>
            {requirements.map((requirement, idx) => (
              <li
                key={idx}
                className='text-sm text-text-secondary-600 list-disc text-[#525866]'
              >
                {requirement}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* underline */}
      <div className="h-[1.5px] bg-stroke-soft-200 mx-auto mt-[24px]" />
    </div>
  );
};

export default ProjectDetailsSection;
