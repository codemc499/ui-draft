'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Tabs from '@/components/ui/tabs';
import Banner from './Banner';
import SectionHeader from './SectionHeader';
import ServiceCard from '../cards/ServiceCard';
import WorkerCard from '../cards/WorkerCard';
import { serviceOperations, userOperations } from '@/utils/supabase/database';
import { Service, User } from '@/utils/supabase/types';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

// Shuffle array function
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Main Content Component
const MainContent = () => {
  const { t } = useTranslation('common');
  const tabItems = ['All', 'Offers', 'Completed', 'Cancelled'];
  const [activeTab, setActiveTab] = useState(tabItems[0]);
  const [recentServices, setRecentServices] = useState<Service[]>([]);
  const [categoryServices, setCategoryServices] = useState<Service[]>([]);
  const [recentWorkers, setRecentWorkers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(true);

  // Fetch services
  useEffect(() => {
    async function fetchRecentServices() {
      try {
        setIsLoading(true);
        // Fetch services from Supabase
        const services = await serviceOperations.getAllServices();

        console.log('Raw services data fetched:', services);

        if (services && Array.isArray(services) && services.length > 0) {
          // Take the 3 most recent services for Hot Services
          const recent = services.slice(0, 3);
          console.log('Recent services to display:', recent);

          // Set the state with the fetched services
          setRecentServices(recent);

          // Shuffle services for Category Ranking
          const shuffled = shuffleArray(services);
          // Take a different set of services for Category Ranking (up to 3)
          const categorySet = shuffled.slice(0, 3);
          setCategoryServices(categorySet);

          // Console log the seller IDs
          console.log('Seller IDs:', recent.map(service => service.seller_id));
        } else {
          console.warn('No services returned from API or empty array');
          setRecentServices([]);
          setCategoryServices([]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setRecentServices([]);
        setCategoryServices([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentServices();
  }, []);

  // Fetch workers
  useEffect(() => {
    async function fetchRecentWorkers() {
      try {
        setIsLoadingWorkers(true);
        // Fetch workers (sellers) from Supabase
        const workers = await userOperations.getRecentWorkers(3);

        console.log('Recent workers fetched:', workers);

        if (workers && Array.isArray(workers) && workers.length > 0) {
          setRecentWorkers(workers);
        } else {
          console.warn('No workers returned from API or empty array');
          setRecentWorkers([]);
        }
      } catch (error) {
        console.error('Error fetching workers:', error);
        setRecentWorkers([]);
      } finally {
        setIsLoadingWorkers(false);
      }
    }

    fetchRecentWorkers();
  }, []);

  return (
    <main className='flex-1 relative'>
      <Banner />

      {/* New container for sections */}
      <div className="max-w-[1052px] flex flex-col gap-7">
        {/* Hot Services Section */}
        <section className="flex flex-col max-w-[1052px] max-h-[332px]">
          <SectionHeader title={t('home.sections.hotServices')} href={`/${i18n.language}/services/search?tab=Service`} />
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {isLoading ? (
              // Loading state
              <>
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
              </>
            ) : recentServices.length > 0 ? (
              // Map through fetched services
              recentServices.map((service) => (
                <Link key={service.id} href={`/${i18n.language}/services/${service.id}`} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg block max-w-[340px] h-[284px]">
                  <ServiceCard service={service} />
                </Link>
              ))
            ) : (
              // No services found
              <div className="col-span-3 text-center py-8 text-gray-500">
                {t('home.sections.noServices')}
              </div>
            )}
          </div>
        </section>

        {/* Hot Workers Section */}
        <section>
          <SectionHeader title={t('home.sections.hotWorkers')} href={`/${i18n.language}/services/search?tab=Worker`} />
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {isLoadingWorkers ? (
              // Loading state
              <>
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
              </>
            ) : recentWorkers.length > 0 ? (
              // Map through fetched workers
              recentWorkers.map((worker) => (
                <Link key={worker.id} href={`/${i18n.language}/users/${worker.id}`} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg">
                  <WorkerCard worker={worker} />
                </Link>
              ))
            ) : (
              // Placeholder workers if none found
              Array(3).fill(0).map((_, index) => (
                <WorkerCard key={`worker-${index}`} />
              ))
            )}
          </div>
        </section>

        {/* Category Ranking Section */}
        <section className="flex flex-col max-w-[1052px] max-h-[332px] gap-4">
          <SectionHeader title={t('home.sections.categoryRanking')} href={`/${i18n.language}/services/search?tab=Service`} />
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {isLoading ? (
              // Loading state
              <>
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
              </>
            ) : categoryServices.length > 0 ? (
              // Map through shuffled services
              categoryServices.map((service) => (
                <Link key={`category-${service.id}`} href={`/${i18n.language}/services/${service.id}`} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg block max-w-[340px] h-[284px]">
                  <ServiceCard service={service} />
                </Link>
              ))
            ) : (
              // Placeholder data if no real services
              Array(3).fill(0).map((_, index) => {
                const placeholderService: Service = {
                  id: `placeholder-${index}`,
                  title: t('home.placeholders.service.title'),
                  description: t('home.placeholders.service.description'),
                  price: 99,
                  seller_id: 'placeholder-seller',
                  seller_name: t('home.placeholders.service.seller'),
                  audio_url: null,
                  lead_time: 7,
                  currency: 'USD',
                  images: [{
                    name: 'placeholder.jpg',
                    size: 1000,
                    url: 'https://placekitten.com/300/200'
                  }],
                  includes: ['Source Files', 'Commercial Use License'],
                  tags: ['placeholder', 'category']
                };
                return <ServiceCard key={`category-${index}`} service={placeholderService} />;
              })
            )}
          </div>
        </section>

        <section className='mt-8'>
        </section>

        {/* Review Section */}
        <section className='mt-8'>{/* Review content */}</section>
      </div>
    </main>
  );
};

export default MainContent;
