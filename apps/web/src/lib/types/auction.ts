export interface AuctionItemProps {
  id: string;
  title: string;
  idx?: number;
  status: '경매중' | '경매종료';
  originalPrice: number;
  currentPrice: number;
  deadline: string;
  thumbnailUrl: string;
}

// 필터 및 정렬 타입들
export interface AuctionPriceInput {
  start_price: number;
  instant_price?: number;
  min_bid_unit: number;
}

export interface AuctionFormData {
  title: string;
  description: string;
  category_id: string;
  location_id?: string | null;
  prices: AuctionPriceInput;
  start_time?: string | null;
  end_time: string;
  auction_type?: 'normal' | 'flash';
  images?: string[];
  // 추가된 필드
  is_instant_buy_enabled: boolean;
  is_extended_auction?: boolean;
}

export interface AuctionPriceUpdate {
  instant_price?: number | null;
  min_bid_unit: number;
  is_instant_buy_enabled: boolean;
  is_extended_auction: boolean;
  // 입찰이 없을 때만 업데이트되는 필드들
  start_price?: number;
  current_price?: number;
}

export type AuctionStatus = 'ACTIVE' | 'COMPLETED';

//경매 게시글 등록 폼 타입들
//이미지 등록 타입
export interface AttachImageInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imgLength: number;
  id: string;
}

//경매 폼 errormessage 타입
export interface FormErrorMessageType {
  [key: string]: string;
}

// ItemInformation 컴포넌트에서 사용
export interface Item {
  title: string;
  status: string;
  endTime: string;
  description: string;
}
// AuctionPage 컴포넌트에서 사용할 Item 인터페이스 확장
export interface ItemInfo extends Item {
  // 가격 정보
  startPrice: number;
  currentPrice: number;
  instantPrice?: number | null;
  minBidUnit: number;
  isInstantBuyEnabled: boolean;

  // 통계 정보
  bidCount: number;
  favoriteCount: number;
  isFavorite: boolean;

  // 카테고리
  category: string;
}

export interface CountdownProps {
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

export interface ItemInformationProps {
  item: Item;
  id: string;
  countdown: CountdownProps;
}

export interface Item {
  title: string;
  status: string;
  endTime: string;
  description: string;
}
