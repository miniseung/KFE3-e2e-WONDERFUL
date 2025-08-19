import { prisma } from '@repo/db';

import { UserProfile } from '@/lib/types/users';

export const getUserProfileFromDB = async (userId: string): Promise<UserProfile | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        isVerified: true,
        profileImg: true,
        nickname: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    };
  } catch {
    throw new Error('프로필 조회 실패');
  }
};
