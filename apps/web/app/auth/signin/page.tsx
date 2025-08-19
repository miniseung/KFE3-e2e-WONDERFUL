import { Suspense } from 'react';

import Link from 'next/link';

import { SigninForm } from '@/components/auth/signin';

const Page = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-white p-4 text-center">
      <h1 className="text-h3 font-bold text-neutral-900">로그인</h1>
      <div className="flex w-full flex-col items-center gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SigninForm />
        </Suspense>
        <div className="text-sm">
          <span className="text-neutral-600">계정이 없으신가요? </span>
          <Link href="/auth/signup" className="text-primary-500 font-medium">
            회원 가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
