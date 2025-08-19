'use client';

import { useEffect, useRef } from 'react';

import { ListX } from 'lucide-react';

import AuctionCardSkeleton from '@/components/auction/auction-card-skeleton';
import { FilterTab, AuctionCard } from '@/components/common';

import { useMySales } from '@/hooks/queries/profile';

import { AUCTION_TABS_BASIC } from '@/lib/constants/tabs';
import { convertToAuctionItemProps } from '@/lib/utils/auction';
import { useFilterStore } from '@/lib/zustand/store';

import { AuctionStatus } from '@/types/filter';

type BasicTabId = 'all' | 'ongoing' | 'completed';

const TAB_STATUS_MAP: Record<BasicTabId, AuctionStatus[]> = {
  all: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
  ongoing: ['ACTIVE'],
  completed: ['COMPLETED', 'CANCELLED'],
};

const SalesList = () => {
  const selectedTab = (useFilterStore((store) => store.selectedItems.trade) || 'all') as BasicTabId;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useMySales(TAB_STATUS_MAP[selectedTab]);

  const allSales = data?.pages.flatMap((page) => page.data) || [];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div>
        <FilterTab filterKey="trade" items={AUCTION_TABS_BASIC} />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <AuctionCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <FilterTab filterKey="trade" items={AUCTION_TABS_BASIC} />
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="text-danger-600 text-lg">
            판매 내역을 불러오는 중 오류가 발생했습니다.
          </div>
          <button
            onClick={() => refetch()}
            className="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-white transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FilterTab filterKey="trade" items={AUCTION_TABS_BASIC} />

      <div className="flex flex-col gap-3">
        {allSales.length > 0 ? (
          allSales.map((auction, idx) => {
            const auctionItemProps = convertToAuctionItemProps(auction);
            return <AuctionCard key={auction.id} {...auctionItemProps} idx={idx} />;
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-2 text-neutral-400">
              <ListX size={60} />
            </div>
            <p className="text-neutral-600">판매하신 경매가 없습니다.</p>
          </div>
        )}
      </div>

      <div ref={loadMoreRef} className="flex justify-center py-4">
        {isFetchingNextPage ? (
          <div className="text-neutral-600">잠시만 기다려주세요</div>
        ) : hasNextPage ? (
          <div className="text-neutral-400">스크롤해서 더 보기</div>
        ) : allSales.length > 0 ? (
          <div className="text-neutral-400">마지막 게시글입니다</div>
        ) : null}
      </div>
    </div>
  );
};

export default SalesList;
