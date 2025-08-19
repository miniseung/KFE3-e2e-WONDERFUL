import { tv } from 'tailwind-variants';

import { ProfileImage } from '@/components/common';

const BidderAvatar = ({
  profileImg,
  nickname,
  isAuthor,
}: {
  profileImg: string;
  nickname: string;
  isAuthor: boolean;
}) => {
  const authorStyle = tv({
    base: 'shrink-0',
    variants: {
      author: {
        true: 'border-2 border-primary-500 shadow-md shadow-primary-200 bg-white',
        false: '',
      },
    },
  });

  return (
    <ProfileImage
      src={profileImg}
      alt={nickname}
      size={'small'}
      className={`border-1 border-primary-100 ${authorStyle({ author: isAuthor })}`}
    />
  );
};

export default BidderAvatar;
