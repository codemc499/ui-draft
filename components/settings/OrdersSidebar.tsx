'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/utils/supabase/AuthContext';
import { cn } from '@/utils/cn';
import * as TabMenuVertical from '@/components/ui/tab-menu-vertical';
import {
  RiTimeLine,
  RiBillLine,
  RiBriefcaseLine,
  RiArrowRightSLine,
} from '@remixicon/react';
import type { ActiveView } from './settings-page-content';
import { useRouter } from 'next/navigation';
import { Icons } from "@/assets/images/icons/icons";
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

/* ------------------------------------------------------------------ */
/** Left navigation panel shown on every settings page.
 *  ‑ Buyers see "Orders" + "Billing"
 *  ‑ Sellers see an extra "My services" link.
 */


interface Props {
  activeView: ActiveView;
  isSeller: boolean;
}

export default function OrdersSidebar({
  activeView,
  isSeller,
}: Props) {
  const { t } = useTranslation('common');
  const { loading, profileLoading } = useAuth();
  const router = useRouter();

  /* -------- build link list dynamically -------- */
  const baseLinks = [
    { name: t('ordersSidebar.orders'), view: 'orders' as ActiveView, icon: Icons.Clock },
    { name: t('ordersSidebar.billing'), view: 'billing' as ActiveView, icon: Icons.DollarCircle },
  ];
  const links = [
    ...baseLinks,
    ...(isSeller
      ? [
        {
          name: t('ordersSidebar.myServices'),
          view: 'my-services' as ActiveView,
          icon: Icons.Crown,
        },
      ]
      : []),
  ];

  /* -------- skeleton while auth finishes -------- */
  if (loading || profileLoading) {
    return (
      <aside className="w-[250px] shrink-0 border-r border-stroke-soft-200 bg-bg-white-0 p-4 pt-7" />
    );
  }

  const handleValueChange = (value: string) => {
    router.push(`/${i18n.language}/settings?tab=${value}`);
  };

  /* ------------------ real sidebar ------------------ */
  return (
    <aside className="w-[240px] shrink-0 border-r border-stroke-soft-200 bg-bg-white-0 p-6">
      <TabMenuVertical.Root defaultValue={activeView} onValueChange={handleValueChange}>
        <TabMenuVertical.List>
          {links.map(({ name, view, icon: Icon }) => (
            <TabMenuVertical.Trigger
              key={view}
              value={view}
              className={cn(
                'flex h-9 w-full items-center gap-2 rounded-lg px-3 py-2 text-[#525866]', // Base styles: height, width, flex, gap, padding, border-radius, default text
                'hover:bg-gray-50 hover:bg-[#F5F7FA]', // Hover state
                'data-[state=active]:bg-[#F6F8FA] data-[state=active]:text-[#0A0D14]', // Active state: background and text color (#F6F8FA equivalent)
              )}
            >
              <Icon className="h-5 w-5 shrink-0" /> {/* Ensure icon size and prevent shrinking */}
              <span className="flex-grow text-left">{name}</span> {/* Ensure text takes remaining space */}
              <TabMenuVertical.ArrowIcon
                as={RiArrowRightSLine}
                className="ml-auto h-4 w-4 shrink-0 opacity-0 data-[state=active]:opacity-100" // Make arrow visible only on active
              />
            </TabMenuVertical.Trigger>
          ))}
        </TabMenuVertical.List>
      </TabMenuVertical.Root>
    </aside>
  );
}
