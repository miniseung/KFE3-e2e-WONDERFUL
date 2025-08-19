'use client';

import { useState } from 'react';
import { AddressItem, ButtonManage, ButtonSelect, DrawerHeader } from '@/components/personal-info';
import { Button, DrawerContent, DrawerClose } from '@/components/ui';
import { useAddresses } from '@/hooks/queries/addresses';
import { supabase } from '@/lib/supabase/client';
import { useToastStore } from '@/lib/zustand/store';
import { useUserStore } from '@/lib/zustand/store/user-store';
import { ADDRESS_DRAWER_HEADER } from '@/constants/personal-info';

const AddressDrawerContent = ({ roomId }: { roomId: string }) => {
  const { data: addressList = [], isLoading } = useAddresses();
  const { showToast } = useToastStore();
  const currentUserId = useUserStore((state) => state.user?.id);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const handleClick = async () => {
    if (!selectedAddressId) {
      showToast({
        status: 'error',
        title: '주소를 선택해주세요.',
        autoClose: true,
      });
      return;
    }

    const selectedAddress = addressList.find((address) => address.id === selectedAddressId);
    if (!selectedAddress) {
      showToast({
        status: 'error',
        title: '선택된 주소를 찾을 수 없습니다.',
        autoClose: true,
      });
      return;
    }

    const addressText = `📍 주소 공유\n\n${selectedAddress.userName ? `수취인: ${selectedAddress.userName}\n` : ''}주소: ${selectedAddress.address}${selectedAddress.addressDetail ? `\n상세주소: ${selectedAddress.addressDetail}` : ''}${selectedAddress.phone ? `\n연락처: ${selectedAddress.phone}` : ''}`;

    try {
      const { error } = await supabase.from('chat_messages').insert({
        room_id: roomId,
        sender_id: currentUserId,
        content: addressText,
        sent_at: new Date().toISOString(),
      });

      if (error) throw new Error();

      showToast({
        status: 'success',
        title: '주소가 공유되었습니다.',
        autoClose: true,
      });

      setSelectedAddressId(null);
    } catch (error) {
      showToast({
        status: 'error',
        title: '주소 공유에 실패했습니다.',
        autoClose: true,
      });
    }
  };

  const handleSelect = (id: string) => {
    setSelectedAddressId(id === selectedAddressId ? null : id);
  };

  return (
    <DrawerContent className="flex flex-col gap-2 p-4">
      <DrawerHeader
        title={ADDRESS_DRAWER_HEADER.title}
        description={ADDRESS_DRAWER_HEADER.description}
      />
      <ul className="flex flex-col gap-2">
        {isLoading ? (
          <p className="py-10 text-center text-neutral-600">주소를 불러오는 중...</p>
        ) : addressList.length === 0 ? (
          <p className="py-10 text-center text-neutral-600">등록된 주소가 없습니다.</p>
        ) : (
          addressList.map((address) => (
            <li key={address.id}>
              <AddressItem
                color={selectedAddressId === address.id ? 'selected' : 'default'}
                address={{
                  id: address.id,
                  userName: address.userName || '',
                  address: address.address,
                  phone: address.phone || '',
                  isPrimary: address.isPrimary,
                }}
              >
                <ButtonSelect
                  isSelected={selectedAddressId === address.id}
                  onClick={() => handleSelect(address.id)}
                />
              </AddressItem>
            </li>
          ))
        )}
      </ul>
      <ButtonManage url="/address" title="주소 관리" />
      <DrawerClose asChild>
        <Button variant="solid" size="lg" onClick={handleClick} disabled={!selectedAddressId}>
          공유하기
        </Button>
      </DrawerClose>
    </DrawerContent>
  );
};

export default AddressDrawerContent;
