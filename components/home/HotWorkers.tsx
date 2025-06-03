'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RiArrowRightSLine } from '@remixicon/react';
import * as LinkButton from '@/components/ui/link-button';
import Link from 'next/link';
import i18n from '@/i18n';
import Translate from '@/components/Translate';

interface Worker {
  id: string;
  name: string;
  title: string;
  rating: number;
  completedProjects: number;
  avatar: string;
}

const HotWorkers = () => {
  const { t } = useTranslation();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call
    const fetchWorkers = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/workers/hot');
        const data = await response.json();
        setWorkers(data);
      } catch (error) {
        console.error('Error fetching hot workers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          <Translate id="home.sections.hotWorkers" />
        </h2>
        <LinkButton.Root
          variant="gray"
          size="small"
          className="text-surface-800 text-sm font-medium"
          asChild
        >
          <Link href={`/${i18n.language}/workers`} className="leading-none underline">
            <Translate id="home.sections.more" />
            <LinkButton.Icon as={RiArrowRightSLine} className="size-6" />
          </Link>
        </LinkButton.Root>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workers.map((worker) => (
          <div key={worker.id} className="rounded-lg border p-4">
            <div className="flex items-center space-x-4">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h3 className="font-medium">{worker.name}</h3>
                <p className="text-sm text-gray-600">{worker.title}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span>Rating: {worker.rating}</span>
              <span>Projects: {worker.completedProjects}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotWorkers; 