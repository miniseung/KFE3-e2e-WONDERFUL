import { Suspense } from 'react';

import ErrorBoundaryWrapper from '@/components/common/error-boundary-wrapper';
import { Container } from '@/components/layout';

import EditAuctionPage from '@/views/EditAuctionPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <Container noNav>
      <ErrorBoundaryWrapper>
        <Suspense
          key={id} // 중요: itemId가 변경되면 완전히 새로 렌더링
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <div className="border-primary-500 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2" />
                <p className="text-gray-600">경매 정보를 불러오는 중...</p>
              </div>
            </div>
          }
        >
          <EditAuctionPage itemId={id} />
        </Suspense>
      </ErrorBoundaryWrapper>
    </Container>
  );
};

export default Page;
