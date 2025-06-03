'use client';

import React from 'react';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';
import { RiSearchLine } from '@remixicon/react';
import { useTranslation } from 'react-i18next';

export function ProjectFilters() {
  const { t } = useTranslation('common');

  return (
    <div className='bg-bg-subtle-100 mb-6 flex flex-col gap-3 rounded-lg p-3 sm:flex-row'>
      {/* Search Input */}
      <div className='flex-1'>
        <Input.Root>
          <Input.Wrapper>
            <Input.Icon as={RiSearchLine} />
            <Input.Input placeholder={t('projects.filters.searchPlaceholder')} />
          </Input.Wrapper>
        </Input.Root>
      </div>
      {/* Filter Dropdowns */}
      <div className='flex flex-wrap gap-3'>
        <Select.Root defaultValue='deadline' size='small'>
          <Select.Trigger>
            <Select.Value placeholder={t('projects.filters.deadline')} />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Item value='deadline'>{t('projects.filters.deadline')}</Select.Item>
              <Select.Item value='today'>{t('projects.filters.today')}</Select.Item>
              <Select.Item value='this-week'>{t('projects.filters.thisWeek')}</Select.Item>
              <Select.Item value='this-month'>{t('projects.filters.thisMonth')}</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <Select.Root defaultValue='purpose' size='small'>
          <Select.Trigger>
            <Select.Value placeholder={t('projects.filters.purpose')} />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Item value='purpose'>{t('projects.filters.purpose')}</Select.Item>
              <Select.Item value='business'>{t('projects.filters.business')}</Select.Item>
              <Select.Item value='personal'>{t('projects.filters.personal')}</Select.Item>
              <Select.Item value='education'>{t('projects.filters.education')}</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <Select.Root defaultValue='posting-date' size='small'>
          <Select.Trigger>
            <Select.Value placeholder={t('projects.filters.postingDate')} />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Item value='posting-date'>{t('projects.filters.postingDate')}</Select.Item>
              <Select.Item value='last-24h'>{t('projects.filters.last24h')}</Select.Item>
              <Select.Item value='last-week'>{t('projects.filters.lastWeek')}</Select.Item>
              <Select.Item value='last-month'>{t('projects.filters.lastMonth')}</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  );
}
