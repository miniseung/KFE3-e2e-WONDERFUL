import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-danger-700/20 aria-invalid:border-danger-700 cursor-pointer [&_svg]:!h-auto",
  {
    variants: {
      variant: {
        // default=solid type
        solid: '',
        outline: 'border bg-transparent',
      },
      color: {
        // default=primary color
        primary: 'focus-visible:ring-primary-500/50',
        secondary: 'focus-visible:ring-neutral-400/50',
        disabled: 'cursor-not-allowed ',
        positive: 'focus-visible:ring-success-600/40',
        negative: 'focus-visible:ring-danger-600/40',
        transparent: 'focus-visible:ring-primary-500/50 bg-transprent',
      },
      size: {
        min: 'h-8 text-sm font-weight-semibold px-3 [&_svg]:!w-4',
        sm: 'h-10 rounded-md gap-1.5 px-4 has-[>svg]:px-2.5 text-sm font-weight-medium [&_svg]:!w-4.5',
        medium:
          'h-11 px-4 py-2 has-[>svg]:px-3 text-base font-weight-medium [&_svg]:!w-6 [&_svg]:stroke-[2px]',
        lg: 'h-12 rounded-md px-5 has-[>svg]:px-4 text-lg [&_svg]:!w-6.5 [&_svg]:stroke-[2px]',
        xl: 'h-16 rounded-md px-5 text-lg has-[>svg]:px-4 [&_svg]:!w-6.5 [&_svg]:stroke-[2px]',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        color: 'primary',
        className: 'bg-primary-500 hover:bg-primary-700 text-white',
      },
      {
        variant: 'solid',
        color: 'secondary',
        className:
          'bg-neutral-200 hover:bg-neutral-300 text-neutral-800 [&_svg]:stroke-neutral-800',
      },
      {
        variant: 'solid',
        color: 'disabled',
        className: 'bg-neutral-200 text-neutral-400 [&_svg]:stroke-neutral-300 cursor-not-allowed',
      },
      {
        variant: 'solid',
        color: 'positive',
        className: 'bg-success-500 hover:bg-success-600 text-white',
      },
      {
        variant: 'solid',
        color: 'negative',
        className: 'bg-danger-600 hover:bg-danger-700 text-white',
      },
      {
        variant: 'outline',
        color: 'primary',
        className: 'border-primary-500 text-primary-500 hover:bg-primary-50',
      },
      {
        variant: 'outline',
        color: 'secondary',
        className: 'border-neutral-400 hover:bg-neutral-100',
      },
      {
        variant: 'outline',
        color: 'disabled',
        className: 'border-neutral-200 bg--50 text-neutral-300',
      },
      {
        variant: 'outline',
        color: 'positive',
        className: 'border-success-500 text-success-500 hover:bg-success-50',
      },
      {
        variant: 'outline',
        color: 'negative',
        className: 'border-danger-600 text-danger-600 hover:bg-danger-50',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      size: 'medium',
      color: 'primary',
      fullWidth: false,
    },
  }
);

const Button = ({
  className,
  variant,
  size,
  color,
  fullWidth,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, color, fullWidth }), className)}
      {...props}
    />
  );
};

export { Button, buttonVariants };
