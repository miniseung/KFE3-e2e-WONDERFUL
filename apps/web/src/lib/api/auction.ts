import { AuctionDetailResponse, AuctionListResponse, SortOption } from '@/types/auction-prisma';

import apiClient from './client';

interface GetAuctionsParams {
  locationName?: string;
  category_id?: string;
  sort?: SortOption;
  includeCompleted?: boolean;
}

interface GetAuctionDetailParams {
  userId?: string;
}

interface LocationResponse {
  id: string;
  locationName: string;
  latitude: number | null;
  longitude: number | null;
}

export const getAuctions = async (
  locationName?: string,
  category_id?: string,
  sort?: SortOption,
  includeCompleted?: boolean
): Promise<AuctionListResponse> => {
  const params: Record<string, string> = {};

  if (locationName) {
    params.locationName = locationName;
  }

  if (category_id) {
    params.category_id = category_id;
  }

  if (sort) {
    params.sort = sort;
  }

  if (includeCompleted !== undefined) {
    params.includeCompleted = includeCompleted.toString();
  }

  const response = await apiClient.get<AuctionListResponse>('/auctions', { params });
  return response.data;
};

export const getAuctionDetail = async (
  id: string,
  userId?: string
): Promise<AuctionDetailResponse> => {
  const params: Record<string, string> = {};

  if (userId) {
    params.userId = userId;
  }

  const response = await apiClient.get<AuctionDetailResponse>(`/auctions/${id}`, { params });
  return response.data;
};

export const getLocationById = async (locationId: string): Promise<LocationResponse> => {
  const response = await apiClient.get<LocationResponse>(`/locations/${locationId}`);
  return response.data;
};

export const getAuctionsWithParams = async (
  params: GetAuctionsParams
): Promise<AuctionListResponse> => {
  const queryParams: Record<string, string> = {};

  if (params.locationName) {
    queryParams.locationName = params.locationName;
  }

  if (params.category_id) {
    queryParams.category_id = params.category_id;
  }

  if (params.sort) {
    queryParams.sort = params.sort;
  }
  if (params.includeCompleted !== undefined && params.includeCompleted !== null) {
    queryParams.includeCompleted = String(queryParams.includeCompleted);
  }

  const response = await apiClient.get<AuctionListResponse>('/auctions', {
    params: queryParams,
  });
  return response.data;
};

export const getAuctionDetailWithParams = async (
  id: string,
  params?: GetAuctionDetailParams
): Promise<AuctionDetailResponse> => {
  const queryParams: Record<string, string> = {};

  if (params?.userId) {
    queryParams.userId = params.userId;
  }

  const response = await apiClient.get<AuctionDetailResponse>(`/auctions/${id}`, {
    params: queryParams,
  });
  return response.data;
};

// 경매 상태를 업데이트하는 함수 (기존 updateAuctionStatus와 동일한 방식)
export const updateExpiredAuctions = async (auctionId: string): Promise<{ success: boolean }> => {
  try {
    await apiClient.patch(`/auctions/${auctionId}/status`, {
      status: 'COMPLETED',
    });

    return { success: true };
  } catch {
    throw new Error('경매 상태 업데이트에 실패했습니다.');
  }
};
