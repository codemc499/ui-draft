'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RiArrowRightSLine } from '@remixicon/react';
import * as LinkButton from '@/components/ui/link-button';
import Link from 'next/link';
import i18n from '@/i18n';
import Translate from '@/components/Translate';

interface Service {
  id: string;
  title: string;
  description: string;
}

const HotServices = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call
    const fetchServices = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/services/hot');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching hot services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          <Translate id="home.sections.hotServices" />
        </h2>
        <LinkButton.Root
          variant="gray"
          size="small"
          className="text-surface-800 text-sm font-medium"
          asChild
        >
          <Link href={`/${i18n.language}/services`} className="leading-none underline">
            <Translate id="home.sections.more" />
            <LinkButton.Icon as={RiArrowRightSLine} className="size-6" />
          </Link>
        </LinkButton.Root>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="rounded-lg border p-4">
            <h3 className="font-medium">{service.title}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotServices; 