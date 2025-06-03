'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/footer/footer';
// Reusable category card component
const CategoryCard = ({
  title,
  articleCount,
  articles,
  href,
}: {
  title: string;
  articleCount: number;
  articles: string[];
  href: string;
}) => (
  <Link href={href}>
    <div className="bg-white rounded-[24px] border border-[#E1E4EA] p-8 min-h-[474px] relative hover:border-blue-500 transition-colors">
      <div className="space-y-6">
        <div className='border-b border-[#E1E4EA] pb-4'>
          <h3 className="text-[24px] font-medium">{title}</h3>
          <p className="text-gray-600 text-[18px]">{articleCount} articles</p>
        </div>

        <div className="space-y-6">
          {articles.map((article, index) => (
            <div key={index} className="flex items-center justify-between group cursor-pointer border-b border-[#E1E4EA] pb-4">
              <span className="text-[18px] group-hover:text-blue-600 transition-colors">{article}</span>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>

        <button className="mt-8 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors
         border border-[#E1E4EA] rounded-[12px] px-4 py-2 absolute bottom-4 left-4">
          Show all
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </Link>
);

export default function FAQPage() {
  const categories = [
    {
      title: "General",
      articleCount: 3,
      articles: [
        "Frequently Asked Questions",
        "Using the Insights section",
        "What's KnowledgeBase?"
      ],
      href: "/help/faq/general"
    },
    {
      title: "Help Center",
      articleCount: 7,
      articles: [
        "Setting up Custom Domain for Help Center",
        "Customize Articles appearance in Chat Widget",
        "Setting Up And Customizing Help Center"
      ],
      href: "/help/faq/help-center"
    },
    {
      title: "Articles Management",
      articleCount: 7,
      articles: [
        "Write, Format, And Publish Articles To Your...",
        "Articles' Visibility Control",
        "Formatting KnowledgeBase Articles"
      ],
      href: "/help/faq/articles"
    },
    {
      title: "Billing and Payments",
      articleCount: 2,
      articles: [
        "Managing your KnowledgeBase subscription",
        "Subscription FAQ"
      ],
      href: "/help/faq/billing"
    },
    {
      title: "Integrations",
      articleCount: 2,
      articles: [
        "Get KnowledgeBase answers directly in Chatbot chat",
        "HelpDesk integration: Use help center articles when handlin..."
      ],
      href: "/help/faq/integrations"
    },
    {
      title: "Internal Widget",
      articleCount: 1,
      articles: [
        "Using Quick Replies to handle your chats faster"
      ],
      href: "/help/faq/widget"
    },
    {
      title: "Feature updates",
      articleCount: 5,
      articles: [
        "Multiple knowledge bases",
        "Using the Insights section",
        "What's KnowledgeBase?",
      ],
      href: "/help/faq/updates"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Search Section */}
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

      {/* Categories Section */}
      <div>
        <h2 className="text-[40px] font-medium mb-6">Browse by categories</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              title={category.title}
              articleCount={category.articleCount}
              articles={category.articles}
              href={category.href}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
