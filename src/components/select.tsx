import React, {
  FocusEventHandler,
  FunctionComponent,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";

import { ArrowDown2, Check } from "iconsax-react";
import { useDetectOutsideClick } from "@/hooks/useDetectOutsideClick";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import InputProvider from "./providers/input-provider";

export interface SelectDropdownOption {
  label: string;
  value: unknown;
  img?: string;
  externalId?: unknown;
}

interface ISelectProps {
  label: string;
  options: SelectDropdownOption[];
  selected: SelectDropdownOption;
  onSelect: (option: SelectDropdownOption) => void;
  placeholder: string;
  error?: string;
  onBlur: FocusEventHandler<HTMLInputElement>;
  loading?: boolean;
  removeDropdownIcon?: boolean;
  remove_margin?: boolean;
  containerClassName?: string;
}
const Select: FunctionComponent<Partial<ISelectProps>> = ({
  label,
  options,
  selected,
  onSelect,
  placeholder,
  error,
  loading,
  removeDropdownIcon,
  remove_margin,
  containerClassName,

  ...props
}) => {
  const [open, setOpen] = useState(false);

  const [options_, setOptions] = useState<SelectDropdownOption[] | undefined>(
    []
  );

  useEffect(() => {
    setOptions(options);
  }, [options]);
  const ref = useRef<HTMLDivElement | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useDetectOutsideClick(ref, setOpen, ["mousedown"]);

  const searchOptions = (str: string) => {
    if (!str) setOptions(options);

    const n = str?.trim()?.toLowerCase();
    const searchOption = options?.filter(
      (a) =>
        a?.label?.toLowerCase().includes(n) ||
        `${a?.value}`.toLowerCase().includes(n)
    );

    setOptions(searchOption || []);
  };

  return (
    <div className="">
      <InputProvider
        mainContainerClassName="pointer-events-none"
        label={label!}
        error={error}
        innerRef={ref}
        remove_margin={remove_margin}
      >
        <div
          className={`pointer-events-auto relative flex items-center border border-gray-400 focus-within:border-default rounded-[5px] ${
            containerClassName || ""
          }`}
        >
          {!inputRef?.current?.value && (
            <div className="absolute   px-2 flex items-center text-[14px] inset-0 pointer-events-none">
              {selected?.img && (
                <div className="mr-2 h-[22px] w-[22px] relative rounded-full border border-default/50 overflow-hidden">
                  <Image
                    className="object-contain"
                    src={selected?.img}
                    fill
                    alt="IMAGE"
                  />
                </div>
              )}
              {selected?.label}
            </div>
          )}
          <input
            ref={inputRef}
            placeholder={!selected ? placeholder || "Select..." : ""}
            onFocus={() => setOpen(true)}
            className="font-light  flex-1 bg-transparent rounded-tl-[8px] rounded-bl-[8px] text-[14px] h-[40px]  outline-none px-2
            placeholder:text-[14px] w-full  placeholder:text-gray-700"
            onChange={(e) => searchOptions(e.target.value)}
            onBlur={props?.onBlur}
          />
          {!removeDropdownIcon && (
            <div className="px-2">
              <ArrowDown2
                color="var(--color-gray-500)"
                onClick={() => setOpen(!open)}
                size={18}
              />
            </div>
          )}
        </div>

        {open && (
          <ul
            className="bg-white pointer-events-auto min-h-[50px] max-h-[340px]
         overflow-y-auto absolute right-0 left-0 backdrop-blur-[200px]
          !z-[50] mt-2 rounded-[10px] border border-gray-300"
          >
            {options_?.map((option, id) => {
              const isSelected = option?.value === selected?.value;
              return (
                <li
                  className={`py-2 px-4 flex hover:bg-gray-100 items-center justify-between text-gray-900 text-[14px] cursor-pointer ${
                    isSelected && "!text-default !bg-default/5"
                  }`}
                  key={`${option?.label}-${option?.value}-${id}`}
                  onClick={() => {
                    setOpen(false);
                    if (onSelect) {
                      onSelect(option);
                    }
                    if (inputRef?.current) {
                      inputRef.current.value = "";
                    }
                  }}
                >
                  <div className="flex items-center ">
                    {option?.img && (
                      <div
                        className="mr-2 h-[22px] w-[22px] relative rounded-full
                  border border-default/50 overflow-hidden"
                      >
                        <Image
                          sizes="22px"
                          className="object-contain"
                          src={option?.img}
                          fill
                          alt="IMAGE"
                        />
                      </div>
                    )}
                    {option.label}
                  </div>
                  {isSelected && <FaCheck />}
                </li>
              );
            })}
            {loading && (
              <div className="text-center  text-[12px] font-light  absolute inset-0 flex items-center justify-center">
                Loading please wait
              </div>
            )}
            {options_ && options_?.length < 1 && !loading && (
              <div className="text-center text-gray-600 text-[12px] font-light  absolute inset-0 flex items-center justify-center">
                No Option
              </div>
            )}
          </ul>
        )}
      </InputProvider>
    </div>
  );
};

export default Select;
