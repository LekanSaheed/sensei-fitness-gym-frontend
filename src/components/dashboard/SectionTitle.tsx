import React, { ReactNode } from "react";

const SectionTitle = ({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) => (
  <div className="flex items-end justify-between gap-2 mb-3">
    <h2 className="font-league uppercase text-[24px] leading-none tracking-wide">
      {children}
    </h2>
    {action}
  </div>
);

export default SectionTitle;
