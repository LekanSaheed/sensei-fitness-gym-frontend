import React, { FunctionComponent, ReactNode } from "react";

const HeadingText: FunctionComponent<{
  children: ReactNode;
  className?: string;
  centered?: boolean;
}> = ({ children, className, centered }) => {
  return (
    <h1
      className={`text-[35px] font-league tracking-wide ${className || ""} ${
        centered ? "text-center" : ""
      } uppercase`}
    >
      {children}
    </h1>
  );
};

export default HeadingText;
