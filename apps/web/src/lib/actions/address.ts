'use server';

import type { Address, CreateAddressRequest } from '@/lib/types/address';
import {
  getAuthenticatedUser,
  handlePrimaryUpdate,
  revalidatePages,
  createTimestamps,
  updateTimestamp,
} from '@/lib/utils/server-actions';

const transform = (item: any): Address => ({
  id: item.id,
  userId: item.user_id,
  label: item.label,
  userName: item.user_name,
  phone: item.phone,
  address: item.address,
  addressDetail: item.address_detail,
  isPrimary: item.is_primary,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

export async function getAddresses(): Promise<{ data?: Address[]; error?: string }> {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser();
    if (authError || !user) return { error: '인증이 필요합니다.' };

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { data: [] };
      }
      return { error: error.message };
    }
    return { data: data ? [transform(data)] : [] };
  } catch {
    return { error: '주소 조회 중 오류가 발생했습니다.' };
  }
}

export async function createAddress(
  addressData: CreateAddressRequest
): Promise<{ data?: Address; error?: string }> {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser();
    if (authError || !user) return { error: '인증이 필요합니다.' };
    if (!addressData.address) return { error: '주소는 필수 입력 항목입니다.' };

    const { label, userName, phone, address, addressDetail, isPrimary } = addressData;

    const { data: existingAddress } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingAddress) {
      const { data, error } = await supabase
        .from('addresses')
        .update({
          label,
          user_name: userName,
          phone,
          address,
          address_detail: addressDetail,
          is_primary: isPrimary || false,
          ...(await updateTimestamp()),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) return { error: error.message };

      await revalidatePages(['/chat', '/address']);
      return { data: transform(data) };
    } else {
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          label,
          user_name: userName,
          phone,
          address,
          address_detail: addressDetail,
          is_primary: isPrimary || false,
          ...(await createTimestamps()),
        })
        .select()
        .single();

      if (error) return { error: error.message };

      await revalidatePages(['/chat', '/address']);
      return { data: transform(data) };
    }
  } catch {
    return { error: '주소 등록 중 오류가 발생했습니다.' };
  }
}

export async function updateAddress(
  id: string,
  addressData: CreateAddressRequest
): Promise<{ data?: Address; error?: string }> {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser();
    if (authError || !user) return { error: '인증이 필요합니다.' };

    const { label, userName, phone, address, addressDetail, isPrimary } = addressData;

    if (isPrimary) {
      await handlePrimaryUpdate(supabase, 'addresses', user.id, id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update({
        label,
        user_name: userName,
        phone,
        address,
        address_detail: addressDetail,
        is_primary: isPrimary,
        ...(await updateTimestamp()),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) return { error: error.message };

    await revalidatePages(['/chat', '/address']);
    return { data: transform(data) };
  } catch {
    return { error: '주소 수정 중 오류가 발생했습니다.' };
  }
}

export async function deleteAddress(id: string): Promise<{ error?: string }> {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser();
    if (authError || !user) return { error: '인증이 필요합니다.' };

    const { error } = await supabase.from('addresses').delete().eq('id', id).eq('user_id', user.id);
    if (error) return { error: error.message };

    await revalidatePages(['/chat', '/address']);
    return {};
  } catch {
    return { error: '주소 삭제 중 오류가 발생했습니다.' };
  }
}
