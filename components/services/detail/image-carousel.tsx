'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { cn } from '@/utils/cn';

interface ImageCarouselProps {
  images: string[];
  altPrefix?: string;
}

export function ImageCarousel({
  images,
  altPrefix = 'Service Image',
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="bg-bg-subtle-100 mb-4 flex h-64 items-center justify-center rounded-xl sm:h-80 md:h-96">
        <p className="text-text-secondary-600">No images available</p>
      </div>
    );
  }

  const nextSlide = () =>
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const setSlide = (index: number) => setActiveIndex(index);

  return (
    <div className="mb-4 max-w-[824px]">
      {/* Main Image */}
      <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-xl sm:aspect-[4/3] md:aspect-[3/2]">
        <Image
          src={images[activeIndex]}
          alt={`${altPrefix} ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          // style={{ objectFit: 'contain' }}
          priority={activeIndex === 0}
          className="bg-bg-subtle-100 max-h-[600px] h-full"
        />

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1 text-black transition-all hover:bg-white"
              aria-label="Previous"
            >
              <RiArrowLeftSLine className="size-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1 text-black transition-all hover:bg-white"
              aria-label="Next"
            >
              <RiArrowRightSLine className="size-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
          {images.map((imgSrc, index) => (
            <button
              key={index}
              onClick={() => setSlide(index)}
              className={cn(
                'relative w-[191px] h-[164px] mr-[20px] shrink-0 overflow-hidden rounded-[10px] transition-all',
                activeIndex === index
                  ? 'border-primary-base'
                  : 'border-transparent hover:border-primary-soft-200'
              )}
            >
              <Image
                src={imgSrc}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="191px"
                style={{ objectFit: 'contain' }}
                className="bg-bg-subtle-100"
              />
              {activeIndex !== index && (
                <div className="absolute inset-0 bg-white/60" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
