import { Seller } from '@/types/chat';

export interface BidderInfo {
  id: string;
  nickname: string;
  profileImg: string | null;
}

export interface BidType {
  id: string;
  item_id: string;
  bidder_id: string;
  price: string;
  createdAt: string;
  bidder: BidderInfo;
}

export interface BidsListType {
  item_id: string;
  bids: BidType[];
}

export interface BidBaseProps {
  auctionId: string;
  minBidUnit?: number;
  currentPrice: number;
  endTime: string | Date;
  isExpired: boolean;
  isValid?: boolean;
  seller: Seller;
  currentUserId?: string;
  isOwnAuction?: boolean;
}

export interface BidFormProps extends BidBaseProps {
  bidTableRef: React.RefObject<HTMLDivElement | null>;
}

export interface BidInputProps {
  auctionId: string;
  currentPrice: number;
  minUnit: number;
  bidPrice: number | null;
  isBidInputOpen?: boolean;
  onChange: (price: number | null) => void;
  disabled?: boolean;
  validationError?: string;
}

export interface BidListResponse {
  success: boolean;
  data: BidType[];
  message?: string;
}

export interface BidCreateResponse {
  success: boolean;
  data: BidType;
  message: string;
}
