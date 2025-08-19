'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { InputPersonal } from '@/components/personal-info';
import { Button } from '@/components/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { createAccount } from '@/lib/actions/account';
import type { CreateAccountRequest } from '@/lib/types/account';
import { useToastStore } from '@/lib/zustand/store/toast-store';
import { useQueryClient } from '@tanstack/react-query';

const AccountForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAccountRequest>({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    isPrimary: false,
  });

  const handleInputChange = (field: keyof CreateAccountRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (checked: boolean | string) => {
    setFormData((prev) => ({ ...prev, isPrimary: checked === true }));
  };

  const handleAccountSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.bankName?.trim() ||
      !formData.accountNumber?.trim() ||
      !formData.accountHolder?.trim()
    ) {
      showToast({
        status: 'error',
        title: '모든 필드를 입력해주세요.',
        autoClose: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await createAccount(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      showToast({
        status: 'success',
        title: '계좌가 등록되었습니다.',
        autoClose: true,
      });

      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      router.push('/account');
    } catch (error) {
      showToast({
        status: 'error',
        title: error instanceof Error ? error.message : '계좌 등록에 실패했습니다.',
        autoClose: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAccountSubmit}
      className="flex h-full w-full flex-col justify-between px-4"
    >
      <div className="flex flex-col gap-3">
        <InputPersonal
          id="bankName"
          label="은행명"
          placeholder="사용하시는 은행명을 입력해주세요"
          type="text"
          value={formData.bankName}
          onChange={(e) => handleInputChange('bankName', e.target.value)}
        />
        <InputPersonal
          id="accountNumber"
          label="계좌"
          placeholder="입금받으실 계좌를 입력해주세요"
          type="number"
          value={formData.accountNumber}
          onChange={(e) => handleInputChange('accountNumber', e.target.value)}
        />
        <InputPersonal
          id="accountHolder"
          label="예금주"
          placeholder="계좌의 예금주를 정확히 입력해주세요"
          type="text"
          value={formData.accountHolder}
          onChange={(e) => handleInputChange('accountHolder', e.target.value)}
        />
      </div>
      <div className="flex w-full flex-col gap-4 pb-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="isPrimary"
            checked={formData.isPrimary}
            onCheckedChange={handleCheckboxChange}
          />
          <label htmlFor="isPrimary">대표 계좌로 설정하기</label>
        </div>
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? '등록 중...' : '제출하기'}
        </Button>
      </div>
    </form>
  );
};

export default AccountForm;
