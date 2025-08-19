'use client';

interface NoticeClasses {
  children: React.ReactNode;
  status: string;
  className?: string;
}

const Notice = ({ children, status, className }: NoticeClasses) => {
  const typeClasses: Record<string, string> = {
    notice: 'bg-neutral-100 text-neutral-600',
    caution: 'bg-danger-50 text-danger-600',
  };

  return (
    <ul
      className={`pt-5.5 flex flex-col gap-3 rounded-sm px-4 pb-5 text-sm font-medium [&_li]:flex [&_li]:items-center [&_li]:gap-1 ${typeClasses[status] ?? typeClasses['notice']} ${className}`}
    >
      {children}
    </ul>
  );
};

export default Notice;
