import React, { ReactNode } from "react";

const Heading = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <h1
      className={`font-bold text-[14px] tracking-tight mb-2 ${className || ""}`}
    >
      {children}
    </h1>
  );
};

export default Heading;
