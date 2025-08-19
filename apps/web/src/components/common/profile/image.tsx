import Image from 'next/image';

import { cn } from '@/lib/cn';

interface ProfileImageProps {
  src: string;
  alt: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  priority?: boolean;
}
const sizeConfig = {
  small: { width: 28, height: 28, className: 'size-7', quality: 75 },
  medium: { width: 40, height: 40, className: 'size-10', quality: 80 },
  large: { width: 58, height: 58, className: 'size-14', quality: 80 },
  xlarge: { width: 150, height: 150, className: 'size-36', quality: 85 },
};

const ProfileImage = ({
  src,
  alt,
  size = 'medium',
  className,
  priority = false,
}: ProfileImageProps) => {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        `relative shrink-0 overflow-hidden rounded-full bg-gray-100 ${config.className} ${className}`
      )}
    >
      <Image
        src={src ? src : '/avatar-male.svg'}
        alt={alt}
        width={config.width}
        height={config.height}
        sizes={`${config.width}px`}
        quality={config.quality}
        priority={priority}
        className="size-full object-cover"
      />
    </div>
  );
};

export default ProfileImage;
