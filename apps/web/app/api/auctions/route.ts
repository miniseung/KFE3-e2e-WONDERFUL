import { NextRequest, NextResponse } from 'next/server';

import { Prisma, prisma } from '@repo/db';

import { AuctionListResponse, SortOption } from '@/types/auction-prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const locationName = searchParams.get('locationName');
    const categoryId = searchParams.get('category_id');
    const sort = (searchParams.get('sort') as SortOption) || 'latest';
    const includeCompleted = searchParams.get('includeCompleted') === 'true';

    const where: Prisma.AuctionItemWhereInput = {
      status: 'ACTIVE',
    };

    if (includeCompleted) {
      delete where.status;
    }

    if (locationName) {
      where.location = {
        locationName: locationName,
      };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    let orderBy: Prisma.AuctionItemOrderByWithRelationInput = {};

    switch (sort) {
      case 'latest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'ending_soon':
        orderBy = { endTime: 'asc' };
        break;
      case 'price_low':
        orderBy = { auctionPrice: { currentPrice: 'asc' } };
        break;
      case 'price_high':
        orderBy = { auctionPrice: { currentPrice: 'desc' } };
        break;
      case 'popular':
        orderBy = { favoriteItems: { _count: 'desc' } };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const total = await prisma.auctionItem.count({ where });

    const auctions = await prisma.auctionItem.findMany({
      where,
      include: {
        location: {
          select: {
            id: true,
            locationName: true,
          },
        },
        category: {
          select: {
            name: true,
            id: true,
          },
        },
        auctionPrice: {
          select: {
            startPrice: true,
            currentPrice: true,
            instantPrice: true,
            minBidUnit: true,
            isInstantBuyEnabled: true,
          },
        },
        auctionImages: {
          select: {
            id: true,
            urls: true,
          },
        },
        _count: {
          select: {
            bids: true,
            favoriteItems: true,
          },
        },
      },
      orderBy,
    });

    const response: AuctionListResponse = {
      data: auctions,
      total,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        message: '경매 목록을 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
