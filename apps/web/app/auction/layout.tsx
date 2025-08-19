import { AuctionHeader } from '@/components/layout';

const AuctionLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuctionHeader />
      {children}
    </>
  );
};

export default AuctionLayout;
