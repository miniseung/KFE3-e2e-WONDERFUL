'use client';

import { useState } from 'react';

import Link from 'next/link';

import { ProductCardSkeleton } from '@/components/chat';
import ProductCardError from '@/components/chat/product-card-error';
import productCardStyle from '@/components/chat/style';
import { Button } from '@/components/ui';
import Thumbnail from '@/components/ui/thumbnail';

import { useCurrentPrice } from '@/hooks/auction/useCurrentPrice';
import { useAuctionDetail } from '@/hooks/queries/auction';
import { useBidsByAuction } from '@/hooks/queries/bids';

import { updateAuctionStatus } from '@/lib/actions/auction';
import { formatCurrencyWithUnit } from '@/lib/utils/price';
import { useToastStore } from '@/lib/zustand/store/toast-store';
import { useUserStore } from '@/lib/zustand/store/user-store';

import { AuctionStatus } from '@/types/auction';

interface ProductInfoCardProps {
  auctionId: string;
  status: AuctionStatus;
}

const ProductInfoCard = ({ auctionId, status }: ProductInfoCardProps) => {
  const [isDone, setIsDone] = useState(status !== 'ACTIVE');
  const { showToast } = useToastStore();
  const currentUserId = useUserStore((state) => state.user?.id);

  const {
    data: auctionDetailData,
    isLoading,
    error,
    refetch: refetchAuction,
  } = useAuctionDetail(auctionId);

  const auction = auctionDetailData?.data;
  const { data: initialBidsData } = useBidsByAuction(auctionId, 1);

  const firstBid = initialBidsData?.data?.[0]?.price;
  const fallbackPrice =
    firstBid != null
      ? Number(firstBid)
      : Number(auction?.auctionPrice?.currentPrice ?? auction?.auctionPrice?.startPrice ?? 0);

  const { currentPrice, refetchCurrentPrice } = useCurrentPrice(auctionId, fallbackPrice);
  const price = formatCurrencyWithUnit(currentPrice);

  const color = isDone ? 'disabled' : 'primary';
  const href = !isDone ? `/item/${auction?.id}` : '';

  const handleComplete = () => {
    showToast({
      status: 'success',
      title: '거래 종료!',
      subtext:
        '거래가 종료되었습니다. 공유하신 주소와 계좌에 대한 메세지는 더 이상 보여지지 않습니다.',
      autoClose: true,
    });

    setIsDone(true);
    updateAuctionStatus(auctionId, 'COMPLETED');
  };

  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  if (error || !auctionDetailData?.data) {
    showToast({
      status: 'error',
      title: '불러오기 실패',
      subtext: '상품 불러오기가 실패했습니다. 다시 시도 버튼을 클릭해주세요.',
      autoClose: true,
    });

    return <ProductCardError onClick={() => refetchAuction()} />;
  }

  return (
    <div className={productCardStyle().wrapper()}>
      <div className={productCardStyle().content()}>
        {auction && auction.thumbnailUrl && auction.thumbnailUrl.length > 0 && (
          <Link href={href}>
            <Thumbnail
              url={auction.thumbnailUrl}
              alt={auction.title}
              className="shrink-0"
              size={52}
            />
          </Link>
        )}
        <p className={productCardStyle().infoBox()}>
          <span className="overflow-hidden truncate whitespace-nowrap text-base font-medium">
            {auction?.title}
          </span>
          <span className="text-sm font-medium text-neutral-600">현재가 {price}</span>
        </p>
      </div>
      <div className={productCardStyle().buttonBox()}>
        <Button
          variant="outline"
          color={color}
          size="min"
          onClick={() => refetchCurrentPrice()}
          disabled={isDone}
          className="w-1/5"
        >
          새로고침
        </Button>
        {auction?.seller.id == currentUserId && (
          <Button
            variant="outline"
            color={color}
            size="min"
            onClick={handleComplete}
            className="w-1/5"
            disabled={isDone}
          >
            거래종료
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductInfoCard;
