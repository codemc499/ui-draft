'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RiArrowRightSLine } from '@remixicon/react';
import * as LinkButton from '@/components/ui/link-button';
import Link from 'next/link';
import i18n from '@/i18n';
import Translate from '@/components/Translate';

interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

const CategoryRanking = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call
    const fetchCategories = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/categories/ranking');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching category rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          <Translate id="home.sections.categoryRanking" />
        </h2>
        <LinkButton.Root
          variant="gray"
          size="small"
          className="text-surface-800 text-sm font-medium"
          asChild
        >
          <Link href={`/${i18n.language}/categories`} className="leading-none underline">
            <Translate id="home.sections.more" />
            <LinkButton.Icon as={RiArrowRightSLine} className="size-6" />
          </Link>
        </LinkButton.Root>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <div key={category.id} className="rounded-lg border p-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="h-6 w-6"
                />
              </div>
              <div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-gray-600">
                  <Translate id="home.sections.services" values={{ count: category.count }} />
                </p>
              </div>
              <div className="ml-auto text-2xl font-bold text-primary-600">
                #{index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryRanking; 