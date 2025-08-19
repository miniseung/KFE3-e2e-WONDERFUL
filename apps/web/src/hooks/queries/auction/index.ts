import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  getAuctionDetail,
  getAuctions,
  getLocationById,
  getAuctionsWithParams,
  getAuctionDetailWithParams,
} from '@/lib/api/auction';

import { AuctionListResponse, AuctionDetailResponse, SortOption } from '@/types/auction-prisma';

import { auctionKeys } from './keys';

interface LocationResponse {
  id: string;
  locationName: string;
  latitude: number | null;
  longitude: number | null;
}

interface UseAuctionsParams {
  locationName?: string;
  category_id?: string;
  sort?: SortOption;
  includeCompleted?: boolean;
}

export const useAuctions = (
  locationName?: string,
  category_id?: string,
  sort?: SortOption,
  includeCompleted?: boolean
): UseQueryResult<AuctionListResponse, Error> => {
  return useQuery({
    queryKey: auctionKeys.list(locationName, category_id, sort, includeCompleted),
    queryFn: () => getAuctions(locationName, category_id, sort, includeCompleted),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useAuctionsWithParams = (
  params: UseAuctionsParams
): UseQueryResult<AuctionListResponse, Error> => {
  return useQuery({
    queryKey: auctionKeys.list(
      params.locationName,
      params.category_id,
      params.sort,
      params.includeCompleted
    ),
    queryFn: () => getAuctionsWithParams(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useAuctionDetail = (
  id: string,
  userId?: string
): UseQueryResult<AuctionDetailResponse, Error> => {
  return useQuery({
    queryKey: auctionKeys.detail(id, userId),
    queryFn: () => getAuctionDetail(id, userId),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    enabled: !!id,
  });
};

export const useAuctionDetailWithParams = (
  id: string,
  params?: { userId?: string }
): UseQueryResult<AuctionDetailResponse, Error> => {
  return useQuery({
    queryKey: auctionKeys.detail(id, params?.userId),
    queryFn: () => getAuctionDetailWithParams(id, params),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    enabled: !!id,
  });
};

export const useFavoriteStatus = (
  auctionId: string,
  userId?: string
): UseQueryResult<boolean, Error> => {
  return useQuery({
    queryKey: auctionKeys.detail(auctionId, userId),
    queryFn: () => getAuctionDetail(auctionId, userId),
    select: (data: AuctionDetailResponse): boolean => {
      return data?.userFavorite?.isFavorite || false;
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    enabled: !!auctionId,
  });
};

export const useLocationById = (locationId: string): UseQueryResult<LocationResponse, Error> => {
  return useQuery({
    queryKey: auctionKeys.location(locationId),
    queryFn: () => getLocationById(locationId),
    enabled: !!locationId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

export type UseAuctionsReturn = UseQueryResult<AuctionListResponse, Error>;
export type UseAuctionDetailReturn = UseQueryResult<AuctionDetailResponse, Error>;
export type UseFavoriteStatusReturn = UseQueryResult<boolean, Error>;
export type UseLocationByIdReturn = UseQueryResult<LocationResponse, Error>;
export type UseAuctionsWithParamsReturn = UseQueryResult<AuctionListResponse, Error>;
export type UseAuctionDetailWithParamsReturn = UseQueryResult<AuctionDetailResponse, Error>;
