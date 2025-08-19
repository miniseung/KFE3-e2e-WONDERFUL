interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
}

const InputPersonalInfo = ({ id, label, ...props }: InputProps) => {
  return (
    <div className="flex w-full flex-col justify-center p-2">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-neutral-600">
          {label}
        </label>
      )}
      <input
        id={id}
        name={id}
        {...props}
        className={
          'focus-visible:border-primary-500 focus-visible:ring-primary-500/10 focus-visible:border-b-1.5 placeholder:font-regular placeholder: border-b border-neutral-200 px-2 py-3 text-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-0'
        }
      />
    </div>
  );
};

export default InputPersonalInfo;
