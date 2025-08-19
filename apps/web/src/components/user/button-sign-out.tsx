'use client';

import { useRouter } from 'next/navigation';

import { signOut } from '@/lib/actions/auth';
import { useToastStore } from '@/lib/zustand/store';

const ButtonSignOut = () => {
  const router = useRouter();
  const { showToast } = useToastStore();

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result && result.success) {
        router.push('/auth/signin');
      }
    } catch {
      showToast({
        status: 'error',
        title: '로그아웃에 실패했습니다',
        subtext: '잠시 후 다시 시도해주세요.',
        autoClose: true,
      });
    }
  };
  return (
    <button
      className="border-b-1 mx-auto block border-neutral-400 text-sm font-medium leading-4 text-neutral-400"
      onClick={handleLogout}
    >
      로그아웃
    </button>
  );
};

export default ButtonSignOut;
