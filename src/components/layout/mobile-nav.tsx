import { nav_links } from "@/constants";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const useIsSubPath = () => {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);

  const isSubPath = pathSegments.length > 2;

  return isSubPath;
};

const MobileNav = () => {
  const pathname = usePathname();

  const isSubPath = useIsSubPath();

  return (
    <AnimatePresence>
      {!isSubPath && (
        <motion.nav
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: "0" }}
          exit={{ opacity: 0, y: "100%" }}
          className="fixed left-0 right-0 bottom-0 z-[3] px-4 pb-4 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto sm:max-w-[560px] flex items-center justify-around rounded-[26px] bg-white/90 backdrop-blur-md border border-gray-200 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] px-1.5 sm:px-3 h-[68px] dark:bg-card/90 dark:border-border">
            {nav_links.map((link, id) => {
              const isHome = link?.label === "Home";

              const isActive = link?.path === pathname;

              if (isHome) {
                return (
                  <Link
                    key={id}
                    href={link.path}
                    aria-label={link.label}
                    aria-current={isActive ? "page" : undefined}
                    className={`-mt-9 mx-1 size-[60px] shrink-0 inline-flex items-center justify-center rounded-full ring-[6px] ring-[#f2f2f2] dark:ring-background transition active:scale-95 ${
                      isActive
                        ? "bg-default shadow-[0_8px_20px_-6px_var(--color-default)]"
                        : "bg-default-black dark:bg-secondary"
                    }`}
                  >
                    {React.createElement(link.icon, {
                      color: isActive ? "#fff" : "var(--color-default)",
                      variant: "Bold",
                      size: 26,
                    })}
                  </Link>
                );
              }

              return (
                <Link
                  key={id}
                  href={link?.path}
                  aria-current={isActive ? "page" : undefined}
                  className="flex-1 min-w-0 inline-flex flex-col items-center justify-center gap-1 transition active:scale-95"
                >
                  {React.createElement(link.icon, {
                    color: isActive
                      ? "var(--color-default)"
                      : "var(--color-gray-400)",
                    variant: isActive ? "Bold" : "Linear",
                    size: 22,
                  })}
                  <span
                    className={`text-[10.5px] sm:text-[11px] tracking-wide whitespace-nowrap ${
                      isActive
                        ? "text-default font-semibold"
                        : "text-gray-500 dark:text-muted-foreground"
                    }`}
                  >
                    {link?.label}
                  </span>
                  <span
                    className={`h-[3px] rounded-full bg-default transition-all ${
                      isActive ? "w-4" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
