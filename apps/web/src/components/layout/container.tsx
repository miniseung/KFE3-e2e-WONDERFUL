import { tv } from 'tailwind-variants';

const Container = ({
  children,
  className = '',
  noNav = false,
  noHead = false,
}: {
  children: React.ReactNode;
  className?: string;
  noNav?: boolean;
  noHead?: boolean;
}) => {
  const containerStyle = tv({
    base: 'scrollbar-hide-y scroll-touch h-full w-full overflow-y-auto overscroll-contain',
    variants: {
      noNav: {
        true: 'pb-0',
        false: 'pb-[calc(76px+env(safe-area-inset-bottom))]',
      },
      noHead: {
        true: 'pt-0',
        false: 'pt-15',
      },
    },
  });
  return <main className={`${containerStyle({ noHead, noNav })} ${className}`}>{children}</main>;
};

export default Container;
