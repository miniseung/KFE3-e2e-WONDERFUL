import { SortOption } from '@/types/auction-prisma';

type AuctionListKey = [
  'auctions',
  'list',
  {
    locationName?: string;
    category_id?: string;
    sort?: SortOption;
    includeCompleted?: boolean;
  },
];

type AuctionDetailKey = ['auctions', 'detail', string, string?];

type LocationKey = ['locations', 'detail', string];

export const auctionKeys = {
  all: ['auctions'] as const,

  lists: () => ['auctions', 'list'] as const,
  list: (
    locationName?: string,
    category_id?: string,
    sort?: SortOption,
    includeCompleted?: boolean
  ): AuctionListKey => [
    'auctions',
    'list',
    {
      locationName,
      category_id,
      sort,
      includeCompleted,
    },
  ],

  details: () => ['auctions', 'detail'] as const,
  detail: (id: string, userId?: string): AuctionDetailKey => {
    if (userId) {
      return ['auctions', 'detail', id, userId];
    }
    return ['auctions', 'detail', id];
  },

  locations: () => ['locations'] as const,
  location: (locationId: string): LocationKey => ['locations', 'detail', locationId],

  favorite: (auctionId: string, userId?: string) => auctionKeys.detail(auctionId, userId),

  invalidateAll: () => auctionKeys.all,
  invalidateLists: () => auctionKeys.lists(),
  invalidateDetails: () => auctionKeys.details(),
  invalidateDetail: (id: string, userId?: string) => auctionKeys.detail(id, userId),
} as const;

export type AuctionKeys = typeof auctionKeys;
export type AuctionListKeyType = AuctionListKey;
export type AuctionDetailKeyType = AuctionDetailKey;
export type LocationKeyType = LocationKey;
