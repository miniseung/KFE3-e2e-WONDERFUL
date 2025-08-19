import * as React from 'react';

import { cn } from '@/lib/cn';

const Input = ({ className, type, ...props }: React.ComponentProps<'input'>) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground border-input flex h-11 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm placeholder:text-neutral-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'aria-invalid:ring-danger-100/20 aria-invalid:border-danger-100',
        'focus-visible:border-primary-500 focus-visible:ring-primary-500/10 focus-visible:ring-[2px]',

        className
      )}
      {...props}
    />
  );
};

export { Input };
