import { Container } from '@/components/layout';

const layoutChatRoom = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Container noNav>{children}</Container>
    </>
  );
};

export default layoutChatRoom;
