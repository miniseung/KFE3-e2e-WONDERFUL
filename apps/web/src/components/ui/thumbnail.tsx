'use client';

import { HTMLAttributes } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/cn';

interface ThumbnailProps extends HTMLAttributes<HTMLDivElement> {
  url: string;
  alt: string;
  size: number;
  quality?: number;
  priority?: boolean;
  fetchPriority?: 'high' | undefined;
}

const Thumbnail = ({
  className,
  url,
  alt,
  size = 104,
  priority = false,
  fetchPriority,
  quality = 80,
  ...props
}: ThumbnailProps) => {
  console.log('Thumbnail props:', { size, url, devicePixelRatio: window.devicePixelRatio });

  return (
    <div
      className={cn(
        'flex-shrink-0 overflow-hidden rounded-md border border-neutral-200',
        className
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <Image
        src={url}
        alt={alt}
        className="h-full w-full object-cover"
        width={size}
        height={size}
        sizes={`${size}px`}
        quality={quality}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={fetchPriority}
        {...props}
      />
    </div>
  );
};

export default Thumbnail;
