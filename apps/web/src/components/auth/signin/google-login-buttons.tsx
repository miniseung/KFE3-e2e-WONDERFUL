'use client';

import Image from 'next/image';

import { Button } from '@/components/ui';

import { signInWithGoogle } from '@/lib/actions/auth';
import { useToastStore } from '@/lib/zustand/store';

const GoogleLoginButton = ({ disabled }: { disabled?: boolean }) => {
  const { showToast } = useToastStore();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();

      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
      }
    } catch (error) {
      showToast({
        status: 'error',
        title: '소셜 로그인 실패',
        subtext: '구글 소셜 로그인에 실패했습니다. 잠시 후 다시 시도 해주세요.',
        autoClose: true,
      });
    }
  };

  return (
    <Button
      type="button"
      size="xl"
      onClick={handleGoogleLogin}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-sm border border-neutral-100 bg-white hover:bg-neutral-50"
    >
      <Image src="/icon/Google.svg" alt="Google 로그인" width={24} height={24} />
      <span className="text-neutral-600">Google로 시작하기</span>
    </Button>
  );
};

export default GoogleLoginButton;
