import React, { FunctionComponent, ReactNode } from "react";

/** Landing page section heading: gold eyebrow, big League Gothic title, intro. */
const SectionHeader: FunctionComponent<{
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}> = ({ eyebrow, title, description, align = "center", className }) => {
  const centered = align === "center";

  return (
    <div
      className={`mb-10 md:mb-14 ${
        centered ? "text-center mx-auto max-w-[620px]" : ""
      } ${className || ""}`}
    >
      <p
        className={`inline-flex items-center gap-2 text-[11px] md:text-[12px] uppercase tracking-[0.3em] text-default mb-3 ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-6 bg-default" />
        {eyebrow}
        {centered && <span className="h-px w-6 bg-default" />}
      </p>
      <h2 className="font-league uppercase leading-[0.95] tracking-tight text-[42px] md:text-[56px] lg:text-[68px]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[14px] md:text-[16px] text-white/60 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
