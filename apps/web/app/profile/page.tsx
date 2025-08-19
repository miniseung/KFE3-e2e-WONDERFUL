import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Pen } from 'lucide-react';

import { MenuList, ProfileCard } from '@/components/common';
import { ProfileShortcutMenu } from '@/components/common/profile';
import { Container } from '@/components/layout';
import ButtonSignOut from '@/components/user/button-sign-out';

import { getMyProfile } from '@/lib/actions/profile';

import defaultAvatar from '@/public/avatar-male.svg';

const ProfilePage = async () => {
  const profile = await getMyProfile();
  if (!profile) {
    redirect('/auth/signin?redirectTo=/profile');
  }

  return (
    <>
      <Container className="[&>div]:border-1 bg-primary-50/30 space-y-2 px-4 [&>div]:rounded-sm [&>div]:border-neutral-100 [&>div]:shadow-[0px_1px_9px_0px_rgba(87,88,254,.11)]">
        <ProfileCard
          nickname={profile.nickname || ''}
          profileImg={profile.profileImg || defaultAvatar}
        >
          <Link href="/profile/edit" className="flex h-10 items-center gap-2 text-sm">
            <Pen size={16} />
            프로필 수정
          </Link>
        </ProfileCard>
        <ProfileShortcutMenu />
        <MenuList />
        <span className="mt-4 block w-full">
          <ButtonSignOut />
        </span>
      </Container>
    </>
  );
};

export default ProfilePage;
