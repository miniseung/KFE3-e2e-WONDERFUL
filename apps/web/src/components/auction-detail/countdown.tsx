import { cn } from '@/lib/cn';
import { CountdownProps } from '@/lib/types/auction';

const Countdown = ({ countdown }: { countdown: CountdownProps }) => {
  const { hours, minutes, seconds, isExpired } = countdown;
  const formatted = `${hours}:${minutes}:${seconds}`;

  return (
    <time
      className={cn(`text-3xl font-medium`, isExpired ? 'text-neutral-400' : 'text-danger-600')}
      aria-label={`남은 시간 ${hours}시간 ${minutes}분 ${seconds}초`}
    >
      {formatted}
    </time>
  );
};

export default Countdown;
