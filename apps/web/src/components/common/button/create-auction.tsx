'use client';

import { useRouter } from 'next/navigation';

import { Plus } from 'lucide-react';

import { FloatButton } from '@/components/ui/float-button';

import { useLocationStore, useToastStore } from '@/lib/zustand/store';

const CreateAuctionButton = () => {
  const router = useRouter();
  const { selectedLocation } = useLocationStore();
  const { showToast } = useToastStore();

  const handleClick = () => {
    if (!selectedLocation.locationId) {
      router.push('/profile/location');
      showToast({
        status: 'error',
        title: '경매를 생성할 수 없습니다.',
        subtext: '위치등록을 최소 1개 지정하세요.',
        autoClose: true,
      });
    } else {
      router.push('/auction/createAuction');
    }
  };

  return (
    <FloatButton
      onClick={handleClick}
      size="medium"
      className="absolute bottom-24 right-4 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)]"
    >
      <Plus className="size-7" />
    </FloatButton>
  );
};

export default CreateAuctionButton;
