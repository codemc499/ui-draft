'use client';

import { RiHandHeartLine, RiHeartPulseLine } from '@remixicon/react';
import * as Button from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/utils/supabase/AuthContext';

interface FinancialSummaryProps {
  totalAmount: string;
  received: string;
  inEscrow: string;
  refunded: string;
}

export function FinancialSummary({
  totalAmount,
  received,
  inEscrow,
  refunded,
}: FinancialSummaryProps) {
  const { t } = useTranslation('common');

  const { userProfile } = useAuth();

  const isSeller = userProfile?.user_type === 'seller';

  return (
    <div className="flex gap-[24px] my-[24px]">
      {/* Financial Details */}
      <div className="flex-1 grid grid-cols-4 gap-[116px] bg-[#F5F7FA] px-[24px] py-[26px] rounded-[12px] h-[100px] max-w-[876px]">
        <div className="flex flex-col justify-center max-w-[120px]">
          <span className="text-[12px] text-[#525866] font-medium ">{t('orders.financialSummary.totalAmount')}</span>
          <span className="text-[18px] text-[#0E121B] mt-[8px]">{totalAmount}</span>
        </div>
        <div className="flex flex-col justify-center max-w-[120px]">
          <span className="text-[12px] text-[#525866] font-medium ">{isSeller ? t('orders.financialSummary.received') : t('orders.financialSummary.paid')}</span>
          <span className="text-[18px] text-[#0E121B] mt-[8px]">{received}</span>
        </div>
        <div className="flex flex-col justify-center max-w-[120px]">
          <span className="text-[12px] text-[#525866] font-medium ">{t('orders.financialSummary.inEscrow')}</span>
          <span className="text-[18px] text-[#0E121B] mt-[8px]">{inEscrow}</span>
        </div>
        <div className="flex flex-col justify-center max-w-[120px]">
          <span className="text-[12px] text-[#525866] font-medium ">{t('orders.financialSummary.refunded')}</span>
          <span className="text-[18px] text-[#0E121B] mt-[8px]">{refunded}</span>
        </div>
      </div>

      {/* Milestone Box */}
      <div className=" flex flex-col flex-1 bg-[#F5F7FA] p-[16px] rounded-[12px] h-[100px] max-w-[300px]">
        <div className="ml-[5px]">
          <Button.Icon className="flex-shrink-0">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.04582 2.2221C3.08987 1.17786 4.49022 0.567079 5.96585 0.512327C7.44149 0.457575 8.88325 0.962898 10.0018 1.9269C11.1194 0.964505 12.5592 0.459749 14.0331 0.513687C15.507 0.567625 16.9061 1.17628 17.9503 2.21779C18.9946 3.2593 19.6069 4.6568 19.6647 6.13052C19.7225 7.60424 19.2215 9.04541 18.262 10.1655L11.2735 17.1765C10.9524 17.4977 10.5218 17.6856 10.068 17.7027C9.61415 17.7197 9.17066 17.5645 8.82642 17.2683L8.72742 17.1774L1.73982 10.1655C0.780857 9.04638 0.279639 7.60654 0.336371 6.13384C0.393103 4.66115 1.0036 3.26413 2.04582 2.2221ZM3.31842 3.4947C2.58244 4.23089 2.15819 5.2222 2.13372 6.26289C2.10925 7.30359 2.48645 8.31374 3.18702 9.0837L3.31842 9.2223L10.0009 15.9048L14.7736 11.1312L11.5921 7.9497L10.6381 8.9037C10.3874 9.1545 10.0898 9.35347 9.76224 9.48924C9.43466 9.62502 9.08355 9.69495 8.72895 9.69503C8.01281 9.6952 7.32593 9.41087 6.81942 8.9046C6.31291 8.39833 6.02826 7.71158 6.02809 6.99544C6.02792 6.27929 6.31224 5.59241 6.81852 5.0859L8.71032 3.1932C7.95744 2.59234 7.01509 2.27942 6.05233 2.3106C5.08958 2.34177 4.16945 2.71499 3.45702 3.3633L3.31842 3.4947ZM10.9558 6.0399C11.1246 5.87118 11.3535 5.77639 11.5921 5.77639C11.8308 5.77639 12.0596 5.87118 12.2284 6.0399L16.0462 9.8577L16.6834 9.2223C17.4317 8.47452 17.8577 7.46363 17.8704 6.40581C17.883 5.34799 17.4812 4.32722 16.7509 3.5618C16.0207 2.79638 15.0199 2.34708 13.9627 2.30999C12.9054 2.27289 11.8756 2.65095 11.0935 3.3633L10.9558 3.4947L8.09202 6.3585C7.93602 6.51439 7.84269 6.72214 7.82975 6.9423C7.81681 7.16246 7.88516 7.37971 8.02182 7.5528L8.09202 7.6311C8.24791 7.7871 8.45566 7.88042 8.67581 7.89337C8.89597 7.90631 9.11322 7.83796 9.28632 7.7013L9.36462 7.6311L10.9558 6.0399Z" fill="#0E121B" />
            </svg>
          </Button.Icon>
        </div>
        <h4 className="text-[12px] text-[#0E121B] font-medium text-text-strong-950 mt-[5px]">{t('orders.financialSummary.milestone')}</h4>
        <div className="mt-[8px]">
          <p className="text-[12px] text-[#525866]">
            {t('orders.financialSummary.milestonePrice')}
            <a href="#" className="underline hover:text-text-primary-500 ml-1">
              {t('orders.financialSummary.learnMore')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 