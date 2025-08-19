import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const FloatButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-danger-700/20 aria-invalid:border-danger-700 cursor-pointer [&_svg]:!h-auto",
  {
    variants: {
      variant: { solid: '', transparent: 'bg-transparent' },
      color: {
        primary: '',
        secondary: '',
      },
      size: {
        min: 'w-7.5 h-7.5',
        sm: 'w-10 h-10',
        medium: 'w-12 h-12 [&_svg]:!w-6',
        lg: 'w-13.5 h-13.5 [&_svg]:!w-7',
      },
    },
    compoundVariants: [
      { variant: 'solid', color: 'primary', className: 'bg-primary-500 text-white' },
      { variant: 'solid', color: 'secondary', className: 'bg-neutral-300 text-neutral-800' },
      { variant: 'transparent', color: 'primary', className: 'text-primary-500' },
      { variant: 'transparent', color: 'secondary', className: 'text-neutral-600' },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'medium',
    },
  }
);

const FloatButton = ({
  className,
  variant,
  size,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof FloatButtonVariants> & {
    asChild?: boolean;
  }) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(FloatButtonVariants({ variant, size, color }), className)}
      {...props}
    />
  );
};

export { FloatButton, FloatButtonVariants };
