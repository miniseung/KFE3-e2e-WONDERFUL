'use client';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import Thumbnail from '@/components/ui/thumbnail';

import useCountdown from '@/hooks/common/useCountdown';

import { AuctionItemProps } from '@/types/auction';

const renderTimeBadge = ({
  hours,
  minutes,
  isExpired,
}: {
  hours: string;
  minutes: string;
  isExpired: boolean;
}) => {
  if (isExpired) {
    return (
      <Badge variant="closed" className="pl-1 text-xs font-medium">
        ⏱️ 종료됨
      </Badge>
    );
  }

  const timeBadgeStyle = hours === '00' && minutes === '00' ? 'closed' : 'tertiary';

  return (
    <Badge variant={timeBadgeStyle} className="pl-1 text-xs font-medium">
      ⏱️ {`${hours}:${minutes}`}
    </Badge>
  );
};

const AuctionItemCard = ({
  id,
  title,
  idx,
  status,
  originalPrice,
  currentPrice,
  deadline,
  thumbnailUrl,
}: AuctionItemProps) => {
  const { hours, minutes, isExpired } = useCountdown(new Date(deadline), 'minute');

  const isAuctionEnded = status === '경매종료' || isExpired;
  return (
    <Link
      href={`/auction/${id}`}
      className="relative mb-2 flex w-full items-center justify-between gap-2.5 overflow-hidden"
    >
      <div className="z-auto">
        <Thumbnail
          url={thumbnailUrl}
          alt={`${title} 썸네일`}
          size={86}
          priority={idx! < 5}
          quality={75}
          fetchPriority={idx === 0 ? 'high' : undefined}
        />
      </div>
      <div className="w-full shrink">
        <p className="leading-5.5 text-h5 mb-1.5 line-clamp-2 font-medium text-neutral-900">
          {title}
        </p>
        <div className="flex justify-between">
          <div className="w-fll flex flex-col justify-evenly gap-2">
            <p className="font-regular text-xs leading-3 text-neutral-400">
              시작가 <span className="line-through">{originalPrice.toLocaleString()}</span>
            </p>
            {renderTimeBadge({ hours, minutes, isExpired: isAuctionEnded })}
          </div>
          <div className="flex w-full shrink flex-col justify-end gap-2 text-right">
            <p className="text-xs leading-3 text-neutral-600">현재 입찰가</p>
            <p className="text-h5 text-primary-500 leading-none">
              <strong className="mr-0.5">{currentPrice.toLocaleString('ko-KR')}</strong>
              <span className="text-xs">원</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuctionItemCard;
