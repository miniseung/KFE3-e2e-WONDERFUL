'use client';

import { useMemo } from 'react';

import { ListX } from 'lucide-react';

import AuctionItemCardSkeleton from '@/components/auction/auction-card-skeleton';
import { AuctionCard } from '@/components/common';

import { useAuctions } from '@/hooks/queries/auction';

import { SortOption } from '@/lib/types/auction-prisma';
import { convertToAuctionItemProps } from '@/lib/utils/auction';
import { useFilterStore, useLocationStore } from '@/lib/zustand/store';

import { AuctionStatus } from '@/types/filter';

export interface AuctionItemListProps {
  sortOption?: SortOption;
  includeCompleted?: boolean;
  selectedStatuses?: AuctionStatus[];
}

const AuctionItemList = ({
  sortOption = 'latest',
  includeCompleted = true,
  selectedStatuses,
}: AuctionItemListProps) => {
  const categoryId = useFilterStore((s) => s.selectedItems.category);
  const location = useLocationStore((s) => s.selectedLocation.locationName);

  const { data, isLoading, error, refetch } = useAuctions(
    location !== '위치 설정 필요' ? location : undefined,
    categoryId || undefined,
    sortOption,
    includeCompleted
  );

  const filtered = useMemo(() => {
    const list = data?.data ?? [];
    const withoutCompleted = includeCompleted ? list : list.filter((a) => a.status !== 'COMPLETED');
    if (selectedStatuses?.length) {
      return withoutCompleted.filter((a) => selectedStatuses.includes(a.status as AuctionStatus));
    }
    return withoutCompleted;
  }, [data?.data, includeCompleted, selectedStatuses]);

  if (isLoading) {
    return (
      <div className="flex min-h-[100vhd] flex-col">
        {Array.from({ length: 5 }).map((_, i) => (
          <AuctionItemCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="text-danger-600 text-lg">경매 목록을 불러오는 중 오류가 발생했습니다.</div>
        <button
          onClick={() => refetch()}
          className="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-white transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {filtered.length > 0 ? (
        filtered.map((auction, idx) => {
          const props = convertToAuctionItemProps(auction);
          return <AuctionCard key={auction.id} {...props} idx={idx} />;
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-2 text-neutral-400">
            <ListX size={60} />
          </div>
          <p className="text-neutral-600">진행 중인 경매가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default AuctionItemList;
