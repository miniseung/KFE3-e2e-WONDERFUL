'use client';

import { useMemo } from 'react';

import { ChatListCard, ChatListCardSkeleton } from '@/components/chat';
import { FilterTab } from '@/components/common';
import { Container } from '@/components/layout';

import useFilteredChatRooms from '@/hooks/chat/useFilteredChatRooms';

import { CHAT_STATUS } from '@/lib/constants/chat';

const Page = () => {
  const { filtered: chatRooms, isLoading, error } = useFilteredChatRooms();

  const sortedChatRooms = useMemo(() => {
    return [...chatRooms].sort((a, b) => {
      const aLast = a.messages?.[0]?.sentAt ? new Date(a.messages[0].sentAt).getTime() : 0;
      const bLast = b.messages?.[0]?.sentAt ? new Date(b.messages[0].sentAt).getTime() : 0;
      return bLast - aLast;
    });
  }, [chatRooms]);

  if (isLoading) {
    return (
      <Container>
        <div className="flex h-full w-full flex-col px-4">
          <FilterTab filterKey={'chatStatus'} items={CHAT_STATUS} />
          <ChatListCardSkeleton />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">채팅방 목록을 불러오는데 실패했습니다</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex h-full w-full flex-col px-4">
        <FilterTab filterKey={'chatStatus'} items={CHAT_STATUS} />
        {!sortedChatRooms.length && (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">대화 중인 채팅방이 없습니다</div>
          </div>
        )}
        {sortedChatRooms.map((chat) => {
          return <ChatListCard key={chat.id} chatInfo={chat} />;
        })}
      </div>
    </Container>
  );
};

export default Page;
