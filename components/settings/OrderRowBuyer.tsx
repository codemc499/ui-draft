'use client';

import React from 'react';
import Link from 'next/link';
import * as Avatar from '@/components/ui/avatar';
import * as Dropdown from '@/components/ui/dropdown';
import * as Table from '@/components/ui/table';
import * as Tag from '@/components/ui/tag';
import { RiMore2Fill } from '@remixicon/react';
import renderStatusIcon from '@/components/settings/StatusBadge'; // icon helper
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
/* ---------- interface (now includes proposals) ---------- */
interface PersonInfo {
  id: string;
  name: string;
  avatarUrl: string;
}
export interface BuyerEngagement {
  id: string;
  contractId: string | null;
  type: 'job' | 'contract';
  subject: string;
  price: number;
  deadline: string;
  proposals?: number | null;
  worker: PersonInfo | null;
  status: string;
  currency: string;
}

interface Props {
  engagement: BuyerEngagement;
  handleOpenChat: (contractId: string | null, personId: string | undefined, chatWith: 'buyer' | 'seller') => void;
}

/* ---------- one table row for a BUYER ---------- */
export default function OrderRowBuyer({ engagement, handleOpenChat }: Props) {
  const { t } = useTranslation('common');
  const isJob = engagement.type === 'job';
  const detailLink = isJob
    ? `/${i18n.language}/projects/${engagement.id}`
    : `/${i18n.language}/orders/detail/${engagement.id}`;


  const currency = engagement.currency === 'USD' ? '$' : engagement.currency === 'EUR' ? '€' : engagement.currency === 'GBP' ? '£' : engagement.currency === 'CNY' ? '¥' : '$';
  return (
    <Table.Row className='border-b border-[#E1E4EA]'>

      {/* Details + price */}
      <Table.Cell className=" align-center">
        <Link href={detailLink} className="flex flex-col gap-1 hover:text-blue-600">
          <div className="text-[14px] font-normal text-[#0E121B] group-hover:underline">
            {engagement.subject}
          </div>
        </Link>
        <div className="text-[12px] text-[#0E121B]">
          {`${currency}${engagement.price.toLocaleString()}`}
        </div>
      </Table.Cell>

      {/* Final deadline */}
      <Table.Cell className=" text-[14px] text-[#0E121B] align-center whitespace-nowrap">
        {engagement.deadline}
      </Table.Cell>




      {/* Proposals */}
      <Table.Cell className="px-4 py-3 text-[14px] text-[#525866] align-center whitespace-nowrap">
        {engagement.proposals ?? '–'}
      </Table.Cell>

      {/* Worker / Job Posting */}
      <Table.Cell className="px-4 py-3 align-center whitespace-nowrap">
        {engagement.worker ? (
          <div className="flex items-center gap-4">
            {engagement.worker.avatarUrl ? (<Avatar.Root size="40">

              <Avatar.Image
                src={engagement.worker.avatarUrl}
                alt={engagement.worker.name}
              />
            </Avatar.Root>
            ) : (
              <Avatar.Root size="40">
                {engagement.worker.name?.charAt(0)}
              </Avatar.Root>
            )}

            <span className="text-[14px] font-medium text-[#525866]">
              {engagement.worker.name}
            </span>
          </div>

        ) : (
          <span className="text-[14px] font-normal text-[#525866]">{t('orders.jobPosting')}</span>
        )}
      </Table.Cell>

      {/* Status */}
      <Table.Cell className=" align-center whitespace-nowrap">
        <div className='flex flex-row item-center gap-2 capitalize'>
          <Tag.Root
            variant="stroke"
            className='flex flex-row item-center gap-2 capitalize pointer-events-none'
          >
            {engagement.status && (engagement.status === 'pending' || engagement.status === 'close' || engagement.status === 'dispute' || engagement.status === 'overdue') && (
              renderStatusIcon(engagement.status)
            )}
            {engagement.status}
          </Tag.Root>
        </div>
      </Table.Cell>

      {/* Actions */}
      <Table.Cell className="px-4 py-3 text-right align-top whitespace-nowrap">
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <button className="p-1 text-[#525866] hover:text-text-strong-950 focus:outline-none">
              <RiMore2Fill className="size-5" />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Content align="end">
            <Dropdown.Item asChild>
              <Link href={detailLink}>{t('orders.viewDetails')}</Link>
            </Dropdown.Item>
            <Dropdown.Item disabled={!engagement.worker || !engagement.contractId} onClick={() => handleOpenChat(engagement.contractId, engagement.worker?.id, 'seller')}>
              {t('orders.messageWorker')}
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item className="text-text-danger-500">
              {t('orders.cancelOrder')}
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </Table.Cell>
    </Table.Row>
  );
}
