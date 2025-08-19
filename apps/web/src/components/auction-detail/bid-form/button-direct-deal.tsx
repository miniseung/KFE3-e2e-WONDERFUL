'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { AlarmClock, ChevronRight } from 'lucide-react';

import { createChatRoom } from '@/lib/actions/chat';
import { useToastStore } from '@/lib/zustand/store';

import { Seller } from '@/types/chat';

interface ButtonDirectDealProps {
  directPrice: string;
  auctionId: string;
  seller: Seller;
  currentUserId?: string;
}

const ButtonDirectDeal = ({
  directPrice,
  auctionId,
  seller,
  currentUserId,
}: ButtonDirectDealProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToastStore();

  const isOwnAuction = currentUserId === seller.id;

  const handleDirectDeal = async () => {
    if (isOwnAuction) {
      alert(
        '본인의 경매 상품은 즉시거래를 할 수 없습니다.\n다른 사용자가 즉시거래를 진행할 수 있습니다.'
      );
      return;
    }

    try {
      setIsLoading(true);

      const confirmed = window.confirm(
        `${directPrice}에 즉시 구매하시겠습니까?\n구매 확정 시 채팅방으로 이동합니다.`
      );

      if (!confirmed) return;

      const chatRoomId = await createChatRoom({
        auctionId,
        seller: { id: seller.id, nickname: seller.nickname },
      });

      router.push(`/chat/${chatRoomId}`);
    } catch (error) {
      showToast({
        status: 'error',
        title: '즉시 구매 실패',
        subtext: '즉시 구매에 실패했습니다. 잠시 후 다시 시도해주세요.',
        autoClose: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`bg-primary-50 mt-3 flex w-full items-center justify-between gap-2 rounded-sm py-2.5 pl-4 pr-2`}
      onClick={handleDirectDeal}
      disabled={isLoading}
    >
      <AlarmClock className="text-indigo-500" strokeWidth={2.5} size={20} />
      <p className="flex-1 pt-0.5 text-left font-medium text-neutral-900">
        지금
        <span className="font-semibold text-indigo-500">{' ' + directPrice}</span>에 즉시구매 하기
      </p>
      <ChevronRight className="size-6 text-neutral-600" />
    </button>
  );
};

export default ButtonDirectDeal;
