import Countdown from '@/components/auction-detail/countdown';
import { Badge } from '@/components/ui/badge';

import { ItemInformationProps } from '@/lib/types/auction';
import { formatDate } from '@/lib/utils/date';

const ItemSummary = ({ item, id, countdown }: ItemInformationProps) => {
  const { isExpired } = countdown;
  const deadline = formatDate(new Date(item.endTime));
  const actualStatus = isExpired ? '경매종료' : '경매중';

  const getBadgeVariant = () => {
    if (isExpired) return 'closed';
    return 'primary';
  };

  return (
    <section className="my-0.5 flex h-auto w-full flex-col bg-white p-4">
      <Badge variant={getBadgeVariant()} className={'rounded-sm px-1.5 py-0 text-xs'}>
        {actualStatus}
      </Badge>
      <h2 className="mt-1.5 text-xl font-semibold text-neutral-900">{item.title}</h2>
      <div className="mt-2 flex justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-900">마감시간</span>
          <time className="text-sm font-medium text-neutral-400">{deadline}</time>
        </div>
        <Countdown countdown={countdown} />
      </div>
    </section>
  );
};

export default ItemSummary;
