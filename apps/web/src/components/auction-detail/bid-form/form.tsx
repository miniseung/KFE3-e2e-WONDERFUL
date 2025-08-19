'use client';

import { useState } from 'react';

import { X } from 'lucide-react';

import { BidFormBottom, BidFormInput, ButtonDirectDeal } from '@/components/auction-detail';

import { useBidMutation } from '@/hooks/mutations/bids';
import { useAuctionDetail } from '@/hooks/queries/auction';

import { cn } from '@/lib/cn';
import { validateBidPrice } from '@/lib/utils/bid-validation';
import { formatCurrencyWithUnit } from '@/lib/utils/price';

import { BidFormProps } from '@/types/bid';

const BidForm = ({
  auctionId,
  currentPrice,
  endTime,
  bidTableRef,
  seller,
  currentUserId,
  isExpired,
}: BidFormProps) => {
  const [isBidInputOpen, setIsBidInputOpen] = useState<boolean>(false);
  const [bidPrice, setBidPrice] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string>('');

  const { data } = useAuctionDetail(auctionId);
  const minBidUnit = data?.data.auctionPrice?.minBidUnit || 1000;

  const bidMutation = useBidMutation();

  // 실시간으로 업데이트되는 현재 가격 사용
  // React Query 캐시에서 최신 데이터를 가져오되, 없으면 props의 currentPrice 사용
  const realtimeCurrentPrice = data?.data.auctionPrice?.currentPrice || currentPrice;

  const isOwnAuction = currentUserId === seller.id;

  const handleBidPriceChange = (price: number | null) => {
    setBidPrice(price);

    if (price !== null) {
      const validation = validateBidPrice(price, realtimeCurrentPrice, minBidUnit);
      setValidationError(validation.isValid ? '' : validation.message);
    } else {
      setValidationError('');
    }
  };

  const handleBidClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isExpired) {
      alert('경매가 종료되어 입찰할 수 없습니다.');
      return;
    }

    if (!isBidInputOpen) {
      setIsBidInputOpen(true);
      return;
    }

    const finalBidPrice = bidPrice ?? realtimeCurrentPrice + minBidUnit;

    const validation = validateBidPrice(finalBidPrice, realtimeCurrentPrice, minBidUnit || 1000);
    if (!validation.isValid) {
      setValidationError(validation.message);
      return;
    }

    try {
      const currentScrollY = window.scrollY;

      setValidationError('');
      setBidPrice(null);
      setIsBidInputOpen(false);

      await bidMutation.mutateAsync({
        auctionId,
        bidPrice: finalBidPrice,
      });

      setValidationError('');
      setBidPrice(null);

      setTimeout(() => {
        window.scrollTo(0, currentScrollY);
        bidTableRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (error) {
      setIsBidInputOpen(true);
      const errorMessage = error instanceof Error ? error.message : '입찰 중 오류가 발생했습니다.';
      setValidationError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleBidClick}>
      <div className={cn('w-full bg-white transition-all duration-500 ease-in-out')} />
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-[98%] z-0 h-2/5',
          'from-black/18 bg-gradient-to-t to-transparent',
          'duration-600 transition-all',
          !isBidInputOpen && 'h-6 opacity-30'
        )}
      />
      <div
        className={cn('duration-600 relative z-20 rounded-t-sm bg-white px-5 pt-2 transition-all')}
      >
        {!isExpired && data?.data.auctionPrice?.isInstantBuyEnabled && !isOwnAuction && (
          <ButtonDirectDeal
            directPrice={formatCurrencyWithUnit(realtimeCurrentPrice * 1.2)}
            auctionId={auctionId}
            seller={seller}
            currentUserId={currentUserId}
          />
        )}
        <BidFormInput
          auctionId={auctionId}
          currentPrice={realtimeCurrentPrice}
          minUnit={minBidUnit}
          bidPrice={bidPrice}
          isBidInputOpen={isBidInputOpen}
          onChange={handleBidPriceChange}
          validationError={validationError}
        />
      </div>
      <button
        type="button"
        onClick={() => setIsBidInputOpen(false)}
        className={`duration-600 invisible absolute right-2.5 top-0 translate-y-[-100%] p-2 text-white opacity-0 ${isBidInputOpen && 'visible opacity-100'}`}
      >
        <X size={'30'} />
      </button>
      <BidFormBottom
        auctionId={auctionId}
        currentPrice={realtimeCurrentPrice}
        endTime={endTime}
        isExpired={isExpired}
        seller={seller}
        isValid={!validationError && bidPrice !== null}
        isOwnAuction={isOwnAuction}
      />
    </form>
  );
};

export default BidForm;
