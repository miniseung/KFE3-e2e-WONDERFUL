'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  House as HouseIcon,
  MessagesSquare,
  Search as SearchIcon,
  UserRound as UserRoundIcon,
} from 'lucide-react';

import { ROUTES, type NavMenuItem } from '@/lib/constants/routes';

// route 작업 후 수정 필요
const NAV_MENU: NavMenuItem[] = [
  { name: '홈', href: ROUTES.HOME, icon: HouseIcon },
  { name: '검색', href: ROUTES.SEARCH, icon: SearchIcon },
  { name: '채팅', href: ROUTES.CHAT, icon: MessagesSquare },
  { name: '프로필', href: ROUTES.PROFILE, icon: UserRoundIcon },
];

const Navigation = () => {
  const pathname = usePathname();
  const showNavigation = ['/', '/auction', '/search', '/chat', '/profile'].includes(pathname || '');

  if (!showNavigation) {
    return <div className="h-0 w-full"></div>;
  }

  return (
    <nav className="z-50 h-[76px] w-full bg-white shadow-[var(--shadow-nav)]">
      <ul className="flex h-full w-full">
        {NAV_MENU.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href} className="h-full w-1/4">
              <Link
                href={href}
                className={`flex h-full w-full flex-col items-center gap-1 pt-[12px] text-sm font-medium transition-colors ${
                  isActive ? 'text-primary-500' : 'hover:text-primary-500 text-neutral-400'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium leading-5">{name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
