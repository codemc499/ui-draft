'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface TabItem {
  id: string;
  label: string;
  href: string;
  content: React.ReactNode;
}

interface TabControlProps {
  tabs: TabItem[];
  defaultTab: string;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export default function TabControl({ tabs, defaultTab, showSettings, onSettingsClick }: TabControlProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(defaultTab);

  const getTabContent = useCallback(() => {
    const tab = tabs.find((t) => t.id === activeTab);
    return tab?.content;
  }, [activeTab, tabs]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 h-[500px] overflow-auto">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setActiveTab(tab.id)}
              className={`${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </Link>
          ))}
          {showSettings && (
            <button
              onClick={onSettingsClick}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Settings</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
        </nav>
      </div>
      <div className="mt-8">{getTabContent()}</div>
    </div>
  );
} 