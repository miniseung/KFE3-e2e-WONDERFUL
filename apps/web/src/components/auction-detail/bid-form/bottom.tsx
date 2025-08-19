'use client';

import { ButtonFavorite } from '@/components/auction-detail/';
import { Button } from '@/components/ui';

import { formatCurrencyWithUnit } from '@/lib/utils/price';

import { BidBaseProps } from '@/types/bid';

const BidFormBottom = ({ auctionId, currentPrice, isExpired, isOwnAuction }: BidBaseProps) => {
  const formattedCurrentPrice = formatCurrencyWithUnit(currentPrice);

  return (
    <div className="z-40 flex items-center gap-2 bg-white px-5 pb-6 pt-3">
      <ButtonFavorite auctionId={auctionId} />
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium text-neutral-600">
          {isExpired ? '최종 낙찰가' : '현재 입찰가'}
        </span>
        <span className="text-xl font-bold text-indigo-500">{formattedCurrentPrice}</span>
      </div>
      <Button
        size="medium"
        color={isExpired || isOwnAuction ? 'disabled' : 'primary'}
        disabled={isExpired || isOwnAuction}
        className={`w-1/3`}
      >
        {isExpired ? '경매종료' : '입찰하기'}
      </Button>
    </div>
  );
};

export default BidFormBottom;
