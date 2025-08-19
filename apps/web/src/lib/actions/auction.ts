'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { convertHoursToTimestamp } from '@/lib/utils/date';

import { AuctionFormData, AuctionPriceUpdate, AuctionStatus } from '@/types/auction';

export const createAuction = async (data: AuctionFormData, userId: string) => {
  try {
    if (data.prices.start_price > 2147483647) {
      throw new Error('경매 시작가는 21억원을 초과할 수 없습니다.');
    }

    const supabase = await createClient();

    const { data: primaryLocation, error: locationError } = await supabase
      .from('locations')
      .select('id')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();

    if (locationError && locationError.code !== 'PGRST116') {
      throw new Error(`기본 위치 조회 실패: ${locationError.message}`);
    }

    const { data: itemInsertResult, error: itemError } = await supabase
      .from('auction_items')
      .insert({
        seller_id: userId,
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        location_id: primaryLocation?.id ?? null,
        start_time: data.start_time ?? null,
        end_time: convertHoursToTimestamp(data.end_time),
        auction_type: data.auction_type || 'NORMAL',
        thumbnail_url: data.images?.[0] || '',
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (itemError) {
      throw new Error(`auction_items 저장 실패: ${itemError?.message}`);
    }

    const itemId = itemInsertResult.id;

    const { error: priceError } = await supabase.from('auction_prices').insert({
      item_id: itemId,
      start_price: data.prices.start_price,
      instant_price: data.prices.instant_price || null,
      min_bid_unit: data.prices.min_bid_unit,
      current_price: data.prices.start_price,
      is_instant_buy_enabled: data.is_instant_buy_enabled,
      is_extended_auction: data.is_extended_auction || false,
    });

    if (priceError) {
      throw new Error(`auction_prices 저장 실패: ${priceError.message}`);
    }

    if (data.images && data.images.length > 0) {
      const { error: imageError } = await supabase.from('auction_images').insert({
        item_id: itemId,
        urls: data.images,
      });

      if (imageError) {
        throw new Error(`auction_images 저장 실패: ${imageError.message}`);
      }
    }

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/auction');

    return itemId;
  } catch (error) {
    return { error: error };
  }
};

export const updateAuction = async (data: AuctionFormData, itemId: string) => {
  const supabase = await createClient();
  const endtime = convertHoursToTimestamp(data.end_time);

  try {
    const { data: currentAuctionItem, error: fetchItemError } = await supabase
      .from('auction_items')
      .select('location_id')
      .eq('id', itemId)
      .single();

    if (fetchItemError) {
      throw new Error(`현재 경매 정보 조회 실패: ${fetchItemError.message}`);
    }

    const { data: currentAuction, error: fetchError } = await supabase
      .from('auction_prices')
      .select('start_price, current_price')
      .eq('item_id', itemId)
      .single();

    if (fetchError) {
      throw new Error(`현재 경매 정보 조회 실패: ${fetchError.message}`);
    }

    const hasBids = currentAuction.current_price > currentAuction.start_price;
    if (Array.isArray(data.images) && data.images.length > 0 && data.images[0]) {
      const { error: imageDeleteError } = await supabase
        .from('auction_images')
        .delete()
        .eq('item_id', itemId);

      if (imageDeleteError) {
        throw new Error(`auction_image 삭제 실패: ${imageDeleteError.message}`);
      }

      const { error: imageInsertError } = await supabase.from('auction_images').insert({
        item_id: itemId,
        urls: data.images,
      });

      if (imageInsertError) {
        throw new Error(`auction_images 삽입 실패: ${imageInsertError.message}`);
      }
    }

    const { error: itemError } = await supabase
      .from('auction_items')
      .update({
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        location_id: currentAuctionItem.location_id,
        end_time: endtime,
        thumbnail_url: data.images?.[0] || '',
      })
      .eq('id', itemId);

    if (itemError) {
      throw new Error(`auction_items 수정 실패: ${itemError.message}`);
    }

    const priceUpdateData: AuctionPriceUpdate = {
      instant_price: data.prices.instant_price,
      min_bid_unit: data.prices.min_bid_unit,
      is_instant_buy_enabled: data.is_instant_buy_enabled,
      is_extended_auction: data.is_extended_auction || false,
    };

    if (!hasBids) {
      priceUpdateData.start_price = data.prices.start_price;
      priceUpdateData.current_price = data.prices.start_price;
    } else {
      return;
    }

    const { error: priceError } = await supabase
      .from('auction_prices')
      .update(priceUpdateData)
      .eq('item_id', itemId);

    if (priceError) {
      throw new Error(`auction_prices 수정 실패: ${priceError.message}`);
    }

    revalidatePath(`/auction/${itemId}`);
    revalidatePath('/');

    return itemId;
  } catch (error) {
    return { error: error };
  }
};

export const deleteAuction = async (id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from('auction_items').delete().eq('id', id);

  if (error) {
    throw new Error(`경매 삭제 중 오류가 발생했습니다: ${error.message}`);
  }
  revalidatePath('/', 'layout');
  revalidatePath('/');
  revalidatePath('/auction');
  return data;
};

export const updateThumbnailOnly = async (thumbnailUrl: string, itemId: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('auction_items')
      .update({
        thumbnail_url: thumbnailUrl,
      })
      .eq('id', itemId);

    if (error) {
      throw new Error(`썸네일 업데이트 실패: ${error.message}`);
    }

    return true;
  } catch (error) {
    return { error: error };
  }
};

export const addAuctionImages = async (itemId: string, imageUrls: string[]) => {
  const supabase = await createClient();

  const { error } = await supabase.from('auction_images').insert({
    item_id: itemId,
    urls: imageUrls,
  });

  if (error) throw new Error(`이미지 저장 실패: ${error.message}`);
};

export const getAuctionStatus = async (itemId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('auction_items')
    .select('status')
    .eq('id', itemId)
    .single();

  if (error) throw new Error(`경매 상태 조회 실패: ${error.message}`);

  return data.status;
};
export const updateAuctionStatus = async (itemId: string, status: AuctionStatus) => {
  const supabase = await createClient();

  try {
    const { data: existingAuction, error: fetchError } = await supabase
      .from('auction_items')
      .select('id, status')
      .eq('id', itemId)
      .maybeSingle();

    if (fetchError) {
      throw new Error(`경매 조회 실패: ${fetchError.message}`);
    }

    if (!existingAuction) {
      throw new Error(`존재하지 않는 경매입니다: ${itemId}`);
    }

    if (existingAuction.status === status) {
      return;
    }

    const { error: updateError, data: updatedData } = await supabase
      .from('auction_items')
      .update({
        status,
      })
      .eq('id', itemId)
      .select('id, status')
      .single();

    if (updateError) {
      throw new Error(`경매 상태 업데이트 실패: ${updateError.message}`);
    }

    if (!updatedData) {
      throw new Error(`업데이트 결과를 확인할 수 없습니다: ${itemId}`);
    }
  } catch (error) {
    console.error('updateAuctionStatus 오류:', error);
    throw error; // 상위로 에러 전파
  }
};
