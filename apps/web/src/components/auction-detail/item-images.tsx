'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

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
