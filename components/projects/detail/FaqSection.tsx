'use client';

import React, { useState } from 'react';
import { RiAddLine, RiSubtractLine, RiQuestionMark } from '@remixicon/react';
import { useTranslation } from 'react-i18next';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

interface FaqSectionProps {
  initialFaqs: FaqItem[];
}

const FaqSection: React.FC<FaqSectionProps> = ({ initialFaqs }) => {
  const [faqs, setFaqs] = useState(initialFaqs);
  const { t } = useTranslation('common');

  const toggleFaq = (index: number) => {
    setFaqs(current =>
      current.map((faq, i) =>
        i === index ? { ...faq, isOpen: !faq.isOpen } : faq
      )
    );
  };

  if (!faqs.length) return null;

  return (
    <div className="pt-[20px]">
      {/* Header */}
      <h2 className="text-base font-semibold leading-6 tracking-[-0.015em] text-[#161922] mb-[12px]">
        {t('projects.faq.title')}
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`
              overflow-hidden
              border-b-[2px] border-stroke-soft-200 hover:bg-[#F6F8FA]
              ${faq.isOpen ? 'bg-[#F6F8FA] border-b-[0px]' : ''}
            `}
          >
            {/* Question row */}
            <button
              onClick={() => toggleFaq(idx)}
              className="flex w-full items-start justify-between p-4 text-left font-medium text-text-strong-950"
            >
              <div className="flex text-[14px] items-start gap-3">
                {/* Black-bordered question mark */}
                <div className="pt-[2.5px]">
                  <div className="border border-black rounded-full p-[1px] flex items-center justify-center">
                    <RiQuestionMark className="w-[10px] h-[10px] text-[#525866]" />
                  </div>
                </div>
                <div className="text-[14px] flex flex-col gap-2">
                  {faq.question}
                  {/* Answer, flush under question text */}
                  {faq.isOpen && faq.answer && (
                    <div className="text-[#525866]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </div>

              {/* Plus/minus icon */}
              {faq.isOpen ? (
                <RiSubtractLine className="size-5 text-text-secondary-600" />
              ) : (
                <RiAddLine className="size-5 text-gray-400" />
              )}
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
