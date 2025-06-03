'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as LinkButton from '@/components/ui/link-button';
import * as Tag from '@/components/ui/tag';
import * as Button from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useAuth } from '@/utils/supabase/AuthContext';
import { jobApplicationOperations } from '@/utils/supabase/job-application-operations';
import { Job, User, JobApplication } from '@/utils/supabase/types';

import Banner from './banner';
import {
  RiArrowRightSLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
} from '@remixicon/react';
import * as Divider from '@/components/ui/divider';
import Translate from '@/components/Translate';

// --- Section Header ---
interface SectionHeaderProps {
  title: string;
  href?: string;
}

export function SectionHeader({ title, href = '#' }: SectionHeaderProps) {
  const { t } = useTranslation('common');

  return (
    <div className='mb-4 flex items-center justify-between'>
      <h2 className='text-[18px] font-medium text-[#0A0D14]'>{title}</h2>
      <LinkButton.Root
        size='small'
        className='text-[14px] text-[#222530] font-medium'
        asChild
      >
        <Link href={href} className=''>
          {t('worker.mainContent.more')}
          <LinkButton.Icon as={RiArrowRightSLine} className='size-5' />
        </Link>
      </LinkButton.Root>
    </div>
  );
}

// --- Project Card (modified) ---
interface ProjectCardProps {
  job: Job;
  hasApplied: boolean;
  onApply: () => void;
}

export function ProjectCard({ job, hasApplied, onApply }: ProjectCardProps) {
  const title = job.title ?? i18n.t('worker.mainContent.untitledProject');
  const budget = job.budget ?? 0;
  const budgetDisplay = `$${budget.toLocaleString()}`;
  const description = job.description ?? i18n.t('worker.mainContent.noDescription');
  const tags = Array.isArray(job.skill_levels) ? job.skill_levels : [];

  return (
    <div className="flex flex-col max-h-[148px] gap-6 hover:bg-[#F6F8FA] px-[16px]">
      <div className='flex flex-col gap-2  pt-4'>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-col gap-2'>
            <Link href={`/${i18n.language}/projects/${job.id}`} className='hover:underline'>
              <h3 className='font-medium text-[#0A0D14] text-[20px]'>{title}</h3>
            </Link>
            <div className='flex flex-row gap-2'>
              {tags.map((tag) => (
                <Tag.Root key={tag} className='text-[12px] text-[#525866] '>
                  {tag}
                </Tag.Root>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-2 text-right'>
            <p className='text-[14px] text-[#525866]'><Translate id="project.budget" /></p>
            <p className='text-[18px] font-medium text-[#0E121B]'>
              {budgetDisplay}
            </p>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <p className='text-[14px] text-[#0E121B] line-clamp-1'>{description}</p>
          <Button.Root
            mode='stroke'
            size='small'
            variant='neutral'
            disabled={hasApplied}
            onClick={onApply}
            className='flex-shrink-0 shadow-sm text-[0.875rem] leading-none font-medium p-3 gap-1'
          >
            {hasApplied ? (
              <>
                <Translate id="project.applied" />
                <RiArrowRightSLine className='w-[1.25rem] h-[1.25rem]' />
              </>
            ) : (
              <>
                <Translate id="project.apply" />
                <RiArrowRightSLine className='w-[1.25rem] h-[1.25rem]' />
              </>
            )}
          </Button.Root>
        </div>
      </div>
      <Divider.Root />
    </div>
  );
}

// --- Worker Main Content Props ---
interface WorkerMainContentProps {
  userProfile: User;
  recentJobs: Job[];
}

// --- Worker Main Content (modified) ---
export function WorkerMainContent({ userProfile, recentJobs }: WorkerMainContentProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const [userApplications, setUserApplications] = useState<JobApplication[]>([]);
  const [applicationSubmitted, setApplicationSubmitted] = useState(0);

  useEffect(() => {
    if (!user) {
      setUserApplications([]);
      return;
    }
    jobApplicationOperations.getUserJobApplications(user.id)
      .then(setUserApplications)
      .catch(error => {
        console.error('[WorkerMainContent] Error fetching user applications:', error);
        setUserApplications([]);
      });
  }, [user, applicationSubmitted]);

  const handleApplyToProject = async (job: Job) => {
    if (!user) {
      console.error('[WorkerMainContent] User not logged in. Cannot apply.');
      return;
    }
    if (!job.id) {
      console.error('[WorkerMainContent] Job ID missing. Cannot apply.');
      return;
    }

    const alreadyApplied = userApplications.some(
      (application) => application.job_id === job.id && application.seller_id === user.id
    );
    if (alreadyApplied) {
      console.log(`[WorkerMainContent] User ${user.id} already applied to project ${job.id}.`);
      return;
    }

    try {
      const createdApplication = await jobApplicationOperations.createJobApplication(job.id, user.id);

      if (createdApplication) {
        setApplicationSubmitted(prev => prev + 1);
      } else {
        console.error('[WorkerMainContent] Failed to create job application.');
      }
    } catch (error) {
      console.error('[WorkerMainContent] Error during application process:', error);
    }
  };

  return (
    <main className='flex-1 max-w-[676px]'>
      <Banner />
      <section className='flex flex-col max-w-[676px] max-h-[632px]'>
        <SectionHeader title={t('worker.mainContent.projects')} href={`/${i18n.language}/services/search?tab=Project`} />
        <div className='flex flex-col'>
          {recentJobs && recentJobs.length > 0 ? (
            recentJobs.map((job) => {
              const hasApplied = user ? userApplications.some(
                (application) => application.job_id === job.id && application.seller_id === user.id
              ) : false;
              return (
                <ProjectCard
                  key={job.id}
                  job={job}
                  hasApplied={hasApplied}
                  onApply={() => handleApplyToProject(job)}
                />
              );
            })
          ) : (
            <p className='px-2 py-4 text-text-secondary-500'>
              {t('worker.mainContent.noProjects')}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
