'use client';

import { useQueryClient } from '@tanstack/react-query';

import { AccountItem, ButtonBox, ButtonCreate } from '@/components/personal-info';

import { useAccounts } from '@/hooks/queries/accounts';

import { deleteAccount } from '@/lib/actions/account';
import { useToastStore } from '@/lib/zustand/store';

const AccountList = () => {
  const { data: accountList = [], isLoading } = useAccounts();
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteAccount(id);

      if (result.error) {
        throw new Error(result.error);
      }

      showToast({
        status: 'success',
        title: '계좌가 삭제되었습니다.',
        autoClose: true,
      });

      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    } catch (error) {
      showToast({
        status: 'error',
        title: error instanceof Error ? error.message : '계좌 삭제에 실패했습니다.',
        autoClose: true,
      });
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-between px-4 pb-4">
      <ul className="flex flex-col gap-3">
        {isLoading ? (
          <p className="py-10 text-center text-neutral-600">계좌를 불러오는 중...</p>
        ) : accountList.length === 0 ? (
          <p className="py-10 text-center text-neutral-600">등록된 계좌가 없습니다.</p>
        ) : (
          accountList.map((account) => (
            <li key={account.id}>
              <AccountItem
                account={{
                  id: account.id,
                  name: account.accountHolder || '',
                  bank: account.bankName || '',
                  account: account.accountNumber || '',
                  isPrimary: account.isPrimary,
                }}
              >
                <ButtonBox
                  url={`/account/edit/${account.id}`}
                  onDelete={() => handleDelete(account.id)}
                />
              </AccountItem>
            </li>
          ))
        )}
      </ul>
      <ButtonCreate url="/account/create" status="default">
        계좌 추가하기
      </ButtonCreate>
    </div>
  );
};

export default AccountList;
