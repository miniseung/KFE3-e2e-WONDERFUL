'use client';

import { CircleAlert } from 'lucide-react';

import CreateAuctionForm from '@/components/auction-create/form-create';
import { Notice } from '@/components/common';
import { Button } from '@/components/ui';

import useCreateAuction from '@/hooks/auction/useCreateAuction';

import { NOTICE_DESCRIPTION } from '@/constants/auction';

const CreateAuctionPage = () => {
  const { handleSubmit, errors, setFiles, isPending } = useCreateAuction();
  return (
    <form onSubmit={handleSubmit} className="relative">
      <section className="flex w-full flex-col gap-8 p-4">
        <CreateAuctionForm errors={errors} setFiles={setFiles} />
        <Notice status="notice">
          {NOTICE_DESCRIPTION.map(({ id, description }) => (
            <p key={id} className="flex items-start justify-start gap-1">
              <CircleAlert size={15} className="shrink" />
              <span className="flex-1 whitespace-pre-wrap leading-none">{description}</span>
            </p>
          ))}
        </Notice>
      </section>
      <section className="backdrop-blur-xs from-white-0 sticky bottom-0 bg-white/70 px-[15px] pb-5 pt-4">
        <Button className="w-full" size={'lg'} disabled={isPending} type="submit">
          {isPending ? '등록 중...' : '등록하기'}
        </Button>
      </section>
    </form>
  );
};

export default CreateAuctionPage;
