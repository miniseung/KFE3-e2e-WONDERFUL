import { AuctionDetailContainer } from '@/components/auction-detail';
import { Container } from '@/components/layout';

const Page = () => {
  return (
    <Container noNav noHead>
      <AuctionDetailContainer />
    </Container>
  );
};

export default Page;
