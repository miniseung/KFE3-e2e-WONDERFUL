'use client';

import { useEffect, useState } from 'react';

import { ChatBubble } from '@/components/chat';
import { ProfileImage } from '@/components/common';

import { getUserProfile } from '@/lib/actions/profile';
import { UserProfile } from '@/lib/types';
import { formatTo12HourTime } from '@/lib/utils/chat';

const ReceivedMessage = ({ message }: { message: Message }) => {
  const [isDone, setIsDone] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const type = message.type !== 'notice' ? message.type : 'common';
  const color = isDone ? 'disabled' : 'secondary';
  const time = formatTo12HourTime(message.sent_at);

  const sender = message.type !== 'notice' ? message.sender_id : null;

  useEffect(() => {
    if (!sender) return;
    (async () => {
      const profileData = await getUserProfile(sender);
      setProfile(profileData);
    })();
  }, [sender]);

  return (
    <div className="flex justify-start gap-2 py-2">
      <ProfileImage src={profile?.profileImg ?? ''} alt="content" size={'medium'} />
      <ChatBubble type={type} color={color} content={message.content} />
      <p className="flex items-end text-xs font-light text-neutral-500">{time}</p>
    </div>
  );
};

export default ReceivedMessage;
