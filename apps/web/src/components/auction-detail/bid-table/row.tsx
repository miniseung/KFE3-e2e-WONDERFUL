'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/client';
import { formatCurrencyWithUnit } from '@/lib/utils/price';

import { BidType } from '@/types/bid';

import BidderAvatar from './bidder-avatar';

const BidTableRow = ({ item }: { item: BidType }) => {
  const [userid, setUserid] = useState<string | null>(null);
  const isAuthor = userid === item.bidder.id;
  const bid = formatCurrencyWithUnit(item.price);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserid(user?.id || null);
    };

    getUser();
  }, []);

  return (
    <li className="flex items-center justify-between text-center">
      <BidderAvatar
        profileImg={item.bidder.profileImg || ''}
        nickname={item.bidder.nickname}
        isAuthor={isAuthor}
      />
      <div
        className={cn(
          'border-1 border-primary-100 ml-3 flex w-full rounded-sm bg-white py-2.5 text-sm text-neutral-600 opacity-90',
          isAuthor &&
            'border-1 border-primary-500 text-primary-600 shadow-primary-300 font-bold opacity-100 shadow-sm'
        )}
      >
        <p>{item.bidder.nickname}</p>
        <p>{bid}</p>
      </div>
    </li>
  );
};

export default BidTableRow;
