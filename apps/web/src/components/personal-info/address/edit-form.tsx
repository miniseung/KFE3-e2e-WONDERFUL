'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { InputPersonal } from '@/components/personal-info';
import { Button } from '@/components/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { updateAddress } from '@/lib/actions/address';
import { useAddresses } from '@/hooks/queries/addresses';
import type { CreateAddressRequest } from '@/lib/types/address';
import { useToastStore } from '@/lib/zustand/store';
import { useQueryClient } from '@tanstack/react-query';

const AddressEditForm = ({ addressId }: { addressId: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  const { data: addressList = [] } = useAddresses();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAddressRequest>({
    userName: '',
    address: '',
    addressDetail: '',
    phone: '',
    isPrimary: false,
  });

  useEffect(() => {
    const address = addressList.find((addr) => addr.id === addressId);
    if (address) {
      setFormData({
        userName: address.userName || '',
        address: address.address,
        addressDetail: address.addressDetail || '',
        phone: address.phone || '',
        isPrimary: address.isPrimary,
      });
    }
  }, [addressList, addressId]);

  const handleInputChange = (field: keyof CreateAddressRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (checked: boolean | string) => {
    setFormData((prev) => ({ ...prev, isPrimary: checked === true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.address) {
      showToast({
        status: 'error',
        title: '주소를 입력해주세요.',
        autoClose: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateAddress(addressId, formData);

      if (result.error) {
        throw new Error(result.error);
      }

      showToast({
        status: 'success',
        title: '주소가 수정되었습니다.',
        autoClose: true,
      });

      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      router.push('/address');
    } catch (error) {
      showToast({
        status: 'error',
        title: error instanceof Error ? error.message : '주소 수정에 실패했습니다.',
        autoClose: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full w-full flex-col justify-between px-4">
      <div className="flex flex-col gap-4">
        <InputPersonal
          id="userName"
          label="이름"
          placeholder="이름을 입력해주세요"
          type="text"
          value={formData.userName || ''}
          onChange={(e) => handleInputChange('userName', e.target.value)}
        />
        <div className="flex flex-col">
          <InputPersonal
            id="address"
            label="주소"
            placeholder="주소를 입력해주세요"
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
          <InputPersonal
            id="addressDetail"
            placeholder="상세주소를 입력해주세요"
            type="text"
            value={formData.addressDetail || ''}
            onChange={(e) => handleInputChange('addressDetail', e.target.value)}
          />
        </div>
        <InputPersonal
          id="phone"
          label="휴대전화"
          placeholder="휴대전화 번호를 입력해주세요"
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />
      </div>
      <div className="flex w-full flex-col gap-4 pb-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="isPrimary"
            checked={formData.isPrimary}
            onCheckedChange={handleCheckboxChange}
          />
          <label htmlFor="isPrimary">대표 주소로 설정하기</label>
        </div>
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? '수정 중...' : '수정하기'}
        </Button>
      </div>
    </form>
  );
};

export default AddressEditForm;
