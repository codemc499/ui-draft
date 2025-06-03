'use client';

import React, { useState } from 'react';
import { RiCalendarLine } from '@remixicon/react';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import WidgetSchedule from '../widgets/widget-schedule';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import { User } from '@/utils/supabase/types';
import { DayPicker } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

// --- Calendar Widget ---
const CalendarWidget = () => {
  const { t, i18n } = useTranslation('common');
  const [selected, setSelected] = React.useState<Date>();

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row justify-between items-center'>
        <p className='text-[16px] text-[#0E121B] font-medium'>{t('worker.sidebar.calendar.title')}</p>
        <Link href={`/${i18n.language}/worker/calendar`} className='text-[14px] text-[#525866]'>{t('worker.sidebar.calendar.seeAll')}</Link>
      </div>
      <div className='flex flex-col gap-4'>
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          className="rounded-lg border border-[#E5E7EB] p-4"
        />
        <div className='flex flex-col gap-2'>
          <div className='flex flex-row justify-between items-center'>
            <p className='text-[14px] text-[#0E121B] font-medium'>{t('worker.sidebar.calendar.today')}</p>
            <p className='text-[14px] text-[#525866]'>2 {t('worker.sidebar.calendar.events')}</p>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row gap-2 items-center'>
              <div className='w-2 h-2 rounded-full bg-[#FB3748]'></div>
              <p className='text-[14px] text-[#0E121B]'>Meeting with John Doe</p>
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <div className='w-2 h-2 rounded-full bg-[#FB3748]'></div>
              <p className='text-[14px] text-[#0E121B]'>Meeting with John Doe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MeetingCard = (
  { withName, deadline, budget, status }: { withName: string, deadline: string, budget: string, status: string }
) => {
  const { t } = useTranslation('common');

  return (
    <div className='p-4 bg-[#F5F7FA] flex flex-col gap-4 rounded-lg'>
      <div className='flex flex-col gap-1'>
        <p className='text-[14px] text-[#0E121B] font-medium'>{t('worker.sidebar.meetings.with', { name: withName })}</p>
        <p className='text-[14px] text-[#525866]'>{t('worker.sidebar.meetings.deadline', { date: deadline })}</p>
      </div>
      <div className='flex flex-row justify-between'>
        <p className='text-[14px] text-[#525866]'>{t('worker.sidebar.meetings.budget', { amount: budget })}</p>
        <div className='flex flex-row gap-1 items-center'>
          {status === 'Pending' && <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.49364 0.62176L11.9236 10.1353C11.9737 10.2229 12 10.3224 12 10.4236C12 10.5248 11.9737 10.6242 11.9236 10.7119C11.8736 10.7995 11.8017 10.8723 11.715 10.9229C11.6283 10.9735 11.5301 11.0002 11.43 11.0002H0.570004C0.469946 11.0002 0.371652 10.9735 0.285 10.9229C0.198348 10.8723 0.126392 10.7995 0.0763644 10.7119C0.0263365 10.6242 -6.35474e-07 10.5248 0 10.4236C6.35497e-07 10.3224 0.0263391 10.2229 0.076368 10.1353L5.50636 0.62176C5.5564 0.534116 5.62835 0.461336 5.715 0.410735C5.80165 0.360135 5.89995 0.333496 6 0.333496C6.10005 0.333496 6.19835 0.360135 6.285 0.410735C6.37165 0.461336 6.4436 0.534116 6.49364 0.62176ZM5.42998 8.11727V9.27043H6.57002V8.11727H5.42998ZM5.42998 4.08123V6.96412H6.57002V4.08123H5.42998Z" fill="#FF8447" />
          </svg>}
          <p className='text-[12px] text-[#525866] leading-none'>
            {status === 'Timeout' ? (
              <div className='rounded-full bg-[#FB3748] text-white px-2 py-1 flex flex-row gap-1 items-center'>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.2999 2.2998L14.5999 7.9998L11.2999 13.6998H4.6999L1.3999 7.9998L4.6999 2.2998H11.2999ZM7.3999 9.79981V10.9998H8.5999V9.79981H7.3999ZM7.3999 4.9998V8.5998H8.5999V4.9998H7.3999Z" fill="white" />
                </svg>
                {t(`worker.sidebar.meetings.status.${status.toLowerCase()}`)}
              </div>
            ) : t(`worker.sidebar.meetings.status.${status.toLowerCase()}`)}
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Meetings Widget ---
const MeetingsWidget = () => {
  const { t, i18n } = useTranslation('common');
  const [activeTab, setActiveTab] = useState('7days');

  const tabs = [
    { id: '7days', label: t('worker.sidebar.meetings.tabs.7days') },
    { id: '15days', label: t('worker.sidebar.meetings.tabs.15days') },
    { id: '30days', label: t('worker.sidebar.meetings.tabs.30days') },
  ];

  const meetings = [
    { with: 'John Doe', deadline: '01.05.2025', budget: '1000', status: 'Submitted' },
    { with: 'John Doe', deadline: '01.05.2025', budget: '1000', status: 'Pending' },
    { with: 'John Doe', deadline: '01.05.2025', budget: '1000', status: 'Timeout' },
    { with: 'John Doe', deadline: '01.05.2025', budget: '1000', status: 'Timeout' },
  ];

  return (
    <div className='flex flex-col gap-4 py-4'>
      <div className='flex flex-row justify-between items-center px-4'>
        <p className='text-[16px] text-[#0E121B] font-medium'>{t('worker.sidebar.meetings.title')}</p>
        <Link href={`/${i18n.language}/worker/meetings`} className='text-[14px] text-[#525866]'>{t('worker.sidebar.calendar.seeAll')}</Link>
      </div>
      <TabMenuHorizontal.Root defaultValue={activeTab} className='px-4 py-1'>
        <TabMenuHorizontal.List>
          {tabs.map(tab => (
            <TabMenuHorizontal.Trigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabMenuHorizontal.Trigger>
          ))}
        </TabMenuHorizontal.List>
        {tabs.map(tab => (
          <TabMenuHorizontal.Content key={tab.id} value={tab.id}>
            <div className='flex flex-col gap-4 mt-4'>
              {meetings.map((meeting, index) => (
                <MeetingCard
                  key={index}
                  withName={meeting.with}
                  deadline={meeting.deadline}
                  budget={meeting.budget}
                  status={meeting.status}
                />
              ))}
            </div>
          </TabMenuHorizontal.Content>
        ))}
      </TabMenuHorizontal.Root>
    </div>
  );
}

// --- Worker Right Sidebar Props ---
interface WorkerRightSidebarProps {
  userProfile: User;
}

// --- Worker Right Sidebar ---
export function WorkerRightSidebar({ userProfile }: WorkerRightSidebarProps) {
  return (
    <aside className='hidden w-64 shrink-0 lg:block min-w-[352px]'>
      <div className='shadow-sm sticky top-20 flex flex-col rounded-xl border border-stroke-soft-200 bg-bg-white-0  mb-6'>

        <WidgetSchedule />
        <Divider.Root className='!mb-0 !pb-0' />
        <MeetingsWidget />
      </div>
    </aside>
  );
}
