import React, { FunctionComponent, TextareaHTMLAttributes } from "react";
import InputProvider, { InputProviderProps } from "./providers/input-provider";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea: FunctionComponent<
  TextAreaProps & Partial<InputProviderProps>
> = ({
  error,
  label,
  loading,
  mainContainerClassName,
  remove_margin,
  showAsterisk,
  topRight,
  className,
  ...props
}) => {
  return (
    <InputProvider
      label={label}
      loading={loading}
      mainContainerClassName={mainContainerClassName}
      remove_margin={remove_margin}
      showAsterisk={showAsterisk}
      topRight={topRight}
      error={error}
    >
      <div
        aria-disabled={props?.disabled || loading}
        className={`border flex items-center relative z-1 overflow-hidden 
      transition focus-within:border-default ${
        label ? "rounded-[5px]" : "rounded-[10px]"
      } border-gray-400 aria-disabled:bg-gray-300  ${className}`}
      >
        <textarea
          className="min-h-[60px] pt-2 placeholder:tracking-[-0.28px] text-[14px] bg-transparent outline-none w-full resize-none px-[15px] placeholder:text-[12px]"
          {...props}
        />
      </div>
    </InputProvider>
  );
};

export default TextArea;
