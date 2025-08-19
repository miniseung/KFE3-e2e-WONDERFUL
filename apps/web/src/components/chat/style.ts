import { tv } from 'tailwind-variants';

const productCardStyle = tv({
  slots: {
    wrapper: 'border-y-1 flex h-auto w-full flex-col justify-between border-neutral-100 p-3',
    content: 'flex h-full w-full items-center gap-2',
    infoBox: 'flex min-w-0 flex-1 flex-col',
    buttonBox: 'flex items-center justify-end gap-2',
    button: 'h-8 px-3 bg-neutral-200 w-1/5 rounded-md',
  },
  variants: {
    loading: {
      true: {
        wrapper: 'animate-pulse',
        content: 'animate-pulse',
      },
    },
  },
  defaultVariants: {
    loading: false,
  },
});

export default productCardStyle;
