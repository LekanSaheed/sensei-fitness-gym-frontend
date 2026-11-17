import React, { FunctionComponent, ReactNode } from "react";

/** White panel for admin pages that hold inputs, matching the admin cards */
const FormCard: FunctionComponent<{
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}> = ({ title, description, children, className }) => (
  <section
    className={`bg-white rounded-[18px] border border-gray-200/80 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.08)] p-5 md:p-7 ${
      className || ""
    }`}
  >
    {(title || description) && (
      <header className="mb-5 pb-4 border-b border-gray-100">
        {title && (
          <h2 className="text-[16px] font-bold tracking-tight">{title}</h2>
        )}
        {description && (
          <p className="text-[13px] text-gray-500 mt-1">{description}</p>
        )}
      </header>
    )}
    {children}
  </section>
);

export default FormCard;
