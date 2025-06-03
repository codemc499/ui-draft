'use client';

import React from 'react';
import Link from 'next/link';
import { RiHome2Line, RiArrowRightSLine } from '@remixicon/react';
import Footer from '@/components/footer/footer';

const FaqItem = ({ title }: { title: string }) => (
  <div className="border-b border-[#E1E4EA] py-6">
    <div className="flex items-center justify-between cursor-pointer group">
      <h3 className="text-[18px] text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
      <RiArrowRightSLine className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

export default function GeneralFAQPage() {
  return (
    <div>
      <div className="text-center mb-12 bg-[#eee] py-20">
        <h1 className="text-[48px] font-medium mb-4">Hey, what answers do you need?</h1>
        <div className="max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Ask a question"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="container mx-[120px] px-6 py-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-gray-500 mb-8">
          <Link href="/help" className="flex items-center gap-1 hover:text-gray-900">
            <RiHome2Line className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <RiArrowRightSLine className="w-5 h-5" />
          <span className="text-gray-900">General</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-[2rem] font-medium mb-4">General</h1>

        {/* FAQ List */}
        <div className="max-w-3xl">
          <FaqItem title="Frequently Asked Questions" />
          <FaqItem title="Using the Insights section" />
          <FaqItem title="What's KnowledgeBase?" />
        </div>
      </div>
      <Footer />
    </div>

  );
} 