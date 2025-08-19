import React from 'react';

interface InputIconProps extends Omit<React.HTMLProps<HTMLInputElement>, 'children'> {
  id: string;
  label?: string;
  iconStyle: string;
  children?: React.ReactNode;
  value?: string;
}

const InputIcon = ({ id, label, children, iconStyle, value, ...props }: InputIconProps) => {
  const leftIcon = iconStyle === 'left' || 'both' ? React.Children.toArray(children)[0] : '';
  const rightIcon =
    iconStyle === 'right'
      ? React.Children.toArray(children)[0]
      : iconStyle === 'both'
        ? React.Children.toArray(children)[1]
        : '';

  return (
    <div className="flex w-full flex-col items-start justify-center gap-2">
      {label && (
        <label className="font-medium" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="shadow-xs focus-within:border-primary-400 flex h-14 w-full min-w-0 items-center justify-between rounded-sm border bg-transparent px-4 py-1 text-base text-neutral-400 transition-[color,box-shadow] focus-within:ring-[2px] focus-within:ring-neutral-400/50 md:text-sm">
        <div className="flex w-full items-center gap-2 [&>svg]:h-5 [&>svg]:w-5">
          {leftIcon}
          <input
            id={id}
            value={value}
            {...props}
            className="file:text-foreground aria-invalid:ring-danger-700/20 aria-invalid:border-danger-700 selection:text-primary-500 w-full text-black file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus:shadow-none focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="[&>button>svg]:h-5 [&>button>svg]:w-5 [&>svg]:h-5 [&>svg]:w-5">
          {rightIcon}
        </div>
      </div>
    </div>
  );
};

export default InputIcon;
