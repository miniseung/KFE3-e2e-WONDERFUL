import { Suspense } from 'react';

import dynamic from 'next/dynamic';

const SearchView = dynamic(() => import('@/components/search/search-view'), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-primary-500 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2" />
        <p className="text-gray-600">검색 페이지를 불러오는 중...</p>
      </div>
    </div>
  ),
});

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="border-primary-500 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2" />
            <p className="text-gray-600">검색 페이지를 불러오는 중...</p>
          </div>
        </div>
      }
    >
      <SearchView />
    </Suspense>
  );
};

export default Page;
