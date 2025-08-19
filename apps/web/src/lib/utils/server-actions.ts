'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export const getAuthenticatedUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error, supabase };
};

export const handlePrimaryUpdate = async (
  supabase: any,
  table: string,
  userId: string,
  currentId?: string
) => {
  const updates: any = { is_primary: false };
  let query = supabase.from(table).update(updates).eq('user_id', userId).eq('is_primary', true);

  if (currentId) {
    query = query.neq('id', currentId);
  }

  return query;
};

export const revalidatePages = async (paths: string[]) => {
  paths.forEach((path) => revalidatePath(path));
};

export const createTimestamps = async () => {
  const now = new Date().toISOString();
  return { created_at: now, updated_at: now };
};

export const updateTimestamp = async () => {
  return { updated_at: new Date().toISOString() };
};
