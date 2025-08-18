'use client';

import { useRef, useMemo, useCallback, useEffect } from 'react';

import { useParams } from 'next/navigation';

import {
  BidForm,
  BidTable,
  ButtonChat,
  ItemDescription,
  ItemImages,
  ItemSummary,
  Skeleton,
} from '@/components/auction-detail/index';

import useCountdown from '@/hooks/common/useCountdown';
import { useAuctionDetail } from '@/hooks/queries/auction';
import { useCurrentUser } from '@/hooks/queries/auth';
import { useBidsByAuction } from '@/hooks/queries/bids';

import { updateAuctionStatus } from '@/lib/actions/auction';
import { cn } from '@/lib/cn';
import { ItemInfo } from '@/lib/types/auction';

import { BidType } from '@/types/bid';

import { ProfileCard } from '../common';

const AuctionDetailContainer = () => {
  const bidTableRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const { id } = params;
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();

  const {
    data: auctionDetailData,
    isLoading: isAuctionLoading,
    error,
    refetch: refetchAuction,
  } = useAuctionDetail(id as string);

  const { data: initialBidsData, isLoading: isBidsLoading } = useBidsByAuction(id as string, 10);

  const countdown = useCountdown(
    auctionDetailData?.data ? new Date(auctionDetailData.data.endTime) : null,
    'second'
  );

  const isCountdownReady = useMemo(() => {
    if (auctionDetailData?.data && !countdown) return false;
    if (
      auctionDetailData?.data &&
      countdown.hours === '00' &&
      countdown.minutes === '00' &&
      countdown.seconds === '00' &&
      !countdown.isExpired
    ) {
      return false;
    }
    return true;
  }, [auctionDetailData?.data, countdown]);

  const countdownData = useMemo(
    () => ({
      hours: countdown.hours,
      minutes: countdown.minutes,
      seconds: countdown.seconds,
      isExpired: countdown.isExpired,
    }),
    [countdown.hours, countdown.minutes, countdown.seconds, countdown.isExpired]
  );

  const isLoadingWithAllData = useMemo(() => {
    return (
      isUserLoading ||
      isAuctionLoading ||
      isBidsLoading ||
      !auctionDetailData?.data ||
      !isCountdownReady //
    );
  }, [isUserLoading, isAuctionLoading, isBidsLoading, auctionDetailData?.data, isCountdownReady]);

  const processImages = useCallback((): string[] => {
    if (!auctionDetailData?.data?.auctionImages?.length) return ['/no-image.png'];
    const allUrls = auctionDetailData.data.auctionImages.flatMap((image) => image.urls || []);
    return allUrls.length > 0 ? allUrls : ['/no-image.png'];
  }, [auctionDetailData?.data?.auctionImages]);

  const item: ItemInfo = useMemo(() => {
    if (!auctionDetailData?.data) return {} as ItemInfo;

    const auction = auctionDetailData.data;
    return {
      title: auction.title,
      status: auction.status,
      endTime: auction.endTime.toString(),
      description: auction.description || '',
      startPrice: auction.auctionPrice?.startPrice || 0,
      currentPrice: auction.auctionPrice?.currentPrice || 0,
      instantPrice: auction.auctionPrice?.instantPrice,
      minBidUnit: auction.auctionPrice?.minBidUnit || 1000,
      isInstantBuyEnabled: auction.auctionPrice?.isInstantBuyEnabled || false,
      bidCount: auction._count.bids,
      favoriteCount: auction._count.favoriteItems,
      isFavorite: auctionDetailData.userFavorite?.isFavorite || false,
      category: auction.category.name,
    };
  }, [auctionDetailData]);

  const chatRoomSellerProps = useMemo(() => {
    if (!auctionDetailData?.data?.seller) return { id: '', nickname: '' };
    return {
      id: auctionDetailData.data.seller.id,
      nickname: auctionDetailData.data.seller.nickname,
    };
  }, [auctionDetailData?.data?.seller]);

  useEffect(() => {
    if (!countdownData.isExpired || auctionDetailData?.data?.status === 'COMPLETED') {
      return;
    }

    const updateStatus = async () => {
      try {
        if (countdownData.isExpired && auctionDetailData?.data?.status !== 'COMPLETED') {
          await updateAuctionStatus(id as string, 'COMPLETED');
          refetchAuction();
        }
      } catch (error) {
        console.error('경매 상태 업데이트 실패:', error);
      }
    };

    updateStatus();
  }, [countdownData.isExpired, id, auctionDetailData?.data?.status, refetchAuction]);

  if (isLoadingWithAllData) {
    return <Skeleton />;
  }

  if (error || !auctionDetailData?.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="text-danger-600 text-lg">경매 정보를 불러오는 중 오류가 발생했습니다.</div>
        <button
          onClick={() => refetchAuction()}
          className="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-white transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 이 시점에서는 데이터가 확실히 존재
  const auction = auctionDetailData.data;

  const { location } = auction;
  const initialBids = (initialBidsData?.data as BidType[]) || [];
  const images = processImages();
  const sectionStyle = '[&_section]:w-full [&_section]:px-4 [&_section]:bg-white';

  return (
    <>
      <article className={cn(`flex flex-col items-center break-keep bg-neutral-100`, sectionStyle)}>
        <ItemImages urls={images} title={auction.title} />
        <ProfileCard
          nickname={auction.seller.nickname}
          profileImg={auction.seller.profileImg ? auction.seller.profileImg : '/avatar-female.svg'}
          location={location?.locationName}
          className="w-full"
        >
          {currentUser?.id !== auction.seller.id && !countdownData.isExpired && (
            <ButtonChat auctionId={auction.id} seller={chatRoomSellerProps} />
          )}
        </ProfileCard>
        <ItemSummary item={item} id={id as string} countdown={countdownData} />
        <ItemDescription item={item} />
        <section ref={bidTableRef} className="space-y-2 pb-10 pt-6">
          <h3 className="mb-2.5 text-base font-bold">입찰 현황</h3>
          <BidTable
            auctionId={auction.id}
            initialBids={initialBids}
            isExpired={countdownData.isExpired}
          />
        </section>
      </article>
      <aside className="sticky bottom-0 z-50 w-full">
        <BidForm
          auctionId={auction.id}
          minBidUnit={item.minBidUnit}
          currentPrice={item.currentPrice}
          endTime={item.endTime}
          bidTableRef={bidTableRef}
          isExpired={countdownData.isExpired} // 실제 만료 상태 전달
          seller={chatRoomSellerProps}
          currentUserId={currentUser?.id}
        />
      </aside>
    </>
  );
};

export default AuctionDetailContainer;
