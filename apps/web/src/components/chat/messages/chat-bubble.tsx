import { tv } from 'tailwind-variants';

const style = tv({
  base: 'inline-block p-3 rounded-xl text-sm break-words whitespace-pre-wrap',
  variants: {
    color: {
      secondary: 'bg-primary-50/70 text-primary-950 max-w-3/5',
      primary: 'bg-primary-500 text-neutral-50 max-w-2/3',
      disabled: 'bg-neutral-100 text-primary-950',
    },
    type: {
      common: '',
      image: 'p-0 rounded-2xl overflow-hidden bg-neutral-100 w-[60%]',
    },
  },
  defaultVariants: {
    color: 'primary',
    type: 'common',
  },
});

interface ChatBubbleProps {
  color: 'primary' | 'secondary' | 'disabled';
  content: string;
  type: 'common' | 'image';
}

const ChatBubble = ({ color, content, type }: ChatBubbleProps) => {
  return <div className={style({ color, type })}>{content}</div>;
};

export default ChatBubble;
