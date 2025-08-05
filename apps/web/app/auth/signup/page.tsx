import { Suspense } from 'react';

import dynamic from 'next/dynamic';

const SignupFlow = dynamic(
  () => import('@/components/auth/signup').then((mod) => ({ default: mod.SignupFlow })),
  {
    loading: () => (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary-500 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2" />
          <p className="text-gray-600">회원가입 페이지를 불러오는 중...</p>
        </div>
      </div>
    ),
  }
);

const SignupPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="border-primary-500 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2" />
            <p className="text-gray-600">회원가입 페이지를 불러오는 중...</p>
          </div>
        </div>
      }
    >
      <SignupFlow />
    </Suspense>
  );
};

export default SignupPage;
