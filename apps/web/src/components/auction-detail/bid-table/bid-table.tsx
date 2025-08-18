'use client';

import { useEffect, useMemo, useState } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useQueryClient } from '@tanstack/react-query';

import { BidTableHead, BidTableRow } from '@/components/auction-detail';

import { bidKeys } from '@/hooks/queries/bids/keys';
import { useBidRealtime } from '@/hooks/realtime/useBidRealtime';

import { BidListResponse, BidType } from '@/types/bid';

interface BidTableProps {
  auctionId: string;
  initialBids?: BidType[];
  isExpired?: boolean;
}
const BidTable = ({ auctionId, initialBids, isExpired = false }: BidTableProps) => {
  const [animationParent] = useAutoAnimate();
  const [hasAnimated, setHasAnimated] = useState(false);

  const queryClient = useQueryClient();

  // 실시간 입찰 업데이트 훅 사용 (종료된 경매에서는 비활성화)
  useBidRealtime({ auctionId, limits: 10, isExpired });

  const bidQueryKey = bidKeys.list(auctionId, 10);
  const cachedBidsData = queryClient.getQueryData<BidListResponse>(bidQueryKey);

  const currentBids = useMemo(() => {
    return cachedBidsData?.data || initialBids || [];
  }, [cachedBidsData?.data, initialBids]);

  const sortedBids = useMemo(() => {
    return [...currentBids].sort((a, b) => Number(b.price) - Number(a.price)).slice(0, 5);
  }, [currentBids]);

  useEffect(() => {
    if (currentBids.length > 0 && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [currentBids.length, hasAnimated]);

  return (
    <div className="bg-primary-50/60 rounded-sm p-3 [&_p]:flex-1">
      {currentBids.length < 1 ? (
        <p className="py-8 text-center">아직 입찰 내역이 없습니다.</p>
      ) : (
        <>
          <BidTableHead />
          <div className="relative">
            <span className="w-7.5 absolute flex h-full items-center justify-center text-neutral-400">
              <i className="bg-primary-100 h-8/10 block w-1"></i>
            </span>
            <ul ref={animationParent} className="space-y-2">
              {sortedBids.map((item) => {
                return <BidTableRow key={item.id} item={item} />;
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default BidTable;
