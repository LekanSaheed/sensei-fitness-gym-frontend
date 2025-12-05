import React, { FunctionComponent, ReactNode } from "react";

const HeadingText: FunctionComponent<{
  children: ReactNode;
  className?: string;
  centered?: boolean;
}> = ({ children, className, centered }) => {
  return (
    <h1
      className={`text-[35px] md:text-[40px] lg:text-[50px] xl:text-[60px] font-league tracking-tight ${
        className || ""
      } ${centered ? "text-center" : ""} uppercase`}
    >
      {children}
    </h1>
  );
};

export default HeadingText;
