"use client";

import React, {
  FunctionComponent,
  ButtonHTMLAttributes,
  CSSProperties,
} from "react";
import { Icon, IconProps } from "iconsax-react";

import { LayoutGroup, motion } from "framer-motion";
import Spinner from "./Spinner";
import { Permission, useUserCanPerformAction } from "@/hooks/usePermissions";

export interface ButtonProps {
  label: string;
  variant?: "contained" | "outlined" | "ghost";
  color?: "default" | "black" | "white" | "gray";
  font?: "bold" | "regular";
  className?: string;
  icon?: Icon;
  iconVariant?: IconProps["variant"];
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  loading?: boolean;
  style?: CSSProperties;
  fullRadius?: boolean;
  shadow?: boolean;
  halfFull?: boolean;
  rtl?: boolean;
  iconClass?: string;
  iconSize?: number;
  permissions?: Permission[];
}
const Button: FunctionComponent<ButtonProps> = ({
  label,
  variant = "contained",
  color = "default",
  font = "bold",
  className,
  icon,
  iconVariant = "Linear",
  size = "md",
  onClick,
  fullWidth,
  disabled = false,
  type,
  loading = false,
  style,
  fullRadius,
  shadow = false,
  halfFull = false,
  rtl = false,
  iconClass,
  iconSize,
  permissions = [],
}) => {
  const variantIsContained = variant === "contained";
  const variantIsGhost = variant === "ghost";

  const colors = {
    default: `${
      variantIsContained
        ? "bg-default disabled:!opacity-70"
        : variantIsGhost
        ? "!border-none bg-none !text-default disabled:!text-inactive"
        : "!text-default !border !border-default disabled:border-default/70 disabled:!text-default/70"
    }`,
    black: `${
      variantIsContained
        ? "bg-black disabled:!opacity-70 dark:!bg-primary dark:text-primary-foreground "
        : variantIsGhost
        ? "!text-black bg-none disabled:!text-gray-400"
        : "!text-black !border  !border-black disabled:bg-gray-400 disabled:!border-inactive disabled:!text-inactive dark:!text-white dark:!border-white"
    }`,

    white: "!text-[#fff] !border-[#fff]",
    gray: `${
      variantIsContained
        ? "bg-gray-500 text-white disabled:!bg-gray-400"
        : variantIsGhost
        ? "!text-gray-500 disabled:bg-gray-500/50 "
        : "!border-gray-500 text-gray-500"
    }`,
  };

  const fonts = {
    bold: "font-bold",
    regular: "font-normal",
  };

  const sizes = {
    sm: "text-[12px] px-[15px] py-[5px] leading-[22px]",
    md: "px-[25px] py-[10px] text-[12px] leading-[18px]",
    lg: "py-[15px] px-[25px] text-[14px] leading-[120%]",
  };

  const selectedColor: string = colors[color];
  const selectedFont: string = fonts[font];
  const selectedSize: string = sizes[size];

  const canPerformAction = useUserCanPerformAction();

  if (!canPerformAction(permissions)) return <></>;

  return (
    <motion.button
      style={{
        ...style,
        boxShadow: shadow ? "0px 20px 20px 0px rgba(0, 0, 0, 0.10)" : "",
      }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`rounded-[10px] backdrop-blur-sm cursor-pointer active:opacity-50 transition active:scale-[0.9]  text-white border border-transparent ${
        fullWidth ? "w-full flex items-center justify-center" : ""
      }  ${selectedColor} ${selectedFont} ${selectedSize} ${
        fullRadius ? "rounded-full" : ""
      }  ${
        halfFull && "!px-[90px] rounded-full !py-[15px] !text-[14px]"
      } ${className}`}
    >
      <LayoutGroup>
        <motion.div
          className={`flex gap-[10px] items-center ${
            rtl ? "flex-row-reverse" : ""
          }`}
        >
          {icon && !loading && (
            <motion.div className={`${iconClass || ""}`}>
              {React.createElement(icon, {
                size: iconSize || 16,
                variant: iconVariant,
              })}
            </motion.div>
          )}
          {!loading && (
            <motion.label className="select-none font-sofia whitespace-nowrap pointer-events-none  tracking-n-2">
              {label}
            </motion.label>
          )}
          {loading && (
            <motion.div>
              <Spinner className="text-[15px]" />
              {/* <Spinner sxclass="text-[20px] " /> */}
            </motion.div>
          )}
        </motion.div>
      </LayoutGroup>
    </motion.button>
  );
};

export default Button;
