'use client';

import { useState } from 'react';

import { Plus } from 'lucide-react';

import {
  ButtonAccount,
  ButtonAddress,
  ChatInputForm,
  InputCamera,
  InputImage,
} from '@/components/chat';
import { Button } from '@/components/ui';

const InputBar = ({ roomId }: { roomId: string }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const rotate = isClicked ? 'rotate-45' : '';

  return (
    <div className="flex w-full flex-col justify-end">
      <div className="flex items-center gap-2 p-2">
        <Button color="transparent" size="medium" onClick={handleClick}>
          <Plus className={`duration-600 text-neutral-500 transition-transform ${rotate}`} />
        </Button>
        <ChatInputForm roomId={roomId} />
      </div>
      {isClicked && (
        <div className="flex justify-around gap-2 px-4 pb-[15%] pt-2">
          <InputImage />
          <InputCamera />
          <ButtonAddress roomId={roomId} />
          <ButtonAccount roomId={roomId} />
        </div>
      )}
    </div>
  );
};

export default InputBar;
