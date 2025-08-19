'use client';

import { useState } from 'react';
import { AccountItem, ButtonManage, ButtonSelect, DrawerHeader } from '@/components/personal-info';
import { Button, DrawerContent, DrawerClose } from '@/components/ui';
import { useAccounts } from '@/hooks/queries/accounts';
import { supabase } from '@/lib/supabase/client';
import { useToastStore } from '@/lib/zustand/store';
import { useUserStore } from '@/lib/zustand/store/user-store';
import { ACCOUNT_DRAWER_HEADER } from '@/constants/personal-info';

const AccountDrawerContent = ({ roomId }: { roomId: string }) => {
  const { data: accountList = [], isLoading } = useAccounts();
  const { showToast } = useToastStore();
  const currentUserId = useUserStore((state) => state.user?.id);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const handleClick = async () => {
    if (!selectedAccountId) {
      showToast({ status: 'error', title: '계좌를 선택해주세요.', autoClose: true });
      return;
    }

    const selectedAccount = accountList.find((account) => account.id === selectedAccountId);
    if (!selectedAccount) {
      showToast({ status: 'error', title: '선택된 계좌를 찾을 수 없습니다.', autoClose: true });
      return;
    }

    const accountText = `💳 계좌 공유\n\n예금주: ${selectedAccount.accountHolder}\n은행: ${selectedAccount.bankName}\n계좌번호: ${selectedAccount.accountNumber}${selectedAccount.isPrimary ? '\n(대표 계좌)' : ''}`;

    try {
      const { error } = await supabase.from('chat_messages').insert({
        room_id: roomId,
        sender_id: currentUserId,
        content: accountText,
        sent_at: new Date().toISOString(),
      });

      if (error) throw new Error();

      showToast({ status: 'success', title: '계좌가 공유되었습니다.', autoClose: true });
      setSelectedAccountId(null);
    } catch (error) {
      showToast({ status: 'error', title: '계좌 공유에 실패했습니다.', autoClose: true });
    }
  };

  const handleSelect = (id: string) => {
    setSelectedAccountId(id === selectedAccountId ? null : id);
  };

  return (
    <DrawerContent className="flex flex-col gap-2 p-4">
      <DrawerHeader
        title={ACCOUNT_DRAWER_HEADER.title}
        description={ACCOUNT_DRAWER_HEADER.description}
      />
      <ul className="flex flex-col gap-2">
        {isLoading ? (
          <p className="py-10 text-center text-neutral-600">계좌를 불러오는 중...</p>
        ) : accountList.length === 0 ? (
          <p className="py-10 text-center text-neutral-600">등록된 계좌가 없습니다.</p>
        ) : (
          accountList.map((account) => (
            <li key={account.id}>
              <AccountItem
                color={selectedAccountId === account.id ? 'selected' : 'default'}
                account={{
                  id: account.id,
                  name: account.accountHolder || '',
                  bank: account.bankName || '',
                  account: account.accountNumber || '',
                  isPrimary: account.isPrimary,
                }}
              >
                <ButtonSelect
                  isSelected={selectedAccountId === account.id}
                  onClick={() => handleSelect(account.id)}
                />
              </AccountItem>
            </li>
          ))
        )}
      </ul>
      <ButtonManage title="계좌 관리" url="/account" />
      <DrawerClose asChild>
        <Button variant="solid" size="lg" onClick={handleClick} disabled={!selectedAccountId}>
          공유하기
        </Button>
      </DrawerClose>
    </DrawerContent>
  );
};

export default AccountDrawerContent;
