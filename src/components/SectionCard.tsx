"use client";
import React, { FunctionComponent, ReactNode, useState } from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { DropdownOption } from "./select-input";
import { ArrowDown2 } from "iconsax-react";
import { useUpdateSearchParams } from "@/hooks/useSearchParams";

export interface SectionCardProps {
  description: string;
  value: unknown;
  footer?: ReactNode;
  loading?: boolean;
  dropdown?: {
    selected?: DropdownOption | null;
    options: DropdownOption[];
    keyName: string;
  };
  classNames?: Partial<{
    value: string;
  }>;
}

const SectionCard: FunctionComponent<SectionCardProps> = ({
  description,
  value,
  footer,
  loading,
  dropdown = { selected: null, options: [], keyName: "" },
  classNames,
}) => {
  const [open, setOpen] = useState(false);

  const updateSearchParams = useUpdateSearchParams();
  return (
    <Card className="relative border-gray-300">
      <CardHeader>
        <CardDescription className="">{description}</CardDescription>
        <CardTitle
          className={`text-2xl font-semibold  lg:text-3xl ${
            classNames?.value || ""
          }`}
        >
          {loading ? (
            <div className="animate-pulse h-[15px] w-[60%] bg-slate-200 rounded-[10px] lg:h-[30px]" />
          ) : (
            (value as string)
          )}
        </CardTitle>
        {dropdown?.options?.length > 1 && (
          <CardAction>
            <div className="relative">
              <div
                className="text-[10px] flex gap-1 items-center border-b border-black/80 justify-between cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <span className="whitespaces-nowrap">
                  {dropdown?.selected?.label}
                </span>
                <ArrowDown2
                  size={10}
                  color="var(--color-secondary-foreground)"
                />
              </div>
              {open && (
                <ul className="absolute bg-white w-[120px] right-0 shadow-xl rounded-[10px] border border-gray-300 p-1">
                  {dropdown?.options?.map((option) => {
                    const isSelected =
                      option?.value === dropdown?.selected?.value;
                    return (
                      <li
                        onClick={() => {
                          updateSearchParams(
                            dropdown?.keyName,
                            option?.value as string
                          );
                          setOpen(false);
                        }}
                        key={`${option?.label}_${String(option?.value)}`}
                        className={`text-[10px] rounded-[4px] mb-1 cursor-pointer px-2 py-0.5 hover:bg-gray-100 ${
                          isSelected ? "bg-default/10 text-default" : ""
                        }`}
                      >
                        {option?.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </CardAction>
        )}
      </CardHeader>

      {footer && (
        <CardFooter className="text-sm">
          <div className="line-clamp-1 font-medium">{footer}</div>
        </CardFooter>
      )}
    </Card>
  );
};

export default SectionCard;
