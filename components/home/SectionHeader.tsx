import React from 'react';
import Link from 'next/link';
import * as LinkButton from '@/components/ui/link-button';
import { RiArrowRightSLine } from '@remixicon/react';
import Translate from '@/components/Translate';

// --- Section Header Component ---
interface SectionHeaderProps {
  title: string;
  href?: string;
}
const SectionHeader = ({ title, href = '#' }: SectionHeaderProps) => {
  return (
    <div className='mb-2 flex items-center justify-between'>
      <h2 className='text-[24px] text-[#000000] font-[500] '>{title}</h2>
      <LinkButton.Root
        variant='gray'
        size='small'
        className='text-surface-800 text-[14px] font-medium'
        asChild
      >
        <Link href={href} className='leading-none underline'>
          <Translate id="home.sections.more" />
          <LinkButton.Icon as={RiArrowRightSLine} className='size-6' />
        </Link>
      </LinkButton.Root>
    </div>
  );
};

export default SectionHeader;
