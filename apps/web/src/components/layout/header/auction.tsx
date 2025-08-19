'use client';

import { useState } from 'react';

import { useParams, usePathname, useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeftIcon } from 'lucide-react';

import { ButtonMore } from '@/components/common';
import { HeaderWrapper } from '@/components/layout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useAuctionDetail } from '@/hooks/queries/auction';

import { deleteAuction } from '@/lib/actions/auction';

const AuctionHeader = () => {
  const routes = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { id } = params;
  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const shouldFetchAuction = id && id !== 'createAuction';
  const { data } = useAuctionDetail(shouldFetchAuction ? (id as string) : '');
  const auctionData = data?.data;

  const isOwner = data?.currentUserId && auctionData?.seller.id === data?.currentUserId;

  const handleBackClick = () => {
    if (pathname.includes('createAuction')) {
      routes.push('/');
    } else if (pathname.includes('edit') && id && id !== 'createAuction') {
      routes.push(`/auction/${id}`);
    } else {
      routes.push('/');
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      queryClient.removeQueries({
        queryKey: ['auctions', 'detail', id],
      });

      await deleteAuction(id as string);

      await queryClient.invalidateQueries({
        queryKey: ['auctions', 'list'],
      });

      await queryClient.refetchQueries({
        queryKey: ['auctions', 'list'],
      });

      routes.replace('/');
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // 경매 마감 여부 확인
  const isAuctionExpired = auctionData?.endTime
    ? new Date() > new Date(auctionData.endTime)
    : false;

  // 더보기 메뉴 아이템들
  const moreItems = [
    // 경매가 마감되지 않았을 때만 수정하기 버튼 표시
    ...(isAuctionExpired
      ? []
      : [
          {
            id: 'edit',
            title: '수정하기',
            onClick: () => routes.push(`/auction/${id}/edit`),
          },
        ]),
    {
      id: 'delete',
      title: '삭제하기',
      onClick: () => setIsDeleteDialogOpen(true),
    },
  ];
  return (
    <>
      <HeaderWrapper
        className={`${id && !pathname.includes('edit') ? 'absolute z-10 bg-transparent text-white' : 'bg-white'}`}
      >
        <button type="button" onClick={handleBackClick}>
          <ChevronLeftIcon />
        </button>

        {(pathname.includes('edit') || pathname.includes('create')) && (
          <h2 className="text-h4 absolute left-1/2 -translate-x-1/2 font-bold">
            {pathname.includes('edit') ? '경매 상품 수정' : '경매 상품 등록'}
          </h2>
        )}

        {id && !pathname.includes('edit') && isOwner && <ButtonMore items={moreItems} />}
      </HeaderWrapper>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              경매를 삭제하시겠습니까?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-md text-neutral-600">
              해당 경매 아이템과 관련된 모든 정보가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-4">
            <AlertDialogCancel className="flex-1">취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AuctionHeader;
