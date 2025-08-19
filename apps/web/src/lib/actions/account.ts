'use server';

import type { Account, CreateAccountRequest } from '@/lib/types/account';
import {
  getAuthenticatedUser,
  handlePrimaryUpdate,
  revalidatePages,
  createTimestamps,
  updateTimestamp,
} from '@/lib/utils/server-actions';

const transform = (item: any): Account => ({
  id: item.id,
  userId: item.user_id,
  bankName: item.bank_name,
  accountNumber: item.account_number,
  accountHolder: item.account_holder,
  isPrimary: item.is_primary,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

export async function getAccounts(): Promise<{ data?: Account[]; error?: string }> {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser();
    if (authError || !user) return { error: '인증이 필요합니다.' };

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data: data?.map(transform) };
  } catch {
    return { error: '계좌 조회 중 오류가 발생했습니다.' };
  }
}

export async function createAccount(
  accountData: CreateAccountRequest
): Promise<{ data?: Account; error?: string }> {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser();
    if (authError || !user) return { error: '인증이 필요합니다.' };

    const { bankName, accountNumber, accountHolder, isPrimary } = accountData;
    if (!bankName?.trim() || !accountNumber?.trim() || !accountHolder?.trim())
      return { error: '모든 필드는 필수 입력 항목입니다.' };

    if (isPrimary) {
      await handlePrimaryUpdate(supabase, 'accounts', user.id);
    }

    const { data, error } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        bank_name: bankName,
        account_number: accountNumber,
        account_holder: accountHolder,
        is_primary: isPrimary || false,
        ...(await createTimestamps()),
      })
      .select()
      .single();

    if (error) return { error: error.message };

    await revalidatePages(['/account']);
    return { data: transform(data) };
  } catch {
    return { error: '계좌 등록 중 오류가 발생했습니다.' };
  }
}

export async function updateAccount(
  id: string,
  accountData: CreateAccountRequest
): Promise<{ data?: Account; error?: string }> {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser();
    if (authError || !user) return { error: '인증이 필요합니다.' };

    const { bankName, accountNumber, accountHolder, isPrimary } = accountData;

    if (isPrimary) {
      await handlePrimaryUpdate(supabase, 'accounts', user.id, id);
    }

    const { data, error } = await supabase
      .from('accounts')
      .update({
        bank_name: bankName,
        account_number: accountNumber,
        account_holder: accountHolder,
        is_primary: isPrimary || false,
        ...(await updateTimestamp()),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) return { error: error.message };

    await revalidatePages(['/account']);
    return { data: transform(data) };
  } catch {
    return { error: '계좌 수정 중 오류가 발생했습니다.' };
  }
}

export async function deleteAccount(id: string): Promise<{ error?: string }> {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser();
    if (authError || !user) return { error: '인증이 필요합니다.' };

    const { error } = await supabase.from('accounts').delete().eq('id', id).eq('user_id', user.id);
    if (error) return { error: error.message };

    await revalidatePages(['/account']);
    return {};
  } catch {
    return { error: '계좌 삭제 중 오류가 발생했습니다.' };
  }
}
