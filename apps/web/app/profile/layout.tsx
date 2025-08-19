import { Navigation, ProfileHeader } from '@/components/layout';

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProfileHeader />

      {children}
      <Navigation />
    </>
  );
};

export default ProfileLayout;
