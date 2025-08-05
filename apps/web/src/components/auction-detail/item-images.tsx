'use client';

import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import Image from 'next/image';

const Carousel = dynamic(
  () => import('@/components/ui/carousel').then((mod) => ({ default: mod.Carousel })),
  {
    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="border-primary-500 mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p className="text-gray-600">이미지를 불러오는 중...</p>
        </div>
      </div>
    ),
  }
);

const CarouselContent = dynamic(
  () => import('@/components/ui/carousel').then((mod) => ({ default: mod.CarouselContent })),
  { ssr: false }
);

const CarouselItem = dynamic(
  () => import('@/components/ui/carousel').then((mod) => ({ default: mod.CarouselItem })),
  { ssr: false }
);

import type { CarouselApi } from '@/components/ui/carousel';

interface ItemImagesProps {
  urls: string[];
  title: string;
}

const ItemImages = ({ urls, title }: ItemImagesProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    const timer = setTimeout(() => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    }, 50);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    return () => clearTimeout(timer);
  }, [api, urls]);

  return (
    <Carousel className="relative h-3/5 w-full" setApi={setApi}>
      <CarouselContent>
        {urls?.map((url, index) => (
          <CarouselItem key={index} className="max-h-[360px]">
            <Image
              src={url}
              alt={`${title} 상품 상세 이미지 ${index + 1}`}
              className="aspect-square h-full w-full object-cover"
              width={500}
              height={500}
              sizes="100vw"
              priority={index === 0}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              quality={index === 0 ? 80 : 70}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {Array.from({ length: count }).map((_, idx) => (
          <span
            key={idx}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              current - 1 === idx ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </Carousel>
  );
};

export default ItemImages;
