'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import artistImage from '@/assets/images/artist_image_banner.png';
import { useTranslation } from 'react-i18next';
// import Image from 'next/image'; // Uncomment if using Next Image

// --- Banner Component ---
const Banner = () => {
  const { t } = useTranslation('common');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const dummyBanners = [
    {
      title: t('home.banner.rnb.title'),
      description: t('home.banner.rnb.description'),
      image: artistImage,
    },
    {
      title: t('home.banner.indie.title'),
      description: t('home.banner.indie.description'),
      image: artistImage,
    },
    {
      title: t('home.banner.jazz.title'),
      description: t('home.banner.jazz.description'),
      image: artistImage,
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBannerIndex(
        (prevIndex) => (prevIndex + 1) % dummyBanners.length,
      );
    }, 5000); // Change banner every 5 seconds

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const currentBanner = dummyBanners[currentBannerIndex];

  return (
    <div className='shadow-lg relative mb-6 min-h-[244px] overflow-hidden p-6 pl-12 text-white flex items-center  max-h-[248px] rounded-[20px] bg-[#253337]'>
      <div className='relative z-10 max-w-lg'>
        {/* Display dynamic content */}
        <h1 className='text-[32px] mb-2 font-semibold'>{currentBanner.title}</h1>
        <p className='text-[14px] mb-8 text-gray-300'>
          {currentBanner.description}
        </p>
        {/* Indicator Dots - Update based on current index */}
        <div className='flex gap-1.5'>
          {dummyBanners.map((_, index) => (
            <span
              key={index}
              className={cn(
                'block rounded-full transition-colors duration-300',
                index === currentBannerIndex ? 'bg-white h-1.5 w-3' : 'bg-gray-500 h-1.5 w-1.5',
              )}
            ></span>
          ))}
        </div>
      </div>
      {/* Image positioned absolutely on the right side */}
      {currentBanner.image && (
        <div className='absolute right-0 top-0 h-full w-[40%] overflow-hidden'>
          <Image
            src={currentBanner.image}
            alt={currentBanner.title}
            className='h-full w-full object-cover'
            width={400}
            height={244}
          />
        </div>
      )}
    </div>
  );
};

export default Banner;
