import React from "react";
import { Eye, Flag, Icon } from "iconsax-react";
import SectionHeader from "./section-header";

const VisionAndMission = () => {
  const items: { title: string; text: string; icon: Icon; accent: boolean }[] =
    [
      {
        title: "Vision",
        text: "Become a leading fitness brand in Nigeria, Africa and the world",
        icon: Eye,
        accent: true,
      },
      {
        title: "Mission",
        text: "Promote wellness and transform lifestyles through expert training, nutrition and accountability.",
        icon: Flag,
        accent: false,
      },
    ];

  return (
    <section className="bg-default-black py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="What drives us"
          title={
            <>
              Our <span className="text-default">Mission & Vision</span>
            </>
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className={`relative overflow-hidden rounded-[28px] p-8 md:p-10 ${
                item.accent
                  ? "bg-default text-black"
                  : "border border-default/40 bg-white/[0.03]"
              }`}
            >
              <span
                className={`pointer-events-none absolute -right-6 -bottom-10 font-league uppercase text-[140px] leading-none ${
                  item.accent ? "text-black/10" : "text-white/[0.04]"
                }`}
              >
                {item.title}
              </span>
              <span
                className={`relative size-12 rounded-full inline-flex items-center justify-center mb-6 ${
                  item.accent ? "bg-black" : "bg-default"
                }`}
              >
                {React.createElement(item.icon, {
                  size: 22,
                  variant: "Bold",
                  color: item.accent
                    ? "var(--color-default)"
                    : "var(--color-white)",
                })}
              </span>
              <h3 className="relative font-league uppercase text-[40px] leading-none mb-3">
                {item.title}
              </h3>
              <p
                className={`relative text-[17px] md:text-[19px] leading-relaxed max-w-[460px] ${
                  item.accent ? "text-black/80" : "text-white/70"
                }`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionAndMission;
