'use client';

import * as Accordion from "@/components/ui/accordion";
import { RiArrowDownSLine } from '@remixicon/react';
import { useTranslation } from 'react-i18next';

interface ContractDetail {
  label: string;
  value: string;
}

interface ContractDetailsProps {
  contractName?: string | null;
  details: ContractDetail[];
}

export function ContractDetails({
  contractName,
  details
}: ContractDetailsProps) {
  const { t } = useTranslation('common');

  return (
    <Accordion.Root type="single" collapsible defaultValue="item-1" className="w-full bg-white rounded-lg shadow-sm mb-4 border border-stroke-soft-200">
      <Accordion.Item value="item-1" className="border-b border-stroke-soft-200 p-0 rounded-none ring-0 hover:bg-white data-[state=open]:bg-white">

        <Accordion.Header className="px-4 py-3 bg-[#F5F7FA]">
          <Accordion.Trigger className="w-full font-medium text-[16px] text-text-strong-950 p-0 m-0 flex justify-between items-center hover:no-underline">
            {t('orders.contractDetails.title')}
            <Accordion.Arrow openIcon={RiArrowDownSLine} closeIcon={RiArrowDownSLine} className="size-5 text-gray-500 transition-transform duration-200 group-data-[state=open]/accordion:rotate-180" />
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content className="pt-0 pb-4 px-4">
          <div className="mt-3">
            {contractName && (
              <div className="flex justify-between border-b border-gray-100">
                <span className="text-[14px] text-[#525866]">{t('orders.contractDetails.contract')}</span>
                <a href="#" className="text-[14px] font-medium text-[#335CFF] underline cursor-pointer">{contractName}</a>
              </div>
            )}

            {details.map((detail, index) => (
              <div key={index} className="flex justify-between border-b border-gray-100 pt-2.5 pb-2.5 last:border-b-0">
                <span className="text-[14px] text-[#525866]">{detail.label}</span>
                <span className="text-[14px] text-black">{detail.value}</span>
              </div>
            ))}

            <div className="flex justify-between border-b border-gray-100 pt-2.5 pb-2.5 last:border-b-0">
              <span className="text-[14px] text-[#525866]">{t('orders.contractDetails.deadline')}</span>
              <span className="text-[14px] text-black">
                15 March, 2025
              </span>
            </div>
          </div>
        </Accordion.Content>

      </Accordion.Item>
    </Accordion.Root>
  );
} 