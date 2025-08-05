import { Suspense } from 'react';

import dynamic from 'next/dynamic';

const AuctionDetailContainer = dynamic(
  () =>
    import('@/components/auction-detail').then((mod) => ({ default: mod.AuctionDetailContainer })),
  {
    loading: () => (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary-500 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2" />
          <p className="text-gray-600">경매 정보를 불러오는 중...</p>
        </div>
      </div>
    ),
  }
);

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="border-primary-500 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2" />
            <p className="text-gray-600">경매 정보를 불러오는 중...</p>
          </div>
        </div>
      }
    >
      <AuctionDetailContainer />
    </Suspense>
  );
};

export default Page;
