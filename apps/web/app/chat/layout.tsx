import { ChatHeader, Navigation } from '@/components/layout';

const layoutChat = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ChatHeader />
      {children}
      <Navigation />
    </>
  );
};

export default layoutChat;
