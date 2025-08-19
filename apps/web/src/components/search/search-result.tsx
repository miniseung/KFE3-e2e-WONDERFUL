'use client';

import { useEffect, useRef } from 'react';

import AuctionItemCardSkeleton from '@/components/auction/auction-card-skeleton';
import { AuctionCard, FilterTab } from '@/components/common';

import { useSearch } from '@/hooks/queries/search';

import { SEARCH_TAB_TO_STATUS_MAP } from '@/lib/constants/search';
import { AUCTION_TABS_BASIC } from '@/lib/constants/tabs';
import { AuctionListItem } from '@/lib/types/auction-prisma';
import { TabId } from '@/lib/types/filter';
import { SearchTabStatus } from '@/lib/types/search';
import { convertToAuctionItemProps } from '@/lib/utils/auction';
import { useFilterStore, useSortStore } from '@/lib/zustand/store';
import { useSearchStore } from '@/lib/zustand/store/search-store';

const SearchResult = () => {
  const { query } = useSearchStore();
  const selectedTab = (useFilterStore((store) => store.selectedItems.search) ?? 'all') as TabId;
  const sortOption = useSortStore((state) => state.sortOption);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const statusParam =
    SEARCH_TAB_TO_STATUS_MAP[selectedTab as keyof typeof SEARCH_TAB_TO_STATUS_MAP] || 'all';

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useSearch(
      query,
      {
        status: statusParam as SearchTabStatus,
        sort: sortOption,
      },
      !!query?.trim()
    );

  const allAuctions = data?.pages.flatMap((page) => page.data) || [];

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

  // 로딩 상태
  if (isLoading) {
    return (
      <>
        <div className="my-3 flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-89 h-[35px] animate-pulse rounded bg-neutral-200" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <AuctionItemCardSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="text-danger-600 text-lg">검색 중 오류가 발생했습니다.</div>
        <button
          onClick={() => refetch()}
          className="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-white transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 검색 결과 없음
  if (allAuctions.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <FilterTab filterKey={'search'} items={AUCTION_TABS_BASIC} />
        <div className="flex h-full items-center justify-center text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="text-neutral-400">
              <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="mb-1 text-lg font-medium text-neutral-900">검색 결과가 없습니다</h3>
              <p className="text-neutral-600">'{query}' 에 대한 검색 결과가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <FilterTab filterKey={'search'} items={AUCTION_TABS_BASIC} />
      <div className="flex flex-col">
        {allAuctions.map((auction: AuctionListItem) => {
          const auctionItemProps = convertToAuctionItemProps(auction);
          return <AuctionCard key={auction.id} {...auctionItemProps} />;
        })}
      </div>

      {/* 무한 스크롤 트리거 & 로딩 표시 */}
      <div ref={loadMoreRef} className="flex justify-center py-4">
        {isFetchingNextPage ? (
          <div className="text-neutral-600">잠시만 기다려주세요</div>
        ) : hasNextPage ? (
          <div className="text-neutral-400">스크롤해서 더 보기</div>
        ) : allAuctions.length > 0 ? (
          <div className="text-neutral-400">마지막 게시글입니다</div>
        ) : null}
      </div>
    </>
  );
};

export default SearchResult;
