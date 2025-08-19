import { X } from 'lucide-react';

import Thumbnail from '@/components/ui/thumbnail';

import { AttacedAuctionImageProps } from '@/lib/types/auction-prisma';

const AttachImagesThumbnail = ({ url, handleDelete }: AttacedAuctionImageProps) => {
  if (!url) return null;

  return (
    <div className="relative">
      <button
        type="button"
        className="absolute right-[-5px] top-[5px] z-50 flex size-5 items-center justify-center rounded-full bg-neutral-800/60 text-white"
        onClick={handleDelete}
      >
        <span className="hidden">닫기</span>
        <X size={16} />
      </button>
      <Thumbnail className="size-15 my-3" alt="" url={url} size={64} />
    </div>
  );
};

export default AttachImagesThumbnail;
