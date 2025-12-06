"use client";

import React, {
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
  RefObject,
  useState,
} from "react";
import InputProvider, { InputProviderProps } from "./providers/input-provider";

import { currency } from "@/constants";
import { Eye, EyeSlash } from "iconsax-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  appendImage: string;
  isCurrency: boolean;
  label: string;
  toggle: boolean;
  appendRight: ReactNode;
  inputClassName: string;
  info: ReactNode;
  innerRef: RefObject<HTMLInputElement | null>;
  dark: boolean;
}

const Input: FunctionComponent<
  Partial<InputProviderProps> & Partial<InputProps>
> = ({
  label,
  loading,
  mainContainerClassName,
  remove_margin,
  showAsterisk,
  topRight,
  error,
  className,
  appendImage,
  isCurrency,
  type,
  inputClassName,
  toggle,
  appendRight,
  info,
  value,
  innerRef,
  dark,
  ...props
}) => {
  const [show, setShow] = useState(false);
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
        {appendImage && (
          <div className="relative shrink-0 rounded-[5px] overflow-hidden h-[30px] w-[30px] ml-1.5">
            <img
              src={appendImage}
              className="object-cover absolute inset-0 w-full h-full"
            />
          </div>
        )}
        {isCurrency && (
          <div className="text-[14px] mr-[5px] ml-[15px] ">{currency}</div>
        )}

        <input
          disabled={loading || props.disabled}
          ref={innerRef}
          min={props.min || 0}
          type={type === "password" ? (show ? "text" : "password") : type}
          value={value}
          className={`w-full placeholder:text-[12px] placeholder:text-inactive placeholder:tracking-[-0.28px] text-[14px] 
          bg-transparent border-none outline-none h-[40px] px-[15px] ${
            isCurrency ? "!pl-0" : ""
          } ${inputClassName}`}
          {...(props as InputProps)}
          onKeyDown={(e) => {
            if (type === "number") {
              if (e.key === "e" || e.keyCode === 69) {
                e.preventDefault();
              }
            }
          }}
          placeholder={
            isCurrency
              ? !value
                ? props?.placeholder || ""
                : ""
              : props?.placeholder || ""
          }
        />

        {toggle && (
          <div
            onClick={() => setShow(!show)}
            className="shrink-0 h-[38px]  w-[47px] flex items-center justify-center cursor-pointer border-l border-l-gray-400"
          >
            {show ? (
              <EyeSlash color={dark ? "white" : "black"} size={22} />
            ) : (
              <Eye color={dark ? "white" : "black"} size={22} />
            )}
          </div>
        )}
        {appendRight}
      </div>
      {!error && info && (
        <p className="text-[10px] mt-1 text-gray-500 tracking-n-2">{info}</p>
      )}
    </InputProvider>
  );
};

export default Input;
