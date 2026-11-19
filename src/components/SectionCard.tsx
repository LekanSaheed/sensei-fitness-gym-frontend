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
  /** Makes the card a filter button */
  onClick?: () => void;
  /** Highlights the card as the active filter */
  selected?: boolean;
  /** Tooltip / accessible hint for clickable cards */
  title?: string;
}

const SectionCard: FunctionComponent<SectionCardProps> = ({
  description,
  value,
  footer,
  loading,
  dropdown = { selected: null, options: [], keyName: "" },
  classNames,
  onClick,
  selected,
  title,
}) => {
  const [open, setOpen] = useState(false);

  const updateSearchParams = useUpdateSearchParams();
  return (
    <Card
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick ? !!selected : undefined}
      title={title}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`relative h-full gap-3 py-5 !bg-none !bg-white rounded-[18px] !shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.08)] transition hover:border-default/40 ${
        selected
          ? "border-default ring-4 ring-default/15"
          : "border-gray-200/80"
      } ${
        onClick
          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-default/30"
          : ""
      }`}
    >
      <CardHeader>
        <CardDescription
          className={`text-[11px] font-semibold uppercase tracking-wider text-gray-500 ${
            dropdown?.options?.length > 1 ? "pr-20" : ""
          }`}
        >
          {description}
        </CardDescription>
        <CardTitle
          className={`text-[26px] font-black tracking-tight tabular-nums lg:text-[32px] ${
            classNames?.value || ""
          }`}
        >
          {loading ? (
            <div className="animate-pulse h-[26px] w-[55%] bg-gray-100 rounded-[8px] lg:h-[32px]" />
          ) : (
            (value as string)
          )}
        </CardTitle>
        {dropdown?.options?.length > 1 && (
          <div className="absolute top-6 right-6">
            <div className="relative">
              <div
                className="text-[11px] flex gap-1 items-center rounded-full bg-gray-100 px-2.5 py-1 justify-between cursor-pointer hover:bg-gray-200 transition"
                onClick={() => setOpen(!open)}
              >
                <span className="whitespace-nowrap">
                  {dropdown?.selected?.label}
                </span>
                <ArrowDown2
                  size={10}
                  color="var(--color-secondary-foreground)"
                />
              </div>
              {open && (
                <ul className="absolute bg-white w-[140px] right-0 mt-1 shadow-xl rounded-[14px] border border-gray-200 p-1 z-[100]">
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
                        className={`text-[12px] rounded-[10px] cursor-pointer px-2.5 py-1.5 hover:bg-gray-100 ${
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
          </div>
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
