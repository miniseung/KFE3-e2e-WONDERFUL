'use client';

import { useEffect, useMemo, useState } from 'react';

const getRemainingTime = (deadline: Date) => {
  const totalMs = deadline.getTime() - new Date().getTime();
  const isExpired = totalMs <= 0;

  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return { hours, minutes, seconds, isExpired };
};

const useCountdown = (deadline: Date | null, type: 'minute' | 'second') => {
  const stableDeadline = useMemo(() => (deadline ? new Date(deadline) : null), [deadline]);
  const [remaining, setRemaining] = useState(() =>
    stableDeadline
      ? getRemainingTime(stableDeadline)
      : { hours: '00', minutes: '00', seconds: '00', isExpired: false }
  );

  useEffect(() => {
    if (!stableDeadline || remaining.isExpired) return;

    const intervalMs = type === 'minute' ? 60000 : 1000;

    const interval = setInterval(() => {
      const updated = getRemainingTime(stableDeadline);
      setRemaining(updated);

      if (updated.isExpired) {
        clearInterval(interval);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [remaining.isExpired, stableDeadline, type]);

  return remaining;
};

export default useCountdown;
