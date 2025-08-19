import CategoriesFilter from '@/components/auction/categories-filter';
import { AuctionItemList, CreateAuctionButton } from '@/components/common';
import { MainHeader, Navigation } from '@/components/layout';
import Container from '@/components/layout/container';

const Page = () => {
  return (
    <>
      <MainHeader />
      <Container className="px-4">
        <CategoriesFilter />
        <AuctionItemList includeCompleted={false} />
      </Container>
      <CreateAuctionButton />
      <Navigation />
    </>
  );
};

export default Page;
