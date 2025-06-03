'use client';

import React from 'react';
import { RiCloseLine } from '@remixicon/react';
import { useTranslation } from 'react-i18next';

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

const FilterTag: React.FC<FilterTagProps> = ({ label, onRemove }) => {
  const { t } = useTranslation();

  return (
    <div className='text-xs text-text-secondary-600 flex items-center gap-1 rounded-md bg-[#F6F8FA] px-2 py-1'>
      <span className='truncate'>{label}</span>
      <button
        onClick={onRemove}
        className='text-text-secondary-400 hover:text-text-secondary-600 flex-shrink-0'
        aria-label={t('filter.remove', { label })}
      >
        <RiCloseLine className='size-3.5' />
      </button>
    </div>
  );
};

export default FilterTag;
