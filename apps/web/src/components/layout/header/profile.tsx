'use client';

import { usePathname, useRouter } from 'next/navigation';

import { ChevronLeft } from 'lucide-react';
import { tv } from 'tailwind-variants';

import { HeaderWrapper } from '@/components/layout/';
import { Button } from '@/components/ui';

import { cn } from '@/lib/cn';

interface HeaderInfo {
  title: string;
  showBackButton: boolean;
}

const HEADER_CONFIG: Record<string, HeaderInfo> = {
  '/profile': { title: '나의 프로필', showBackButton: false },
  '/profile/edit': { title: '프로필 수정하기', showBackButton: true },
  '/profile/sales': { title: '판매 목록', showBackButton: true },
  '/profile/purchases': { title: '입찰 목록', showBackButton: true },
  '/profile/wishlist': { title: '관심 목록', showBackButton: true },
  '/profile/location': { title: '내 동네 설정', showBackButton: true },
  '/profile/support': { title: '공지사항', showBackButton: true },
  '/profile/settings': { title: '설정', showBackButton: true },
};

const ProfileHeader = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { title, showBackButton } = HEADER_CONFIG[pathname] || {
    title: '나의 프로필',
    showBackButton: false,
  };

  const titleStyle = tv({
    base: 'text-h4 font-bold mt-[3px]',
    variants: {
      showBackButton: {
        true: 'absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]',
        false: '',
      },
    },
  });

  const isProfileSubpage = pathname !== '/profile' && pathname.startsWith('/profile');

  return (
    <HeaderWrapper className={cn(isProfileSubpage ? 'bg-white' : 'bg-primary-50/30')}>
      {showBackButton && (
        <Button color={'transparent'} className="!px-0" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
      )}
      <h2 className={titleStyle({ showBackButton })}>{title}</h2>
    </HeaderWrapper>
  );
};

export default ProfileHeader;
