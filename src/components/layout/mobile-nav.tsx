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
          className="fixed left-0 right-0 bg-white bottom-0 border-t border-t-gray-300 dark:bg-secondary dark:border-border"
        >
          <div className="flex justify-evenly p-3">
            {nav_links.map((link, id) => {
              const isHome = link?.label === "Home";

              const isActive = link?.path === pathname;
              return (
                <Link
                  className={`inline-flex items-center text-center flex-col  ${
                    isHome
                      ? `size-[55px] shrink-0 inline-flex items-center justify-center border border-default shsadow-[0px_7px_10px_2px_rgb(0,0,0,0.4)] rounded-full -mt-[30px] ${
                          isActive
                            ? "bg-default !text-white "
                            : "bg-white dark:bg-card"
                        }`
                      : " w-[20%]"
                  }`}
                  href={link?.path}
                  key={id}
                >
                  {React.createElement(link.icon, {
                    color: isHome && isActive ? "#fff" : "var(--color-default)",
                    variant: isActive ? "Bold" : "Outline",
                  })}
                  {!isHome && (
                    <span className="text-[12px] mt-1">{link?.label}</span>
                  )}
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
