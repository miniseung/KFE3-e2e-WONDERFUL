import { NextResponse } from 'next/server';

import { prisma } from '@repo/db';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      data: categories,
      total: categories.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        message: '카테고리 목록을 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
