'use client';

import { AddressItem, ButtonBox, ButtonCreate } from '@/components/personal-info';
import { useAddresses } from '@/hooks/queries/addresses';
import { deleteAddress } from '@/lib/actions/address';
import { useToastStore } from '@/lib/zustand/store';
import { useQueryClient } from '@tanstack/react-query';

const AddressList = () => {
  const { data: addressList = [], isLoading } = useAddresses();
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteAddress(id);

      if (result.error) {
        throw new Error(result.error);
      }

      showToast({
        status: 'success',
        title: '주소가 삭제되었습니다.',
        autoClose: true,
      });

      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    } catch (error) {
      showToast({
        status: 'error',
        title: error instanceof Error ? error.message : '주소 삭제에 실패했습니다.',
        autoClose: true,
      });
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-between px-4 pb-4">
      <ul className="flex flex-col gap-3">
        {isLoading ? (
          <p className="py-10 text-center text-neutral-600">주소를 불러오는 중...</p>
        ) : addressList.length === 0 ? (
          <p className="py-10 text-center text-neutral-600">등록된 주소가 없습니다.</p>
        ) : (
          addressList.map((address) => (
            <li key={address.id}>
              <AddressItem
                address={{
                  id: address.id,
                  userName: address.userName || '',
                  address: address.address,
                  phone: address.phone || '',
                  isPrimary: address.isPrimary,
                }}
              >
                <ButtonBox
                  url={`/address/edit/${address.id}`}
                  onDelete={() => handleDelete(address.id)}
                />
              </AddressItem>
            </li>
          ))
        )}
      </ul>
      <ButtonCreate
        url={
          addressList.length > 0 && addressList[0]
            ? `/address/edit/${addressList[0].id}`
            : '/address/create'
        }
        status="default"
      >
        {addressList.length > 0 ? '주소 수정하기' : '주소 추가하기'}
      </ButtonCreate>
    </div>
  );
};

export default AddressList;
