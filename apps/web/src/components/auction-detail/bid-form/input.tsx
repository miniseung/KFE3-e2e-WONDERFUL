import React from 'react';

import { RotateCcw, UserRound } from 'lucide-react';
import { tv } from 'tailwind-variants';

import { Button } from '@/components/ui/button';

import { useAuctionDetail } from '@/hooks/queries/auction';

import { cn } from '@/lib/cn';
import { formatCurrency, formatCurrencyWithUnit, formatToKoreanUnit } from '@/lib/utils/price';

import { BidInputProps } from '@/types/bid';

const bidInputWrapper = tv({
  base: 'transition-all duration-600 overflow-hidden px-1',
  variants: {
    open: {
      true: 'pt-2 max-h-[160px] translate-y-0',
      false: 'max-h-0 translate-y-4 pointer-events-none',
    },
  },
});

interface ExtendedBidInputProps extends BidInputProps {
  validationError?: string;
}

const BidFormInput = ({
  auctionId,
  currentPrice,
  minUnit, // 최소 입찰 단위
  bidPrice,
  isBidInputOpen,
  onChange,
  validationError = '',
}: ExtendedBidInputProps) => {
  const { data } = useAuctionDetail(auctionId);
  const minBidUnit = data?.data.auctionPrice?.minBidUnit || 1000;
  const placeholder = `${formatCurrencyWithUnit(currentPrice + minUnit)} 부터`;
  const defaultBidPrice = currentPrice + minBidUnit;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replaceAll(',', '');
    const parsed = Number(value);
    onChange(isNaN(parsed) ? null : parsed);
  };

  const handleReset = () => {
    onChange(defaultBidPrice);
  };

  const increaseButtons = [
    {
      label: `+${formatToKoreanUnit(minBidUnit * 100)}`,
      amount: minBidUnit * 100,
      multiplier: '100배',
    },
    {
      label: `+${formatToKoreanUnit(minBidUnit * 50)}`,
      amount: minBidUnit * 50,
      multiplier: '50배',
    },
    {
      label: `+${formatToKoreanUnit(minBidUnit * 10)}`,
      amount: minBidUnit * 10,
      multiplier: '10배',
    },
    { label: `+${formatToKoreanUnit(minBidUnit)}`, amount: minBidUnit, multiplier: '1배' },
  ];

  const handleIncrease = (amount: number) => {
    const current = bidPrice ?? defaultBidPrice;
    onChange(current + amount);
  };

  return (
    <div className={bidInputWrapper({ open: isBidInputOpen })}>
      <div className="h-25 flex w-full flex-col items-start justify-center gap-2">
        <label htmlFor="price" className="flex items-center gap-1">
          <p className="font-medium">희망입찰가</p>
          <span className="text-xs text-neutral-500">
            (입찰 단위: <strong>{formatCurrency(minBidUnit || 0)}</strong>원)
          </span>
        </label>
        <div
          className={cn(
            `shadow-xs flex h-14 w-full min-w-0 items-center justify-between rounded-sm border bg-transparent p-1 text-base text-neutral-400 focus-within:border-neutral-400 focus-within:ring-[2px] focus-within:ring-neutral-400/50 md:text-sm [&>svg]:h-5 [&>svg]:w-5`
          )}
        >
          <div className="flex items-center gap-2 pl-2">
            <UserRound />
            <input
              id="price"
              value={bidPrice ?? defaultBidPrice}
              placeholder={placeholder}
              onChange={handleChange}
              className="aria-invalid:ring-danger-700/20 aria-invalid:border-danger-700 selection:text-primary-500 w-full text-black placeholder:text-neutral-400 focus:shadow-none focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex size-10 items-center justify-center"
            title="현재가로 초기화"
          >
            <RotateCcw className="text-neutral-400" />
          </button>
        </div>
      </div>
      {validationError && <div className="mt-1 text-sm text-red-500">{validationError}</div>}
      <div className="grid grid-cols-4 gap-2 py-2">
        {increaseButtons.map(({ label, amount, multiplier }) => (
          <Button
            key={amount}
            size="min"
            color="secondary"
            type="button"
            onClick={() => handleIncrease(amount)}
            className="flex h-auto flex-col items-center justify-center gap-0 px-2 py-1"
          >
            <span>{label}</span>
            <span className="text-xs opacity-70">({multiplier})</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BidFormInput;
