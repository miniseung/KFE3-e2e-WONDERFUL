'use client';

import { useEffect, useRef, useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { bidKeys } from '@/hooks/queries/bids/keys';
import { auctionKeys } from '@/hooks/queries/auction/keys';

import { createClient } from '@/lib/supabase/client';

import { BidListResponse, BidType } from '@/types/bid';

interface UseBidRealtimeProps {
  auctionId: string;
  limits?: number;
  isExpired?: boolean;
}

// 전역적으로 활성 채널들을 추적하여 중복 방지
const activeChannels = new Map<string, any>();

export const useBidRealtime = ({
  auctionId,
  limits = 10,
  isExpired = false,
}: UseBidRealtimeProps) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  const cleanupChannel = useCallback(() => {
    const channelKey = `auction-${auctionId}`;

    if (channelRef.current) {
      try {
        console.log('🧹 [BidRealtime] 채널 정리');
        channelRef.current.unsubscribe();
        activeChannels.delete(channelKey);
      } catch (error) {
        console.error('❌ [BidRealtime] 채널 정리 중 오류:', error);
      } finally {
        channelRef.current = null;
      }
    }
  }, [auctionId]);

  useEffect(() => {
    // 유효성 검사
    if (!auctionId) return;

    if (isExpired) {
      cleanupChannel();
      return;
    }

    const channelKey = `auction-${auctionId}`;

    // 이미 활성 채널이 있으면 재사용
    if (activeChannels.has(channelKey)) {
      channelRef.current = activeChannels.get(channelKey);
      return;
    }

    // 기존 채널이 있으면 정리
    cleanupChannel();

    try {
      const supabase = createClient();

      // 간단한 채널 생성 (최소 설정)
      const channel = supabase
        .channel(`auction-${auctionId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bids',
            filter: `item_id=eq.${auctionId}`,
          },
          async (payload) => {
            console.log('✅ [BidRealtime] 새로운 입찰 수신:', payload.new);

            const newBid = payload.new as {
              id: string;
              item_id: string;
              bidder_id: string;
              price: number;
              created_at: string;
            };

            try {
              // 입찰자 정보를 Supabase에서 가져오기
              const { data: userData, error } = await supabase
                .from('users')
                .select('id, nickname, profile_img')
                .eq('id', newBid.bidder_id)
                .single();

              if (error) {
                console.error('❌ [BidRealtime] 입찰자 정보 조회 실패:', error);
                return;
              }

              const completeBidData: BidType = {
                id: newBid.id,
                item_id: newBid.item_id,
                bidder_id: newBid.bidder_id,
                price: newBid.price.toString(),
                createdAt: newBid.created_at,
                bidder: {
                  id: userData.id,
                  nickname: userData.nickname,
                  profileImg: userData.profile_img,
                },
              };

              // React Query 캐시 업데이트
              const queryKey = bidKeys.list(auctionId, limits);
              queryClient.setQueryData<BidListResponse>(queryKey, (oldData) => {
                if (!oldData) return oldData;

                const newBids = [completeBidData, ...(oldData.data || [])];
                return {
                  ...oldData,
                  data: newBids.slice(0, limits),
                };
              });

              // 경매 상세 정보를 즉시 새로고침하여 새로운 currentPrice 가져오기
              queryClient.refetchQueries({
                queryKey: auctionKeys.detail(auctionId),
              });

              console.log(
                '✅ [BidRealtime] 입찰 데이터 캐시 업데이트 완료, 경매 정보 새로고침 호출됨'
              );
            } catch (error) {
              console.error('❌ [BidRealtime] 입찰 처리 중 오류:', error);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'auction_prices',
            filter: `item_id=eq.${auctionId}`,
          },
          (payload) => {
            console.log('✅ [BidRealtime] 경매 가격 업데이트:', payload.new);

            // 경매 상세 정보를 즉시 새로고침
            queryClient.refetchQueries({
              queryKey: auctionKeys.detail(auctionId),
            });
          }
        )
        .subscribe((status) => {
          console.log(`🔗 [BidRealtime] 연결 상태: ${status}`);

          if (status === 'SUBSCRIBED') {
            console.log('✅ [BidRealtime] 리얼타임 구독 성공');
          } else if (status === 'CLOSED') {
            console.log('❌ [BidRealtime] 연결이 닫혔습니다.');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ [BidRealtime] 채널 오류 발생');
          }
        });

      channelRef.current = channel;
      activeChannels.set(channelKey, channel);
    } catch (error) {
      console.error('❌ [BidRealtime] 리얼타임 연결 실패:', error);
    }

    // 정리 함수
    return cleanupChannel;
  }, [auctionId, limits, queryClient, isExpired, cleanupChannel]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return cleanupChannel;
  }, [cleanupChannel]);
};
