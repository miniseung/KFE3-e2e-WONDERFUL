import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-sm font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-danger-700/20 aria-invalid:border-danger-700 transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        primary:
          'border-transparent bg-indigo-500 text-neutral-50 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40',
        secondary: 'border-transparent bg-teal-500 text-neutral-50 [a&]:hover:bg-primary/90',
        closed: 'border-transparent bg-neutral-500/20 text-neutral-900 [a&]:hover:bg-secondary/90',
        tertiary: 'border-transparent bg-danger-500 text-white [a&]:hover:bg-danger-500/90',
        outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

const Badge = ({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};

export { Badge, badgeVariants };
