'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import Footer from '@/components/footer/footer';
import Image from 'next/image';

// Types
interface PostCardProps {
  category: string;
  author: string;
  readTime: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface CategoryTagProps {
  name: string;
  isActive?: boolean;
  onClick?: () => void;
}

// Constants
const CATEGORIES = ['All', 'Design', 'Technology', 'Jobs', 'Management', 'Uncategorized'];

const SAMPLE_POST: PostCardProps = {
  category: 'DESIGN',
  author: 'Jasper Dumn',
  readTime: '7 min read',
  date: 'Oct 13',
  title: 'The Best Wiki Software Tools for Teams in 2033',
  description: 'How do you create compelling presentations that wow your colleagues and impress your mangers?',
  imageUrl: '/images/bg2.png'
};

// Components
const CategoryTag: React.FC<CategoryTagProps> = ({ name, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`px-[10px] my-10 py-[6px] text-base rounded-md border transition-all duration-300 ${isActive
      ? 'border-black bg-black text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
      : 'border-[#E1E4EA] hover:border-black hover:bg-black hover:text-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer'
      }`}
  >
    {name}
  </div>
);

const PostCard: React.FC<PostCardProps> = ({
  category,
  author,
  readTime,
  date,
  title,
  description,
  imageUrl
}) => (
  <div className="group w-[384px] h-[504px] rounded-[24px] border border-[#E1E4EA] p-5 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:translate-y-[-8px]">
    <div className="overflow-hidden rounded-xl">
      <Image
        src={imageUrl}
        alt={title}
        width={344}
        height={240}
        className="mb-5 max-w-[344px] mx-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
        style={{ color: "transparent", filter: "blur(0px)" }}
      />
    </div>
    <div className="h-[204px] mt-5 flex flex-col justify-between">
      <div className="flex justify-between items-center py-1">
        <span className="text-[#335CFF] h-5 font-medium">{category}</span>
        <span className="text-gray-600 text-sm">{author} | {readTime} | {date} |</span>
      </div>
      <h4 className="text-6 font-medium h-[4rem] line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </h4>
      <p className="text-gray-600 mb-4 line-clamp-2">
        {description}
      </p>
      <a
        href="#"
        className="text-blue-500 pr-3 inline-flex items-center group-hover:text-blue-700 transition-all duration-300 group-hover:translate-x-2"
      >
        Read More <i className="fa-solid fa-arrow-right ml-1"></i>
      </a>
    </div>
  </div>
);

const Pagination: React.FC = () => (
  <nav className="flex items-center justify-center space-x-2 my-10 mb-50" aria-label="Pagination">
    <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100">&lt;</button>
    {[1, 2, 3].map((page) => (
      <a
        key={page}
        href="#"
        className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        {page}
      </a>
    ))}
    <span className="px-3 py-1 text-gray-500">...</span>
    <a href="#" className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
      10
    </a>
    <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100">&gt;</button>
  </nav>
);

export default function PostListPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [, lang] = usePathname().split('/');

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <div className="items-center justify-center min-h-[50vh] container mx-auto px-4">
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-[4rem] font-500 text-center my-4">Latest Post</h1>

        <div className="flex my-4 justify-center gap-4">
          {CATEGORIES.map((category) => (
            <CategoryTag
              key={category}
              name={category}
              isActive={category === 'All'}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 -mx-4">
          <PostCard {...SAMPLE_POST} />
          <PostCard {...SAMPLE_POST} />
          <PostCard {...SAMPLE_POST} />
          <PostCard {...SAMPLE_POST} />
          <PostCard {...SAMPLE_POST} />
          <PostCard {...SAMPLE_POST} />
        </div>

        <Pagination />
      </div>

      <Footer />
    </div>
  );
}
