import React, { ReactNode } from "react";

const Heading = ({ children }: { children: ReactNode }) => {
  return (
    <h1 className="font-bold text-[14px] tracking-tight mb-2">{children}</h1>
  );
};

export default Heading;
