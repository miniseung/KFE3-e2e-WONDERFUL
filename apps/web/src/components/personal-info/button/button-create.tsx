import Link from 'next/link';

import { Plus } from 'lucide-react';
import { tv } from 'tailwind-variants';

interface ButtonCreateProps {
  url: string;
  children: React.ReactNode;
  status: 'default' | 'disabled';
}

const style = tv({
  base: "h-12 rounded-md px-5 has-[>svg]:px-4 text-lg [&_svg]:!w-6.5 [&_svg]:stroke-[2px] border bg-transparent inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-danger-700/20 aria-invalid:border-danger-700 cursor-pointer [&_svg]:!h-auto",
  variants: {
    status: {
      default: ' border-primary-500 text-primary-500 hover:bg-primary-50',
      disabled: 'border-neutral-200 bg--50 text-neutral-300',
    },
  },
  defaultVariants: {
    status: 'default',
  },
});

const ButtonCreate = ({ children, url, status }: ButtonCreateProps) => {
  return (
    <Link href={url} className={style({ status })}>
      <Plus size={16} />
      <p>{children}</p>
    </Link>
  );
};

export default ButtonCreate;
