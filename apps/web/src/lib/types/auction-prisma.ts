import type { Prisma } from '@repo/db';
export type AuctionListItem = Prisma.AuctionItemGetPayload<{
  include: {
    location: {
      select: {
        id: true;
        locationName: true;
      };
    };
    category: {
      select: {
        id: true;
        name: true;
      };
    };
    auctionPrice: {
      select: {
        startPrice: true;
        currentPrice: true;
        instantPrice: true;
        minBidUnit: true;
        isInstantBuyEnabled: true;
      };
    };
    auctionImages: {
      select: {
        id: true;
        urls: true;
      };
    };
    _count: {
      select: {
        bids: true;
        favoriteItems: true;
      };
    };
  };
}>;

export type AuctionDetailItem = Prisma.AuctionItemGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    status: true;
    endTime: true;
    thumbnailUrl: true;

    // 판매자 정보 (최소한만)
    seller: {
      select: {
        id: true;
        nickname: true;
        profileImg: true;
      };
    };

    // 위치 정보
    location: {
      select: {
        id: true;
        locationName: true;
      };
    };

    // 카테고리 정보
    category: {
      select: {
        id: true;
        name: true;
      };
    };

    // 가격 정보 (화면 표시용만)
    auctionPrice: {
      select: {
        currentPrice: true;
        startPrice: true;
        instantPrice: true;
        minBidUnit: true;
        isInstantBuyEnabled: true;
      };
    };

    // 이미지 정보 (캐러셀용 모든 이미지)
    auctionImages: {
      select: {
        id: true;
        urls: true;
      };
    };

    // 통계 정보
    _count: {
      select: {
        bids: true;
        favoriteItems: true;
      };
    };
  };
}>;

// 찜하기 여부
export interface UserFavoriteStatus {
  isFavorite: boolean;
}

// 이미지 배열 처리 헬퍼 함수 타입
export interface ProcessedImages {
  allImages: string[];
  thumbnailUrl: string;
}

// API 응답 타입들
// 경매 목록 응답
export interface AuctionListResponse {
  data: AuctionListItem[];
  total: number;
}

// 경매 상세페이지 응답 (API 구조에 맞게 수정)
export interface AuctionDetailResponse {
  data: AuctionDetailItem;
  userFavorite: UserFavoriteStatus;
  currentUserId: string | null;
}

// 필터 및 정렬 타입들
export interface AuctionFilters {
  location_name?: string;
  category_id?: string;
}

export type SortOption = 'latest' | 'ending_soon' | 'price_low' | 'price_high' | 'popular';

export interface AttacedAuctionImageProps {
  url: string;
  handleDelete: React.MouseEventHandler<HTMLButtonElement>;
}

export interface AttachImageInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imgLength: number;
}
