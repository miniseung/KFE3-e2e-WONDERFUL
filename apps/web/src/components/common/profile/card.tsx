import { ProfileImage } from '@/components/common';

import { cn } from '@/lib/cn';

interface ProfileCardProps {
  nickname: string;
  profileImg: string;
  location?: string | null;
  children: React.ReactNode;
  className?: string;
}

const ProfileCard = ({ nickname, profileImg, location, children, className }: ProfileCardProps) => (
  <div className={cn(`flex items-center gap-3 bg-white px-4 py-3 ${className}`)}>
    <ProfileImage src={profileImg} alt={`${nickname} 프로필 이미지`} size={'small'} />
    <div className="flex flex-col">
      <span className="text-base font-medium">{nickname}</span>
      {location && <span className="text-sm text-neutral-600">{location}</span>}
    </div>
    <div className="ml-auto">{children}</div>
  </div>
);

export default ProfileCard;
