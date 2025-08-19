import { AccountHeader, Container } from '@/components/layout';

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AccountHeader />
      <Container className="p-3" noNav>
        {children}
      </Container>
    </>
  );
};

export default AccountLayout;
