'use client';

import React from 'react';
import * as LinkButton from '@/components/ui/link-button';
import { useTranslation } from 'react-i18next';

export interface SummaryData {
  milestone: {
    title: string;
    description: string;
    learnMoreLink: string;
    icon: React.ReactNode;
  };
  totalAmount: { title: string; value: string; actions?: React.ReactNode };
  settled: { title: string; value: string };
  inEscrow: { title: string; value: string };
}

interface Props {
  data: SummaryData;
}

/* ------------------------------------------------------------------ */
/* Milestone card (¼) + money summary card (¾) — all text = 12 px      */
/* ------------------------------------------------------------------ */
export default function SummarySection({ data }: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="mb-6 grid gap-4 grid-cols-1 lg:grid-cols-4 text-[12px]">
      {/* ─────────── Milestone (¼) ─────────── */}
      <div className="rounded-[0.8rem] bg-[#F5F7FA] p-4 shadow-sm lg:col-span-1">
        <div className="flex items-start gap-3">
          <div className='flex flex-col gap-1'>
            {data.milestone.icon}
            <span className="mt-1 font-medium text-[#0E121B] text-[12px]">
              {data.milestone.title}
            </span>
            <p className="text-[#525866] text-[12px]">
              {data.milestone.description}{' '}
              <LinkButton.Root underline onClick={() => {
                window.open(data.milestone.learnMoreLink, '_blank');
              }} className='text-[12px] font-medium text-[#525866]'>{t('summarySection.learnMore')}</LinkButton.Root>
            </p>
          </div>
        </div>
      </div>

      {/* ─────────── Money summary (¾) ─────────── */}
      <div className="rounded-[0.8rem] bg-[#F5F7FA] p-4 shadow-sm lg:col-span-3">
        <div className="flex flex-row justify-between items-center h-full">
          {/* Total Amount */}
          <div>
            <h4 className="font-medium text-[#525866] text-[12px]">{data.totalAmount.title}</h4>
            <div className="flex  gap-2">
              <p className="text-[18px] mt-1 font-medium text-[#0E121B]">
                {data.totalAmount.value}
              </p>
              {data.totalAmount.actions && (
                <div className="mt-1 flex gap-3 text-blue-600">
                  {data.totalAmount.actions}
                </div>
              )}
            </div>
          </div>

          {/* Settled */}
          <div>
            <h4 className="font-medium text-[#525866] text-[12px]">{data.settled.title}</h4>
            <p className="text-[18px] mt-1 font-medium text-[#0E121B]">
              {data.settled.value}
            </p>
          </div>

          {/* In Escrow */}
          <div>
            <h4 className="font-medium text-[#525866] text-[12px]">{data.inEscrow.title}</h4>
            <p className="text-[18px] mt-1 font-medium text-[#0E121B]">
              {data.inEscrow.value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
