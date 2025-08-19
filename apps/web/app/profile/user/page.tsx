export const dynamic = 'force-dynamic';

import MyProfile from '@/components/user/my-profile';
import OtherProfile from '@/components/user/other-profile';

const UserPage = () => {
  const isMe = false;
  return isMe ? <MyProfile /> : <OtherProfile />;
};

export default UserPage;
