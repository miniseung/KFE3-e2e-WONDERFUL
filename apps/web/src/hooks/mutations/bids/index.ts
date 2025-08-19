import { useMutation, useQueryClient } from '@tanstack/react-query';

import { auctionKeys } from '@/hooks/queries/auction/keys';
import { bidKeys } from '@/hooks/queries/bids/keys';

import { createBid } from '@/lib/api/bid';
import { createClient } from '@/lib/supabase/client';
import { AuctionDetailResponse } from '@/lib/types/auction-prisma';
import { BidCreateResponse } from '@/lib/types/bid';

interface BidRequest {
  auctionId: string;
  bidPrice: number;
}

export const useBidMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ auctionId, bidPrice }: BidRequest): Promise<BidCreateResponse> => {
      return await createBid(auctionId, bidPrice);
    },
    onMutate: async ({ auctionId, bidPrice }) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { previousAuction: null, previousBids: null };
      }

      const auctionQueryKey = auctionKeys.detail(auctionId);
      const bidQueryKey = bidKeys.list(auctionId, 10);
      await queryClient.cancelQueries({ queryKey: auctionQueryKey });

      const previousAuction = queryClient.getQueryData<AuctionDetailResponse>(auctionQueryKey);

      if (previousAuction) {
        queryClient.setQueryData(auctionQueryKey, (old: AuctionDetailResponse) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              auctionPrice: {
                ...old.data.auctionPrice,
                currentPrice: bidPrice,
              },
            },
          };
        });
      }

      return {
        previousAuction,
      };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: auctionKeys.detail(variables.auctionId),
      });

      queryClient.invalidateQueries({
        queryKey: bidKeys.list(variables.auctionId, 10),
      });
    },

    onError: (err, variables, context) => {
      const errorMessage = err instanceof Error ? err.message : '입찰 중 오류가 발생했습니다.';
      return { errorMessage };
    },
  });
};
