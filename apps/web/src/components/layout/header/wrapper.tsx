import { cn } from '@/lib/cn';

interface HeaderWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const HeaderWrapper = ({ children, className, style }: HeaderWrapperProps) => {
  return (
    <header
      className={cn(
        'h-15 absolute top-0 z-50 flex w-full flex-shrink-0 items-center justify-between bg-white px-4 pt-1',
        className
      )}
      style={style}
    >
      {children}
    </header>
  );
};

export default HeaderWrapper;
