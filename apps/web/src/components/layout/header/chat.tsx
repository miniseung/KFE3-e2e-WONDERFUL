'use client';

import { Suspense } from 'react';

import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { Bell } from 'lucide-react';

import { BackButton, ButtonMore } from '@/components/common';
import { HeaderWrapper } from '@/components/layout';

const item = [
  {
    id: 'report',
    title: '신고하기',
    onClick: () => {},
  },
];

const ChatHeaderContent = () => {
  const pathname = usePathname();
  const { id } = useParams();
  const searchParams = useSearchParams(); // 여기서 사용
  const interlocutor = searchParams.get('interlocutor');

  return (
    <HeaderWrapper className="bg-white">
      {pathname.includes('chat') && !id ? (
        <>
          <h2 className="text-h4 font-bold">채팅</h2>
          {/* <Bell /> */}
        </>
      ) : (
        <>
          <BackButton />
          <h2 className="text-h4 absolute left-1/2 translate-x-[-50%] font-bold">{interlocutor}</h2>
          {/* <ButtonMore items={item} /> */}
        </>
      )}
    </HeaderWrapper>
  );
};

const ChatHeader = () => {
  return (
    <Suspense
      fallback={
        <HeaderWrapper className="bg-white">
          <div className="relative flex w-full items-center justify-between">
            <BackButton />
            <h2 className="text-h4 absolute left-1/2 translate-x-[-50%] font-bold">
              상대방 닉네임
            </h2>
            {/* <ButtonMore items={item} /> */}
          </div>
        </HeaderWrapper>
      }
    >
      <ChatHeaderContent />
    </Suspense>
  );
};

export default ChatHeader;
